"use client";

import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createExperience, updateExperience } from "@/actions/ExperienceActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LuSave, LuX, LuPlus, LuTrash2 } from "react-icons/lu";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Internal schema for the form using objects for array fields
const ExperienceFormSchema = z.object({
    companyName: z.string().min(2, "Company name is required"),
    role: z.string().min(2, "Role is required"),
    duration: z.string().min(2, "Duration is required"),
    location: z.string().min(2, "Location is required"),
    description: z.array(z.object({ value: z.string().min(1, "Cannot be empty") })).min(1, "At least one point is required"),
    skills: z.array(z.object({ value: z.string().min(1, "Cannot be empty") })).min(1, "At least one skill is required"),
    order: z.number(),
});

type FormInput = z.infer<typeof ExperienceFormSchema>;

interface ExperienceFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function ExperienceForm({ initialData, isEdit }: ExperienceFormProps) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const form = useForm<FormInput>({
        resolver: zodResolver(ExperienceFormSchema),
        defaultValues: initialData ? {
            companyName: initialData.companyName || "",
            role: initialData.role || "",
            duration: initialData.duration || "",
            location: initialData.location || "",
            description: JSON.parse(initialData.description || "[]").map((v: string) => ({ value: v })),
            skills: JSON.parse(initialData.skills || "[]").map((v: string) => ({ value: v })),
            order: typeof initialData.order === "number" ? initialData.order : 0,
        } : {
            companyName: "",
            role: "",
            duration: "",
            location: "",
            description: [{ value: "" }, { value: "" }, { value: "" }],
            skills: [{ value: "" }],
            order: 0,
        },
    });

    const { fields: descFields, append: appendDesc, remove: removeDesc } = useFieldArray({
        control: form.control,
        name: "description",
    });

    const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
        control: form.control,
        name: "skills",
    });

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        setIsPending(true);
        try {
            // Map back to primitive arrays for the server action
            const submitData = {
                ...data,
                description: data.description.map(d => d.value),
                skills: data.skills.map(s => s.value),
            };

            const res = isEdit
                ? await updateExperience(initialData.id, submitData)
                : await createExperience(submitData);

            if (res.success) {
                toast.success(isEdit ? "Experience updated" : "Experience added");
                router.push("/admin/experience");
                router.refresh();
            } else {
                toast.error(res.error || "Something went wrong");
            }
        } catch (err) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-surface-dark dark:bg-[#11141a] p-8 rounded-2xl border border-border/50 dark:border-[#282e39]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-[10px] font-black tracking-widest text-primary">Company Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Google" {...field} className="bg-muted/50 border-border/50 font-bold text-xs" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-[10px] font-black tracking-widest text-primary">Job Role / Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Senior SWE" {...field} className="bg-muted/50 border-border/50 font-bold text-xs" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-[10px] font-black tracking-widest text-primary">Duration</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Jan 2022 - Present" {...field} className="bg-muted/50 border-border/50 font-bold text-xs" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-[10px] font-black tracking-widest text-primary">Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Remote / Mountain View, CA" {...field} className="bg-muted/50 border-border/50 font-bold text-xs" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="flex justify-between items-center">
                            <FormLabel className="uppercase text-[10px] font-black tracking-widest text-primary">Responsibilities / Points</FormLabel>
                            <Button type="button" variant="outline" size="sm" onClick={() => appendDesc({ value: "" })} className="h-7 text-[8px] font-black uppercase tracking-widest px-2">
                                <LuPlus className="mr-1 size-3" /> Add Point
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {descFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <FormField
                                        control={form.control}
                                        name={`description.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input {...field} className="bg-muted/50 border-border/50 text-xs" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeDesc(index)} className="size-9 text-destructive shrink-0">
                                        <LuTrash2 className="size-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="flex justify-between items-center">
                            <FormLabel className="uppercase text-[10px] font-black tracking-widest text-primary">Skills / Tech Used</FormLabel>
                            <Button type="button" variant="outline" size="sm" onClick={() => appendSkill({ value: "" })} className="h-7 text-[8px] font-black uppercase tracking-widest px-2">
                                <LuPlus className="mr-1 size-3" /> Add Skill
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-3 p-4 bg-muted/20 border border-border/50 rounded-xl">
                            {skillFields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-1 bg-surface border border-border/50 rounded-lg pr-1">
                                    <FormField
                                        control={form.control}
                                        name={`skills.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} className="h-8 border-none bg-transparent text-[10px] font-bold w-24 focus-visible:ring-0" placeholder="Skill" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSkill(index)} className="size-6 text-muted-foreground hover:text-destructive">
                                        <LuX className="size-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-[10px] font-black tracking-widest text-primary">Display Order</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={e => {
                                            const val = parseInt(e.target.value);
                                            field.onChange(isNaN(val) ? 0 : val);
                                        }}
                                        className="bg-muted/50 border-border/50 font-bold text-xs"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-border/10">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        className="font-black uppercase tracking-widest text-[10px]"
                    >
                        <LuX className="mr-2 size-3" />
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="font-black uppercase tracking-widest text-[10px] px-8"
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 size-3 animate-spin" />
                        ) : (
                            <LuSave className="mr-2 size-3" />
                        )}
                        {isEdit ? "Update Entry" : "Save Experience"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
