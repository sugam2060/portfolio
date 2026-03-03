import { z } from "zod";

export const HeroSectionSchema = z.object({
    heading: z.string().min(1, "Heading is required"),
    subHeading: z.string().min(1, "Sub-heading is required"),
    imgTextHeading: z.string().min(1, "Image text heading is required"),
    imgTextSubHeading: z.string().min(1, "Image text sub-heading is required"),
    imageUrl: z.string().optional(),
});

export const AboutSectionSchema = z.object({
    heading: z.string().min(1, "Heading is required"),
    subHeading: z.string().min(1, "Sub-heading is required"),
    focusOn: z.string().min(1, "Focus area is required"),
});

export const ExpertiseSchema = z.object({
    heading: z.string().min(1, "Heading is required"),
    content: z.array(z.string()).min(1, "At least one skill is required"),
});

export type HeroSectionInput = z.infer<typeof HeroSectionSchema>;
export type AboutSectionInput = z.infer<typeof AboutSectionSchema>;
export type ExpertiseInput = z.infer<typeof ExpertiseSchema>;
