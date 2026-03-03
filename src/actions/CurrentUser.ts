"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getCurrentUserAction = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        if (!token) {
            return {
                status: false,
                message: "No access token found"
            };
        }

        const { env } = await getCloudflareContext({ async: true }) as unknown as { env: CloudflareEnv };
        const secret = new TextEncoder().encode(
            env.JWT_SECRET || "fallback_secret_change_me"
        );

        let payload: any;
        try {
            const { payload: decoded } = await jwtVerify(token, secret);
            payload = decoded;
        } catch {
            return {
                status: false,
                message: "Session expired or invalid token"
            };
        }

        if (!payload || !payload.id) {
            return {
                status: false,
                message: "Invalid token payload"
            };
        }

        // 1. Search in Cloudflare KV
        const kv = env.portfolio_kv;
        const cachedUser = await kv.get(`user_${payload.id}`);

        if (cachedUser) {
            return {
                status: true,
                message: "User session found in cache",
                user: JSON.parse(cachedUser)
            };
        }

        // 2. Search in Database
        const db = await getDb();
        const [user] = await db.select().from(users).where(eq(users.id, payload.id)).limit(1);

        if (user) {
            const userData = {
                id: user.id,
                fullname: user.fullname,
                email: user.email
            };

            // Cache in KV for next time
            await kv.put(`user_${payload.id}`, JSON.stringify(userData), {
                expirationTtl: 86400
            });

            return {
                status: true,
                message: "User found in database and cached",
                user: userData
            };
        }

        // 3. Not found anywhere
        return {
            status: false,
            message: "User account not found"
        };

    } catch (error) {
        console.error("GetCurrentUser Action Error:", error);
        return {
            status: false,
            message: "An error occurred during authentication"
        };
    }
};
