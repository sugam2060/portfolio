"use server";

import { getDb } from "@/db";
import { users } from "@/db/schema";
import { LoginSchema, LoginInput } from "@/types/auth";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";

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

        // Here you would typically set a session cookie or JWT
        // For now, just return success
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
