"use server";

import { getDb } from "@/db";
import { projects, projectGallery, featuredProjects, projectKeyFeatures } from "@/db/schema";
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

        const cached = await kv.get(PROJECTS_CACHE_KEY);
        if (cached) return JSON.parse(cached);

        const db = await getDb();
        const results = await db.query.projects.findMany({
            with: {
                gallery: true,
                keyFeatures: true,
            },
            orderBy: [desc(projects.createdAt)],
        });

        await kv.put(PROJECTS_CACHE_KEY, JSON.stringify(results), { expirationTtl: 86400 });
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

        const cached = await kv.get(FEATURED_PROJECTS_CACHE_KEY);
        if (cached) return JSON.parse(cached);

        const db = await getDb();
        const results = await db.query.featuredProjects.findMany({
            with: {
                project: {
                    with: {
                        gallery: true,
                        keyFeatures: true,
                    },
                },
            },
            orderBy: [asc(featuredProjects.displayOrder)],
        });

        await kv.put(FEATURED_PROJECTS_CACHE_KEY, JSON.stringify(results), { expirationTtl: 86400 });
        return results;
    } catch (error) {
        console.error("getFeaturedProjects error:", error);
        return { error: "Failed to fetch featured projects" };
    }
};

// --- MUTATIONS ---

export const createProject = async (formData: FormData) => {
    try {
        const { env } = getCloudflareContext() as unknown as { env: CloudflareEnv };
        const db = await getDb();
        const kv = env.portfolio_kv;
        const bucket = env["portfolio-r2"];

        // 1. Parse Data
        const rawData = {
            title: formData.get("title") as string,
            overview: formData.get("overview") as string,
            techStack: JSON.parse(formData.get("techStack") as string || "[]"),
            type: formData.get("type") as string,
            link: formData.get("link") as string,
            github: formData.get("github") as string,
            features: JSON.parse(formData.get("features") as string || "[]"),
        };

        const validation = ProjectSchema.safeParse(rawData);
        if (!validation.success) {
            return { error: validation.error.flatten().fieldErrors };
        }

        // 2. Insert Project Base
        const [newProject] = await db.insert(projects).values({
            title: validation.data.title,
            overview: validation.data.overview,
            techStack: JSON.stringify(validation.data.techStack),
            type: validation.data.type,
            link: validation.data.link,
            github: validation.data.github,
        }).returning();

        // 3. Insert Key Features
        if (validation.data.features.length > 0) {
            await db.insert(projectKeyFeatures).values(
                validation.data.features.map(f => ({
                    projectId: newProject.id,
                    title: f.title,
                    subject: f.subject,
                }))
            );
        }

        // 4. Handle Images (R2)
        const imageFiles = formData.getAll("images") as File[];
        for (const file of imageFiles) {
            if (file.size === 0) continue;

            const fileName = `projects/${newProject.id}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            await bucket.put(fileName, await file.arrayBuffer(), {
                httpMetadata: { contentType: file.type }
            });

            const publicUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
            await db.insert(projectGallery).values({
                projectId: newProject.id,
                photoUrl: publicUrl,
            });
        }

        // 5. Invalidate Cache
        await kv.delete(PROJECTS_CACHE_KEY);

        revalidatePath("/projects");
        revalidatePath("/admin/projects");
        return { success: "Project engineered successfully!", id: newProject.id };
    } catch (error: any) {
        console.error("createProject error:", error);
        return { error: error.message || "Construction failure." };
    }
};

export const deleteProject = async (id: number) => {
    try {
        const { env } = getCloudflareContext() as unknown as { env: CloudflareEnv };
        const db = await getDb();
        const kv = env.portfolio_kv;
        const bucket = env["portfolio-r2"];

        // Optional: Clean up R2 (list and delete)
        // For brevity skipping detailed R2 cleanup, but usually good practice.

        await db.delete(projects).where(eq(projects.id, id));

        await kv.delete(PROJECTS_CACHE_KEY);
        await kv.delete(FEATURED_PROJECTS_CACHE_KEY);

        revalidatePath("/projects");
        revalidatePath("/admin/projects");
        return { success: "Project archived." };
    } catch (error) {
        console.error("deleteProject error:", error);
        return { error: "Deconstruction failed." };
    }
};

export const toggleFeaturedProject = async (projectId: number, isFeatured: boolean) => {
    try {
        const { env } = getCloudflareContext() as unknown as { env: CloudflareEnv };
        const db = await getDb();
        const kv = env.portfolio_kv;

        if (isFeatured) {
            await db.insert(featuredProjects).values({ projectId }).onConflictDoNothing();
        } else {
            await db.delete(featuredProjects).where(eq(featuredProjects.projectId, projectId));
        }

        await kv.delete(FEATURED_PROJECTS_CACHE_KEY);

        revalidatePath("/");
        revalidatePath("/admin/projects");
        return { success: "Showcase priority updated." };
    } catch (error) {
        console.error("toggleFeaturedProject error:", error);
        return { error: "Featured update failed." };
    }
};
