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

export const getBlogs = async (page = 1, limit = 6) => {
    try {
        const { env } = await getCloudflareContext({ async: true }) as unknown as { env: CloudflareEnv };
        const kv = env.portfolio_kv;

        const offset = (page - 1) * limit;
        const cacheKey = `${BLOGS_CACHE_KEY}_p${page}_l${limit}`;

        // 1. Check KV cache
        const cached = await kv.get(cacheKey, "json");
        if (cached) return cached as any;

        // 2. Fetch from DB
        const db = await getDb();
        const [results, totalCount] = await Promise.all([
            db.select().from(blogs)
                .orderBy(desc(blogs.createdAt))
                .limit(limit)
                .offset(offset),
            db.select({ count: sql<number>`count(*)` }).from(blogs)
        ]);

        const response = {
            data: results,
            pagination: {
                total: totalCount[0].count,
                page,
                limit,
                totalPages: Math.ceil(totalCount[0].count / limit),
            }
        };

        // 3. Cache and return
        await kv.put(cacheKey, JSON.stringify(response), { expirationTtl: 86400 });
        return response;
    } catch (error) {
        console.error("getBlogs error:", error);
        return { error: "Failed to fetch blogs", data: [], pagination: { total: 0, page, limit, totalPages: 0 } };
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
    } catch (error: any) {
        console.error("createBlog error:", error);
        return { error: error.message || "Failed to create blog." };
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
