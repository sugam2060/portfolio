import { z } from "zod";

export const ProjectSchema = z.object({
    title: z.string().min(1, "Title is required"),
    overview: z.string().min(10, "Overview must be at least 10 characters"),
    techStack: z.array(z.string()).min(1, "At least one technology is required"),
    type: z.string().min(1, "Project type is required"),
    link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    features: z.array(z.object({
        title: z.string().min(1, "Feature title is required"),
        subject: z.string().min(1, "Feature description is required"),
    })).min(1, "At least one key feature is required"),
    images: z.array(z.string()).optional(), // URLs for existing or newly uploaded
});

export type ProjectInput = z.infer<typeof ProjectSchema>;

export const FeaturedProjectSchema = z.object({
    projectId: z.number(),
    displayOrder: z.number().default(0),
});

export type FeaturedProjectInput = z.infer<typeof FeaturedProjectSchema>;
