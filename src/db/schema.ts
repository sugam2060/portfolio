import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    fullname: text("fullname").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    verificationUuid: text("verification_uuid"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
