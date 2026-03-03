"use server";

import { getDb } from "@/db";
import { blogs } from "@/db/schema";
import { BlogSchema } from "@/types/blogs";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// --- CACHE KEYS ---
const BLOGS_CACHE_KEY = "blogs_all";
const BLOG_DETAIL_CACHE_KEY = "blog_detail";

// --- FETCHING ---

export const getBlogs = async (page = 1, limit = 6, search = "") => {
    try {
        const { env } = await getCloudflareContext({ async: true }) as unknown as { env: CloudflareEnv };
        const kv = env.portfolio_kv;

        const offset = (page - 1) * limit;
        const cacheKey = `${BLOGS_CACHE_KEY}_p${page}_l${limit}_s${search.toLowerCase().replace(/\s+/g, '_')}`;

        // 1. Check KV cache
        const cached = await kv.get(cacheKey, "json");
        if (cached) return cached as { data: any[]; pagination: any }; // Refine typing if possible
        // Actually, let's keep it as any for now but without the lint error if possible
        // Or just define the type of response

        // 2. Fetch from DB
        const db = await getDb();

        let query = db.select().from(blogs);
        let countQuery = db.select({ count: sql<number>`count(*)` }).from(blogs);

        if (search) {
            const searchPattern = `%${search.toLowerCase()}%`;
            const filterClause = sql`lower(${blogs.title}) LIKE ${searchPattern} OR lower(${blogs.description}) LIKE ${searchPattern} OR lower(${blogs.type}) LIKE ${searchPattern}`;
            // @ts-expect-error - filters on drizzle query objects can be complex to type correctly here
            query = query.where(filterClause);
            // @ts-expect-error - same as above
            countQuery = countQuery.where(filterClause);
        }

        const [results, totalCount] = await Promise.all([
            query.orderBy(desc(blogs.createdAt)).limit(limit).offset(offset),
            countQuery
        ]);

        const totalItems = totalCount[0].count;
        const totalPages = Math.ceil(totalItems / limit);

        const response = {
            data: results,
            pagination: {
                total: totalItems,
                page,
                limit,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };

        // 3. Cache and return
        await kv.put(cacheKey, JSON.stringify(response), { expirationTtl: 3600 }); // Cache shorter for search results
        return response;
    } catch (error) {
        console.error("getBlogs error:", error);
        return { error: "Failed to fetch blogs", data: [], pagination: { total: 0, page, limit, totalPages: 0, hasNext: false, hasPrev: false } };
    }
};

export const getBlogById = async (id: number) => {
    try {
        const { env } = await getCloudflareContext({ async: true }) as unknown as { env: CloudflareEnv };
        const kv = env.portfolio_kv;
        const cacheKey = `${BLOG_DETAIL_CACHE_KEY}_${id}`;

        const cached = await kv.get(cacheKey, "json");
        if (cached) return cached as any;

        const db = await getDb();
        const [result] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);

        if (result) {
            await kv.put(cacheKey, JSON.stringify(result), { expirationTtl: 86400 });
        }
        return result;
    } catch (error) {
        console.error("getBlogById error:", error);
        return null;
    }
};

// --- MUTATIONS ---

export const createBlog = async (formData: FormData) => {
    try {
        const { env } = await getCloudflareContext({ async: true }) as unknown as { env: CloudflareEnv };
        const db = await getDb();
        const kv = env.portfolio_kv;
        const bucket = env["portfolio-r2"];

        const rawData = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            readTime: formData.get("readTime") as string,
            type: formData.get("type") as string,
            imageUrl: "", // Will be updated if file uploaded
        };

        const validation = BlogSchema.safeParse(rawData);
        if (!validation.success) {
            return { error: validation.error.flatten().fieldErrors };
        }

        let finalImageUrl = "";
        const file = formData.get("image") as File;

        if (file && file.size > 0) {
            const fileName = `blogs/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            await bucket.put(fileName, await file.arrayBuffer(), {
                httpMetadata: { contentType: file.type }
            });

            const baseUrl = env.R2_PUBLIC_URL || "";
            finalImageUrl = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/${fileName}`;
        }

        const [newBlog] = await db.insert(blogs).values({
            ...validation.data,
            imageUrl: finalImageUrl,
        }).returning();

        // Invalidate caches
        const blogKeys = await kv.list({ prefix: BLOGS_CACHE_KEY });
        await Promise.all(blogKeys.keys.map(key => kv.delete(key.name)));

        revalidatePath("/blogs");
        revalidatePath("/admin/blogs");

        return { success: "Blog published successfully!", id: newBlog.id };
    } catch (error) {
        console.error("createBlog error:", error);
        return { error: error instanceof Error ? error.message : "Failed to create blog." };
    }
};

