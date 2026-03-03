"use server";

import { getDb } from "@/db";
import { heroSection, aboutSection, expertise } from "@/db/schema";
import {
    HeroSectionSchema,
    AboutSectionSchema,
    ExpertiseSchema
} from "@/types/homepage";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getCloudflareContext } from "@opennextjs/cloudflare";

// --- GETTERS ---

const HOMEPAGE_CACHE_KEY = "homepage_data";

export const getHomepageData = async () => {
    try {
        const { env } = getCloudflareContext() as unknown as { env: CloudflareEnv };
        const kv = env.portfolio_kv;

        // 1. Check KV Cache
        const cachedData = await kv.get(HOMEPAGE_CACHE_KEY);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        // 2. Fallback to DB
        const db = await getDb();

        const [hero] = await db.select().from(heroSection).limit(1);
        const [about] = await db.select().from(aboutSection).limit(1);
        const expertiseList = await db.select().from(expertise);

        const publicUrl = env.R2_PUBLIC_URL || "";
        let finalHeroImageUrl = hero?.imageUrl || "";

        // Auto-prefix if it's just a filename and we have a public URL
        if (finalHeroImageUrl && !finalHeroImageUrl.startsWith("http") && publicUrl) {
            finalHeroImageUrl = `${publicUrl}/${finalHeroImageUrl}`;
        }

        const data = {
            hero: hero ? { ...hero, imageUrl: finalHeroImageUrl } : null,
            about: about || null,
            expertise: expertiseList.map(e => ({
                ...e,
                content: JSON.parse(e.content) as string[]
            }))
        };

        // 3. Store in KV for future requests (cache for 24h)
        await kv.put(HOMEPAGE_CACHE_KEY, JSON.stringify(data), {
            expirationTtl: 86400
        });

        return data;
    } catch (error) {
        console.error("Failed to fetch homepage data:", error);
        return { error: "Failed to load homepage content." };
    }
};

// Helper to invalidate cache
const invalidateHomepageCache = async () => {
    try {
        const { env } = getCloudflareContext() as unknown as { env: CloudflareEnv };
        await env.portfolio_kv.delete(HOMEPAGE_CACHE_KEY);
    } catch (e) {
        console.error("Failed to invalidate KV cache:", e);
    }
};

// --- SETTERS / UPDATERS ---

import { uploadFileToR2 } from "./utils/r2_client";

