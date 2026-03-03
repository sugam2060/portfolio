import { z } from "zod";

export const ExperienceSchema = z.object({
    companyName: z.string().min(2, "Company name is required"),
    role: z.string().min(2, "Role is required"),
    duration: z.string().min(2, "Duration is required (e.g. Jan 2020 - Present)"),
    location: z.string().min(2, "Location is required"),
    description: z.array(z.string()).min(1, "At least one point is required"),
    skills: z.array(z.string()).min(1, "At least one skill is required"),
    order: z.number(),
});

export type ExperienceInput = z.infer<typeof ExperienceSchema>;
