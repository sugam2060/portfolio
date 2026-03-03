"use server";

import { getDb } from "@/db";
import { users } from "@/db/schema";
import { LoginSchema, LoginInput } from "@/types/auth";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const loginUser = async (data: LoginInput) => {
    // Validate with Zod
    const validationResult = LoginSchema.safeParse(data);
    if (!validationResult.success) {
        return {
            error: validationResult.error.flatten().fieldErrors,
        };
    }

    const { email, password } = validationResult.data;

    try {
        const db = await getDb();
        const { env } = getCloudflareContext() as unknown as { env: CloudflareEnv };

        // Find user
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (!user) {
            return {
                error: "Invalid email or password.",
            };
        }

        // Compare password
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return {
                error: "Invalid email or password.",
            };
        }

        // Generate JWT Token using jose
        const secret = new TextEncoder().encode(
            env.JWT_SECRET || "fallback_secret_change_me"
        );

        const token = await new SignJWT({
            id: user.id,
            email: user.email
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(secret);

        // Set Cookie
        const cookieStore = await cookies();
        cookieStore.set("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        // Return success
        return {
            success: "Logged in successfully!",
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
            },
        };
    } catch (error: any) {
        console.error("Login failed:", error);
        return {
            error: "An unexpected error occurred during login.",
        };
    }
};
