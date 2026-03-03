"use server";

import { getDb } from "@/db";
import { messages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const sendMessage = async (data: { name: string; email: string; subject: string; message: string }) => {
    try {
        const db = await getDb();
        await db.insert(messages).values(data);
        revalidatePath("/admin/messages");
        return { success: true };
    } catch (error) {
        console.error("sendMessage error:", error);
        return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" };
    }
};

export const getMessages = async () => {
    try {
        const db = await getDb();
        const results = await db.select().from(messages).orderBy(desc(messages.createdAt));
        return results;
    } catch (error) {
        console.error("getMessages error:", error);
        return [];
    }
};

export const getMessageById = async (id: number) => {
    try {
        const db = await getDb();
        const [result] = await db.select().from(messages).where(eq(messages.id, id)).limit(1);

        // Mark as read if it exists and is unread
        if (result && !result.isRead) {
            await db.update(messages).set({ isRead: true }).where(eq(messages.id, id));
            revalidatePath("/admin/messages");
        }

        return result;
    } catch (error) {
        console.error("getMessageById error:", error);
        return null;
    }
};

export const deleteMessage = async (id: number) => {
    try {
        const db = await getDb();
        await db.delete(messages).where(eq(messages.id, id));
        revalidatePath("/admin/messages");
        return { success: true };
    } catch (error) {
        console.error("deleteMessage error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete message" };
    }
};

export const toggleMessageReadStatus = async (id: number, isRead: boolean) => {
    try {
        const db = await getDb();
        await db.update(messages).set({ isRead }).where(eq(messages.id, id));
        revalidatePath("/admin/messages");
        return { success: true };
    } catch (error) {
        console.error("toggleMessageReadStatus error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to update status" };
    }
};
