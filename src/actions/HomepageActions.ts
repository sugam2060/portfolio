"use server";

import { getDb } from "@/db";
import { heroSection, aboutSection, expertise } from "@/db/schema";
import {
    HeroSectionSchema,
    AboutSectionSchema,
    ExpertiseSchema
} from "@/types/homepage";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- GETTERS ---

export const getHomepageData = async () => {
    try {
        const db = await getDb();

        const [hero] = await db.select().from(heroSection).limit(1);
        const [about] = await db.select().from(aboutSection).limit(1);
        const expertiseList = await db.select().from(expertise);

        return {
            hero: hero || null,
            about: about || null,
            expertise: expertiseList.map(e => ({
                ...e,
                content: JSON.parse(e.content) as string[]
            }))
        };
    } catch (error) {
        console.error("Failed to fetch homepage data:", error);
        return { error: "Failed to load homepage content." };
    }
};

// --- SETTERS / UPDATERS ---

export const updateHeroSection = async (data: any) => {
    const validation = HeroSectionSchema.safeParse(data);
    if (!validation.success) return { error: validation.error.flatten().fieldErrors };

    try {
        const db = await getDb();
        const existing = await db.select().from(heroSection).limit(1);

        if (existing.length > 0) {
            await db.update(heroSection)
                .set({ ...validation.data, updatedAt: new Date() })
                .where(eq(heroSection.id, existing[0].id));
        } else {
            await db.insert(heroSection).values(validation.data as any);
        }

        revalidatePath("/");
        return { success: "Hero section updated successfully!" };
    } catch (error) {
        return { error: "Failed to update hero section." };
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
        return { success: "Expertise deleted successfully!" };
    } catch (error) {
        return { error: "Failed to delete expertise." };
    }
};
