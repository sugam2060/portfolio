"use server";

import { getDb } from "@/db";
import { projects, projectGallery, featuredProjects, projectKeyFeatures } from "@/db/schema";
import { ProjectSchema } from "@/types/projects";
import { eq, desc, asc, sql, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// --- CACHE KEYS ---
const PROJECTS_CACHE_KEY = "projects_all";
const PROJECT_DETAIL_CACHE_KEY = "project_detail";
const FEATURED_PROJECTS_CACHE_KEY = "projects_featured";

// --- FETCHING ---

export const getProjectById = async (id: number) => {
    try {
        const { env } = getCloudflareContext() as unknown as { env: CloudflareEnv };
        const kv = env.portfolio_kv;
        const cacheKey = `${PROJECT_DETAIL_CACHE_KEY}_${id}`;

        // 1. First check the KV cache
        const cached = await kv.get(cacheKey, "json");
        if (cached) return cached as any;

        // 2. If not found, search against DB
        const db = await getDb();
        const result = await db.query.projects.findFirst({
            where: eq(projects.id, id),
            with: {
                gallery: true,
                keyFeatures: true,
            },
        });

        // 3. Store it in KV and return to client
        if (result) {
            await kv.put(cacheKey, JSON.stringify(result), { expirationTtl: 86400 });
        }

        return result;
    } catch (error) {
        console.error("getProjectById error:", error);
        return null;
    }
};

export const getProjects = async (page = 1, limit = 6) => {
    try {
        const { env } = getCloudflareContext() as unknown as { env: CloudflareEnv };
        const kv = env.portfolio_kv;

        // Properly paginated calculations
        const offset = (page - 1) * limit;
        const cacheKey = `${PROJECTS_CACHE_KEY}_p${page}_l${limit}`;

        // 1. First check the KV cache
        const cached = await kv.get(cacheKey, "json");
        if (cached) return cached as any;

        // 2. If not found, search against DB
        const db = await getDb();

        const [results, totalCount] = await Promise.all([
            db.query.projects.findMany({
                columns: {
                    id: true,
                    title: true,
                    overview: true,
                    techStack: true,
                    type: true,
                    link: true,
                    github: true,
                },
                with: {
                    gallery: {
                        columns: {
                            photoUrl: true,
                        },
                        limit: 1,
                    },
                    featuredProject: true,
                },
                orderBy: [desc(projects.createdAt)],
                limit: limit,
                offset: offset,
            }),
            db.select({ count: sql<number>`count(*)` })
                .from(projects)
        ]);

        const truncatedResults = results.map(p => ({
            ...p,
            isFeatured: !!p.featuredProject,
            overview: p.overview.length > 150 ? p.overview.substring(0, 150) + "..." : p.overview
        }));

        const response = {
            data: truncatedResults,
            pagination: {
                total: totalCount[0].count,
                page,
                limit,
                totalPages: Math.ceil(totalCount[0].count / limit),
            }
        };

        // 3. Store it in KV and return to client
        await kv.put(cacheKey, JSON.stringify(response), { expirationTtl: 86400 });

        return response;
    } catch (error) {
        console.error("getProjects error:", error);
        return { error: "Failed to fetch projects", data: [], pagination: { total: 0, page, limit: 6, totalPages: 0 } };
    }
};

export const getFeaturedProjects = async () => {
    try {
        const { env } = getCloudflareContext() as unknown as { env: CloudflareEnv };
        const kv = env.portfolio_kv;

        const cached = await kv.get(FEATURED_PROJECTS_CACHE_KEY, "json");
        if (cached) return cached as any;

        const db = await getDb();
        const results = await db.query.featuredProjects.findMany({
            with: {
                project: {
                    columns: {
                        id: true,
                        title: true,
                        overview: true,
                        techStack: true,
                        type: true,
                        link: true,
                        github: true,
                    },
                    with: {
                        gallery: { columns: { photoUrl: true }, limit: 1 },
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
        return [];
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

            // Use env.R2_PUBLIC_URL for consistency
            const baseUrl = env.R2_PUBLIC_URL || "";
            const publicUrl = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/${fileName}`;

            await db.insert(projectGallery).values({
                projectId: newProject.id,
                photoUrl: publicUrl,
            });
        }

        // 5. Invalidate All Project Caches (Parallelize for Performance)
        const projectKeys = await kv.list({ prefix: PROJECTS_CACHE_KEY });
        const deletes = projectKeys.keys.map(key => kv.delete(key.name));
        deletes.push(kv.delete(FEATURED_PROJECTS_CACHE_KEY));
        await Promise.all(deletes);

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

        // 1. Delete complete respected images structure in R2
        try {
            const prefix = `projects/${id}/`;
            const objects = await bucket.list({ prefix });
            if (objects && objects.objects.length > 0) {
                for (const obj of objects.objects) {
                    await bucket.delete(obj.key);
                }
            }
        } catch (r2Error) {
            console.error("R2 cleanup error, proceeding with cache/DB clear anyway:", r2Error);
        }

        // 2. Database Deletion (Cascades to gallery and features)
        await db.delete(projects).where(eq(projects.id, id));

        // 3. Update the cache also
        const projectKeys = await kv.list({ prefix: PROJECTS_CACHE_KEY });
        const deletePromises = projectKeys.keys.map(key => kv.delete(key.name));
        deletePromises.push(kv.delete(FEATURED_PROJECTS_CACHE_KEY));
        deletePromises.push(kv.delete(`${PROJECT_DETAIL_CACHE_KEY}_${id}`));

        // Batch execute all purges
        await Promise.all(deletePromises);

        // Ask Next.js router cache to refetch for freshness on UI
        revalidatePath("/projects");
        revalidatePath("/admin/projects");

        return { success: "Project and associated media correctly purged." };
    } catch (error) {
        console.error("deleteProject error:", error);
        return { error: "Failed to purge project." };
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

        // Clear All Project & Featured Caches (Update the cache also per user instruction)
        const projectKeys = await kv.list({ prefix: PROJECTS_CACHE_KEY });
        const deletePromises = projectKeys.keys.map(key => kv.delete(key.name));
        deletePromises.push(kv.delete(FEATURED_PROJECTS_CACHE_KEY));
        deletePromises.push(kv.delete(`${PROJECT_DETAIL_CACHE_KEY}_${projectId}`));

        await Promise.all(deletePromises);

        revalidatePath("/");
        revalidatePath("/admin/projects");
        return { success: "Featured cache and status updated." };
    } catch (error) {
        console.error("toggleFeaturedProject error:", error);
        return { error: "Failed to update featured." };
    }
};
