"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpertiseSchema, ExpertiseInput } from "@/types/homepage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateExpertise, deleteExpertise } from "@/actions/HomepageActions";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LuTerminal, LuPlus, LuTrash2, LuSave } from "react-icons/lu";
import { useState } from "react";

export default function EditExpertise({ initialData = [] }: { initialData?: any[] }) {
    const queryClient = useQueryClient();
    const [editingId, setEditingId] = useState<number | null>(null);

    const form = useForm<ExpertiseInput>({
        resolver: zodResolver(ExpertiseSchema),
        defaultValues: {
            heading: "",
            content: [],
        },
    });

    const { mutate: handleUpdate, isPending: isUpdating } = useMutation({
        mutationFn: updateExpertise,
        onSuccess: (data: any) => {
            if (data.error) {
                toast.error("Failed to save expertise");
            } else {
                toast.success("Expertise saved!");
                form.reset({ heading: "", content: [] });
                setEditingId(null);
                queryClient.invalidateQueries({ queryKey: ["homepage-data"] });
            }
        },
    });

    const { mutate: handleDelete, isPending: isDeleting } = useMutation({
        mutationFn: deleteExpertise,
        onSuccess: () => {
            toast.success("Expertise deleted!");
            queryClient.invalidateQueries({ queryKey: ["homepage-data"] });
        },
    });

    const [skillsText, setSkillsText] = useState("");

    const onSubmit = (data: ExpertiseInput) => {
        handleUpdate({ ...data, id: editingId || undefined } as any);
        setSkillsText("");
    };

    const startEditing = (item: any) => {
        setEditingId(item.id);
        const joined = item.content.join(", ");
        setSkillsText(joined);
        form.reset({
            heading: item.heading,
            content: item.content,
        });
    };

    const handleSkillsChange = (val: string, onChange: (val: string[]) => void) => {
        setSkillsText(val);
        const skillsArray = val.split(",").map(s => s.trim()).filter(Boolean);
        onChange(skillsArray);
    };

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <LuTerminal className="text-primary animate-pulse" />
                    Technical Expertise
                </CardTitle>
                <CardDescription>
                    Add or remove your core engineering and AI skill sets.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Expertise List */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {initialData.map((item) => (
                        <div key={item.id} className="p-5 rounded-xl border border-border/50 bg-background/50 group relative hover:border-primary/30 transition-all duration-300 shadow-md hover:shadow-lg">
                            <h4 className="font-bold text-foreground mb-3">{item.heading}</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {item.content.map((skill: string, i: number) => (
                                    <span key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded-md uppercase font-bold tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" onClick={() => startEditing(item)}>
                                    <LuPlus className="h-4 w-4 rotate-45" />
                                </Button>
                                <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full" onClick={() => handleDelete(item.id)}>
                                    <LuTrash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {initialData.length === 0 && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-border/50 rounded-2xl text-muted-foreground text-sm italic bg-muted/20">
                            No expertise blocks added yet. Click below to start building your stack.
                        </div>
                    )}
                </div>

                {/* Add/Edit Form */}
                <Card className="border-primary/20 bg-primary/5 shadow-inner">
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                            {editingId ? "Edit Block" : "Add New Block"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="heading"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Core Engineering" {...field} className="bg-background/50 border-primary/10 transition-colors focus:border-primary" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Skills (Comma separated)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Python, TypeScript, Docker..."
                                                    value={skillsText}
                                                    onChange={(e) => handleSkillsChange(e.target.value, field.onChange)}
                                                    className="bg-background/50 border-primary/10 transition-colors focus:border-primary"
                                                />
                                            </FormControl>
                                            <FormDescription>Enter skills separated by commas.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-2">
                                    <Button type="submit" disabled={isUpdating} variant="default" className="flex-1 shadow-md hover:shadow-lg transition-all rounded-lg">
                                        {isUpdating ? <Spinner className="h-4 w-4 mr-2" /> : <LuSave className="h-4 w-4 mr-2" />}
                                        {editingId ? "Save Changes" : "Add Expertise"}
                                    </Button>
                                    {editingId && (
                                        <Button type="button" variant="outline" className="rounded-lg" onClick={() => { setEditingId(null); setSkillsText(""); form.reset(); }}>
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}
