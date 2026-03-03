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

    const onSubmit = (data: ExpertiseInput) => {
        handleUpdate({ ...data, id: editingId || undefined } as any);
    };

    const startEditing = (item: any) => {
        setEditingId(item.id);
        form.reset({
            heading: item.heading,
            content: item.content,
        });
    };

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <LuTerminal className="text-primary" />
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
                        <div key={item.id} className="p-4 rounded-xl border border-border/50 bg-background/50 group relative">
                            <h4 className="font-bold text-foreground mb-2">{item.heading}</h4>
                            <div className="flex flex-wrap gap-1">
                                {item.content.map((skill: string, i: number) => (
                                    <span key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded uppercase font-bold tracking-tighter opacity-70">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEditing(item)}>
                                    <LuPlus className="h-3 w-3 rotate-45" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleDelete(item.id)}>
                                    <LuTrash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {initialData.length === 0 && (
                        <div className="col-span-full py-8 text-center border-2 border-dashed border-border/50 rounded-xl text-muted-foreground text-sm italic">
                            No expertise blocks added yet.
                        </div>
                    )}
                </div>

                {/* Add/Edit Form */}
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">
                            {editingId ? "Edit Expertise Block" : "Add New Expertise Block"}
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
                                                <Input placeholder="Core Engineering" {...field} />
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
                                                    value={field.value.join(", ")}
                                                    onChange={(e) => field.onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                                                />
                                            </FormControl>
                                            <FormDescription>Enter skills separated by commas.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-2">
                                    <Button type="submit" disabled={isUpdating} variant="default" className="flex-1">
                                        {isUpdating ? <Spinner className="h-4 w-4 mr-2" /> : <LuSave className="h-4 w-4 mr-2" />}
                                        {editingId ? "Save Changes" : "Add Expertise"}
                                    </Button>
                                    {editingId && (
                                        <Button type="button" variant="outline" onClick={() => { setEditingId(null); form.reset(); }}>
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
