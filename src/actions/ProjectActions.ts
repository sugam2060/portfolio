"use server";

import { getDb } from "@/db";
import { projects, projectGallery, featuredProjects, projectKeyFeatures } from "@/db/schema";
import { ProjectSchema } from "@/types/projects";
import { eq, desc, asc, sql, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// --- CACHE KEYS ---
const PROJECTS_CACHE_KEY = "projects_all";
const FEATURED_PROJECTS_CACHE_KEY = "projects_featured";

// --- FETCHING ---

export const getProjects = async (page = 1, limit = 6, type?: string) => {
    try {
        const { env } = getCloudflareContext() as unknown as { env: CloudflareEnv };
        const kv = env.portfolio_kv;
        const offset = (page - 1) * limit;
        const filterType = type && type !== "All" ? type : null;
        const cacheKey = `${PROJECTS_CACHE_KEY}_p${page}_l${limit}_t${filterType || "all"}`;

        // 1. Try KV Cache
        const cached = await kv.get(cacheKey);
        if (cached) return JSON.parse(cached);

        // 2. Fetch from DB
        const db = await getDb();

        const whereClause = filterType ? eq(projects.type, filterType) : undefined;

        // Parallel fetch for data and total count
        const [results, totalCount] = await Promise.all([
            db.query.projects.findMany({
                where: whereClause,
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
                .where(whereClause)
        ]);

        // Truncate overview if needed and add featured status
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

        // 3. Cache it (24 hours since we manually invalidate on mutations)
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

        const cached = await kv.get(FEATURED_PROJECTS_CACHE_KEY);
        if (cached) return JSON.parse(cached);

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

        // 5. Invalidate All Project Caches
        const projectKeys = await kv.list({ prefix: PROJECTS_CACHE_KEY });
        for (const key of projectKeys.keys) {
            await kv.delete(key.name);
        }

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

        // 1. Clean up R2 storage
        try {
            const prefix = `projects/${id}/`;
            const objects = await bucket.list({ prefix });
            for (const obj of objects.objects) {
                await bucket.delete(obj.key);
            }
        } catch (r2Error) {
            console.error("R2 cleanup error:", r2Error);
            // Continue with DB deletion even if R2 fails
        }

        // 2. Database Deletion (Cascades to gallery and features)
        await db.delete(projects).where(eq(projects.id, id));

        // 3. Clear All Project & Featured Caches
        const projectKeys = await kv.list({ prefix: PROJECTS_CACHE_KEY });
        for (const key of projectKeys.keys) {
            await kv.delete(key.name);
        }
        await kv.delete(FEATURED_PROJECTS_CACHE_KEY);

        revalidatePath("/projects");
        revalidatePath("/admin/projects");
        return { success: "Project archived and storage cleared." };
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

        // Clear All Project & Featured Caches
        const projectKeys = await kv.list({ prefix: PROJECTS_CACHE_KEY });
        for (const key of projectKeys.keys) {
            await kv.delete(key.name);
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
