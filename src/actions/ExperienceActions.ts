"use server";

import { getDb } from "@/db";
import { experiences, Experience } from "@/db/schema";
import { ExperienceInput } from "@/types/experience";
import { eq, asc, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const EXPERIENCE_CACHE_KEY = "experience_all";

export const getExperiences = async () => {
    try {
        const { env } = await getCloudflareContext({ async: true }) as unknown as { env: CloudflareEnv };
        const kv = env.portfolio_kv;

        // 1. Check KV cache
        const cached = await kv.get(EXPERIENCE_CACHE_KEY, "json");
        if (cached) return cached as Experience[];

        // 2. Fetch from DB
        const db = await getDb();
        const results = await db.select().from(experiences).orderBy(asc(experiences.order), desc(experiences.createdAt));

        // 3. Cache and return
        await kv.put(EXPERIENCE_CACHE_KEY, JSON.stringify(results), { expirationTtl: 86400 });
        return results;
    } catch (error) {
        console.error("getExperiences error:", error);
        return [];
    }
};

export const getExperienceById = async (id: number) => {
    try {
        const db = await getDb();
        const [result] = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
        return result;
    } catch (error) {
        console.error("getExperienceById error:", error);
        return null;
    }
};

export const createExperience = async (data: ExperienceInput) => {
    try {
        const { env } = await getCloudflareContext({ async: true }) as unknown as { env: CloudflareEnv };
        const kv = env.portfolio_kv;
        const db = await getDb();

        const newExp = await db.insert(experiences).values({
            companyName: data.companyName,
            role: data.role,
            duration: data.duration,
            location: data.location,
            description: JSON.stringify(data.description), // Array of points
            skills: JSON.stringify(data.skills), // Array of strings
            order: data.order || 0,
        }).returning();

        // Invalidate cache
        await kv.delete(EXPERIENCE_CACHE_KEY);
        revalidatePath("/experience");
        revalidatePath("/admin/experience");

        return { success: true, data: newExp[0] };
    } catch (error) {
        console.error("createExperience error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to create experience" };
    }
};

export const updateExperience = async (id: number, data: ExperienceInput) => {
    try {
        const { env } = await getCloudflareContext({ async: true }) as unknown as { env: CloudflareEnv };
        const kv = env.portfolio_kv;
        const db = await getDb();

        await db.update(experiences).set({
            companyName: data.companyName,
            role: data.role,
            duration: data.duration,
            location: data.location,
            description: JSON.stringify(data.description),
            skills: JSON.stringify(data.skills),
            order: data.order,
            updatedAt: new Date(),
        }).where(eq(experiences.id, id));

        // Invalidate cache
        await kv.delete(EXPERIENCE_CACHE_KEY);
        revalidatePath("/experience");
        revalidatePath("/admin/experience");

        return { success: true };
    } catch (error) {
        console.error("updateExperience error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to update experience" };
    }
};

export const deleteExperience = async (id: number) => {
    try {
        const { env } = await getCloudflareContext({ async: true }) as unknown as { env: CloudflareEnv };
        const kv = env.portfolio_kv;
        const db = await getDb();

        await db.delete(experiences).where(eq(experiences.id, id));

        // Invalidate cache
        await kv.delete(EXPERIENCE_CACHE_KEY);
        revalidatePath("/experience");
        revalidatePath("/admin/experience");

        return { success: true };
    } catch (error) {
        console.error("deleteExperience error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete experience" };
    }
};