export const updateBlog = async (id: number, formData: FormData) => {
    try {
        const { env } = await getCloudflareContext({ async: true }) as unknown as { env: CloudflareEnv };
        const db = await getDb();
        const kv = env.portfolio_kv;
        const bucket = env["portfolio-r2"];

        // 1. Get existing blog
        const [existing] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
        if (!existing) return { error: "Article not found." };

        const rawData = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            readTime: formData.get("readTime") as string,
            type: formData.get("type") as string,
            imageUrl: existing.imageUrl || "",
        };

        const validation = BlogSchema.safeParse(rawData);
        if (!validation.success) {
            return { error: validation.error.flatten().fieldErrors };
        }

        let finalImageUrl = existing.imageUrl;
        const file = formData.get("image") as File;

        // 2. Handle Image Update
        if (file && file.size > 0) {
            // Upload new
            const fileName = `blogs/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            await bucket.put(fileName, await file.arrayBuffer(), {
                httpMetadata: { contentType: file.type }
            });

            const baseUrl = env.R2_PUBLIC_URL || "";
            finalImageUrl = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/${fileName}`;

            // Delete old from R2
            if (existing.imageUrl) {
                try {
                    const url = new URL(existing.imageUrl);
                    const key = url.pathname.slice(1);
                    await bucket.delete(key);
                } catch (e) {
                    console.error("Old R2 image cleanup failed:", e);
                }
            }
        }

        // 3. Update DB
        await db.update(blogs).set({
            ...validation.data,
            imageUrl: finalImageUrl,
            updatedAt: new Date(),
        }).where(eq(blogs.id, id));

        // 4. Invalidate caches
        const blogKeys = await kv.list({ prefix: BLOGS_CACHE_KEY });
        const deletes = blogKeys.keys.map(key => kv.delete(key.name));
        deletes.push(kv.delete(`${BLOG_DETAIL_CACHE_KEY}_${id}`));
        await Promise.all(deletes);

        revalidatePath("/blogs");
        revalidatePath("/admin/blogs");

        return { success: "Article updated successfully!" };
    } catch (error) {
        console.error("updateBlog error:", error);
        return { error: error instanceof Error ? error.message : "Failed to update blog." };
    }
};

export const deleteBlog = async (id: number) => {
    try {
        const { env } = await getCloudflareContext({ async: true }) as unknown as { env: CloudflareEnv };
        const db = await getDb();
        const kv = env.portfolio_kv;
        const bucket = env["portfolio-r2"];

        const [blog] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
        if (!blog) return { error: "Blog not found" };

        // Cleanup R2
        if (blog.imageUrl) {
            try {
                const url = new URL(blog.imageUrl);
                const key = url.pathname.slice(1);
                await bucket.delete(key);
            } catch (e) {
                console.error("R2 cleanup failed:", e);
            }
        }

        await db.delete(blogs).where(eq(blogs.id, id));

        // Purge caches
        const blogKeys = await kv.list({ prefix: BLOGS_CACHE_KEY });
        const deletes = blogKeys.keys.map(key => kv.delete(key.name));
        deletes.push(kv.delete(`${BLOG_DETAIL_CACHE_KEY}_${id}`));
        await Promise.all(deletes);

        revalidatePath("/blogs");
        revalidatePath("/admin/blogs");

        return { success: "Blog deleted successfully." };
    } catch (error) {
        console.error("deleteBlog error:", error);
        return { error: "Failed to delete blog." };
    }
};
