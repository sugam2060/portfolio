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

export const heroSection = sqliteTable("hero_section", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    heading: text("heading").notNull(),
    subHeading: text("sub_heading").notNull(),
    imgTextHeading: text("img_text_heading").notNull(),
    imgTextSubHeading: text("img_text_sub_heading").notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const aboutSection = sqliteTable("about_section", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    heading: text("heading").notNull(),
    subHeading: text("sub_heading").notNull(),
    focusOn: text("focus_on").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const expertise = sqliteTable("expertise", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    heading: text("heading").notNull(),
    content: text("content").notNull(), // Stores array of string as JSON string
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type HeroSection = typeof heroSection.$inferSelect;
export type NewHeroSection = typeof heroSection.$inferInsert;

export type AboutSection = typeof aboutSection.$inferSelect;
export type NewAboutSection = typeof aboutSection.$inferInsert;

export type Expertise = typeof expertise.$inferSelect;
export type NewExpertise = typeof expertise.$inferInsert;

