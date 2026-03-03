import { z } from "zod";

export const ProjectSchema = z.object({
    title: z.string().min(1, "Title is required"),
    overview: z.string().min(10, "Overview must be at least 10 characters"),
    keyFeatureTitle: z.string().min(1, "Key feature title is required"),
    keyFeatureSubject: z.string().min(1, "Key feature description is required"),
    techStack: z.array(z.string()).min(1, "At least one technology is required"),
    type: z.string().min(1, "Project type is required"),
    images: z.array(z.string()).optional(), // URLs for the gallery
});

export type ProjectInput = z.infer<typeof ProjectSchema>;

export const FeaturedProjectSchema = z.object({
    projectId: z.number(),
    displayOrder: z.number().default(0),
});

export type FeaturedProjectInput = z.infer<typeof FeaturedProjectSchema>;