export const updateHeroSection = async (formData: FormData) => {
    console.log("updateHeroSection: Starting action");
    try {
        const context = getCloudflareContext();
        if (!context) {
            console.error("updateHeroSection: Cloudflare context is missing!");
            return { error: "Execution environment error: Cloudflare context missing." };
        }

        const { env } = context as unknown as { env: CloudflareEnv };
        console.log("updateHeroSection: Env keys:", Object.keys(env || {}));

        const db = await getDb();
        if (!db) {
            console.error("updateHeroSection: Database connection failed!");
            return { error: "Database connection failed." };
        }

        // Safely extract data from FormData to avoid null values causing Zod to fail
        const data = {
            heading: (formData.get("heading") as string) || "",
            subHeading: (formData.get("subHeading") as string) || "",
            imgTextHeading: (formData.get("imgTextHeading") as string) || "",
            imgTextSubHeading: (formData.get("imgTextSubHeading") as string) || "",
            imageUrl: (formData.get("imageUrl") as string) || "",
        };

        console.log("updateHeroSection: Validating data", { ...data, imageUrl: data.imageUrl ? "present" : "missing" });

        const validation = HeroSectionSchema.safeParse(data);
        if (!validation.success) {
            console.warn("updateHeroSection: Validation failed", validation.error.flatten().fieldErrors);
            return { error: validation.error.flatten().fieldErrors };
        }

        const file = formData.get("file") as File;
        let finalImageUrl = data.imageUrl || "";

        // If a new file is uploaded, process it
        if (file && typeof file !== "string" && file.size > 0) {
            console.log(`updateHeroSection: Processing file upload: ${file.name} (${file.size} bytes)`);
            try {
                const r2Bucket = env["portfolio-r2"];
                if (!r2Bucket) {
                    console.error("updateHeroSection: R2 Bucket binding 'portfolio-r2' is missing!");
                    return { error: "Cloudflare configuration error: R2 bucket binding missing." };
                }

                const filename = await uploadFileToR2(file);
                const publicUrl = env.R2_PUBLIC_URL || "";
                finalImageUrl = publicUrl ? `${publicUrl}/${filename}` : filename;
                console.log(`updateHeroSection: File uploaded successfully: ${finalImageUrl}`);
            } catch (uploadError: any) {
                console.error("updateHeroSection: R2 Upload Error Details:", uploadError);
                return { error: `Image upload failed: ${uploadError.message || "Unknown R2 error"}` };
            }
        }

        // Final check: imageUrl is notNull in DB
        if (!finalImageUrl) {
            return { error: "Hero image is required (either existing URL or new upload)." };
        }

        console.log("updateHeroSection: Updating database...");
        const existing = await db.select().from(heroSection).limit(1);

        if (existing.length > 0) {
            await db.update(heroSection)
                .set({
                    ...validation.data,
                    imageUrl: finalImageUrl,
                    updatedAt: new Date()
                })
                .where(eq(heroSection.id, existing[0].id));
            console.log("updateHeroSection: Database updated successfully (UPDATE)");
        } else {
            await db.insert(heroSection).values({
                ...validation.data,
                imageUrl: finalImageUrl,
            } as any);
            console.log("updateHeroSection: Database updated successfully (INSERT)");
        }

        revalidatePath("/");
        await invalidateHomepageCache();

        return {
            success: "Hero section updated successfully!",
            imageUrl: finalImageUrl
        };
    } catch (error: any) {
        console.error("updateHeroSection: FATAL ACTION ERROR:", error);
        // Include stack trace in dev if possible, but safely
        return {
            error: error.message || "An unexpected error occurred while updating the hero section.",
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined
        };
    }
};

export const updateAboutSection = async (data: any) => {
    const validation = AboutSectionSchema.safeParse(data);
    if (!validation.success) return { error: validation.error.flatten().fieldErrors };

    try {
        const db = await getDb();
        const existing = await db.select().from(aboutSection).limit(1);

        if (existing.length > 0) {
            await db.update(aboutSection)
                .set({ ...validation.data, updatedAt: new Date() })
                .where(eq(aboutSection.id, existing[0].id));
        } else {
            await db.insert(aboutSection).values(validation.data as any);
        }

        revalidatePath("/");
        await invalidateHomepageCache();
        return { success: "About section updated successfully!" };
    } catch (error) {
        return { error: "Failed to update about section." };
    }
};

export const updateExpertise = async (data: { id?: number; heading: string; content: string[] }) => {
    const validation = ExpertiseSchema.safeParse(data);
    if (!validation.success) return { error: validation.error.flatten().fieldErrors };

    try {
        const db = await getDb();
        const { heading, content } = validation.data;
        const stringifiedContent = JSON.stringify(content);

        if (data.id) {
            await db.update(expertise)
                .set({ heading, content: stringifiedContent, updatedAt: new Date() })
                .where(eq(expertise.id, data.id));
        } else {
            await db.insert(expertise).values({
                heading,
                content: stringifiedContent,
            });
        }

        revalidatePath("/");
        await invalidateHomepageCache();
        return { success: "Expertise updated successfully!" };
    } catch (error) {
        return { error: "Failed to update expertise." };
    }
};

export const deleteExpertise = async (id: number) => {
    try {
        const db = await getDb();
        await db.delete(expertise).where(eq(expertise.id, id));
        revalidatePath("/");
        await invalidateHomepageCache();
        return { success: "Expertise deleted successfully!" };
    } catch (error) {
        return { error: "Failed to delete expertise." };
    }
};
