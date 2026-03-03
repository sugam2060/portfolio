import { z } from "zod";

export const BlogSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    readTime: z.string().min(1, "Read time is required"),
    type: z.string().min(1, "Blog type is required"),
    imageUrl: z.string().url("Valid image URL is required").optional().or(z.literal("")),
});

export type BlogInput = z.infer<typeof BlogSchema>;
