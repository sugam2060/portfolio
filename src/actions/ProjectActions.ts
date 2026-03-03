"use server";

import { getDb } from "@/db";
import { projects, projectGallery, featuredProjects } from "@/db/schema";
import { ProjectSchema } from "@/types/projects";
import { eq, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getCloudflareContext } from "@opennextjs/cloudflare";

// --- CACHE KEYS ---
const PROJECTS_CACHE_KEY = "projects_all";
const FEATURED_PROJECTS_CACHE_KEY = "projects_featured";

// --- FETCHING ---

export const getProjects = async () => {
    try {
        const { env } = getCloudflareContext() as unknown as { env: CloudflareEnv };
        const kv = env.portfolio_kv;

        // 1. Try KV Cache
        const cached = await kv.get(PROJECTS_CACHE_KEY);
        if (cached) {
            return JSON.parse(cached);
        }

        // 2. Fallback to DB
        const db = await getDb();
        const results = await db.query.projects.findMany({
            with: {
                gallery: true,
            },
            orderBy: [desc(projects.createdAt)],
        });

        // 3. Cache it
        await kv.put(PROJECTS_CACHE_KEY, JSON.stringify(results), {
            expirationTtl: 86400, // 24 hours
        });

        return results;
    } catch (error) {
        console.error("getProjects error:", error);
        return { error: "Failed to fetch projects" };
    }
};

export const getFeaturedProjects = async () => {
    try {
        const { env } = getCloudflareContext() as unknown as { env: CloudflareEnv };
        const kv = env.portfolio_kv;

        // 1. Try KV Cache
        const cached = await kv.get(FEATURED_PROJECTS_CACHE_KEY);
        if (cached) {
            return JSON.parse(cached);
        }

        // 2. Fallback to DB
        const db = await getDb();
        const results = await db.query.featuredProjects.findMany({
            with: {
                project: {
                    with: {
                        gallery: true,
                    },
                },
            },
            orderBy: [asc(featuredProjects.displayOrder)],
        });

        // 3. Cache it
        await kv.put(FEATURED_PROJECTS_CACHE_KEY, JSON.stringify(results), {
            expirationTtl: 86400, // 24 hours
        });

        return results;
    } catch (error) {
        console.error("getFeaturedProjects error:", error);
        return { error: "Failed to fetch featured projects" };
    }
};

// --- MUTATIONS ---

export const createProject = async (formData: FormData) => {
    try {
        const db = await getDb();
        const { env } = getCloudflareContext() as unknown as { env: CloudflareEnv };
        const kv = env.portfolio_kv;

        // Basic data extraction
        const rawData = {
            title: formData.get("title") as string,
            overview: formData.get("overview") as string,
            keyFeatureTitle: formData.get("keyFeatureTitle") as string,
            keyFeatureSubject: formData.get("keyFeatureSubject") as string,
            techStack: JSON.parse(formData.get("techStack") as string || "[]"),
            type: formData.get("type") as string,
        };

        const validation = ProjectSchema.safeParse(rawData);
        if (!validation.success) {
            return { error: validation.error.flatten().fieldErrors };
        }

        // 1. Insert Project
        const [newProject] = await db.insert(projects).values({
            ...validation.data,
            techStack: JSON.stringify(validation.data.techStack),
        }).returning();

        // 2. Clear KV Cache
        await kv.delete(PROJECTS_CACHE_KEY);

        revalidatePath("/projects");
        revalidatePath("/admin/projects");
        return { success: "Project created successfully", id: newProject.id };
    } catch (error: any) {
        console.error("createProject error:", error);
        return { error: error.message || "Failed to create project" };
    }
};

export const deleteProject = async (id: number) => {
    try {
        const db = await getDb();
        const { env } = getCloudflareContext() as unknown as { env: CloudflareEnv };
        const kv = env.portfolio_kv;

        await db.delete(projects).where(eq(projects.id, id));

        // Clear KV Cache
        await kv.delete(PROJECTS_CACHE_KEY);
        await kv.delete(FEATURED_PROJECTS_CACHE_KEY);

        revalidatePath("/projects");
        revalidatePath("/admin/projects");
        return { success: "Project deleted successfully" };
    } catch (error) {
        console.error("deleteProject error:", error);
        return { error: "Failed to delete project" };
    }
};

export const toggleFeaturedProject = async (projectId: number, isFeatured: boolean) => {
    try {
        const db = await getDb();
        const { env } = getCloudflareContext() as unknown as { env: CloudflareEnv };
        const kv = env.portfolio_kv;

        if (isFeatured) {
            await db.insert(featuredProjects).values({ projectId }).onConflictDoNothing();
        } else {
            await db.delete(featuredProjects).where(eq(featuredProjects.projectId, projectId));
        }

        // Clear Featured KV Cache
        await kv.delete(FEATURED_PROJECTS_CACHE_KEY);

        revalidatePath("/");
        revalidatePath("/admin/projects");
        return { success: "Featured status updated" };
    } catch (error) {
        console.error("toggleFeaturedProject error:", error);
        return { error: "Failed to update featured status" };
    }
};
