import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

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

export const projects = sqliteTable("projects", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    overview: text("overview").notNull(),
    techStack: text("tech_stack").notNull(), // JSON list of strings
    type: text("type").notNull(),
    link: text("link"),
    github: text("github"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const projectKeyFeatures = sqliteTable("project_key_features", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
    title: text("title").notNull(),
    subject: text("subject").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const projectGallery = sqliteTable("project_gallery", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
    photoUrl: text("photo_url").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const featuredProjects = sqliteTable("featured_projects", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id").notNull().unique().references(() => projects.id, { onDelete: 'cascade' }),
    displayOrder: integer("display_order").default(0),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const blogs = sqliteTable("blogs", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
    title: text("title").notNull(),
    description: text("description").notNull(),
    readTime: text("read_time").notNull(),
    type: text("type").notNull(),
    imageUrl: text("image_url").notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// Relations
export const projectsRelations = relations(projects, ({ many, one }) => ({
    keyFeatures: many(projectKeyFeatures),
    gallery: many(projectGallery),
    featuredProject: one(featuredProjects, {
        fields: [projects.id],
        references: [featuredProjects.projectId],
    }),
}));

export const projectKeyFeaturesRelations = relations(projectKeyFeatures, ({ one }) => ({
    project: one(projects, {
        fields: [projectKeyFeatures.projectId],
        references: [projects.id],
    }),
}));

export const projectGalleryRelations = relations(projectGallery, ({ one }) => ({
    project: one(projects, {
        fields: [projectGallery.projectId],
        references: [projects.id],
    }),
}));

export const featuredProjectsRelations = relations(featuredProjects, ({ one }) => ({
    project: one(projects, {
        fields: [featuredProjects.projectId],
        references: [projects.id],
    }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type HeroSection = typeof heroSection.$inferSelect;
export type NewHeroSection = typeof heroSection.$inferInsert;

export type AboutSection = typeof aboutSection.$inferSelect;
export type NewAboutSection = typeof aboutSection.$inferInsert;

export type Expertise = typeof expertise.$inferSelect;
export type NewExpertise = typeof expertise.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type ProjectKeyFeature = typeof projectKeyFeatures.$inferSelect;
export type NewProjectKeyFeature = typeof projectKeyFeatures.$inferInsert;

export type ProjectGallery = typeof projectGallery.$inferSelect;
export type NewProjectGallery = typeof projectGallery.$inferInsert;

export type FeaturedProject = typeof featuredProjects.$inferSelect;
export type NewFeaturedProject = typeof featuredProjects.$inferInsert;

export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;

