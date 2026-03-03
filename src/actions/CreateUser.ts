"use server";

import { getDb } from "@/db";
import { users } from "@/db/schema";
import { SignupSchema, SignupInput } from "@/types/auth";
import { hash } from "bcryptjs";
import { count } from "drizzle-orm";

export const createUser = async (data: SignupInput) => {
    // Validate with Zod
    const validationResult = SignupSchema.safeParse(data);
    if (!validationResult.success) {
        return {
            error: validationResult.error.flatten().fieldErrors,
        };
    }

    const { fullname, email, password } = validationResult.data;

    try {
        const db = await getDb();

        // Enforce "only one user" rule
        const [userCount] = await db.select({ value: count() }).from(users);
        if (userCount.value > 0) {
            return {
                error: "Registration is limited to one user only.",
            };
        }

        // Hash password
        const hashedPassword = await hash(password, 10);

        // Create user
        await db.insert(users).values({
            fullname,
            email,
            password: hashedPassword,
            verificationUuid: crypto.randomUUID(),
        });

        return {
            success: "User created successfully!",
        };
    } catch (error: any) {
        console.error("Failed to create user:", error);
        return {
            error: "An unexpected error occurred during user creation.",
        };
    }
};
