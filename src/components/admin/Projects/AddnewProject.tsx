"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "@/actions/ProjectActions";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectSchema, ProjectInput } from "@/types/projects";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LuPlus, LuSave, LuCode, LuLayers, LuInfo } from "react-icons/lu";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function AddNewProject() {
    const queryClient = useQueryClient();
    const [techInput, setTechInput] = useState("");

    const form = useForm<ProjectInput>({
        resolver: zodResolver(ProjectSchema),
        defaultValues: {
            title: "",
            overview: "",
            keyFeatureTitle: "",
            keyFeatureSubject: "",
            techStack: [],
            type: "Web Application",
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: createProject,
        onSuccess: (data: any) => {
            if (data.error) {
                toast.error("Failed to add project");
            } else {
                toast.success("Project added successfully!");
                form.reset();
                setTechInput("");
                queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
            }
        },
    });

    const handleAddTech = () => {
        if (!techInput.trim()) return;
        const currentTechs = form.getValues("techStack");
        if (!currentTechs.includes(techInput.trim())) {
            form.setValue("techStack", [...currentTechs, techInput.trim()]);
        }
        setTechInput("");
    };

    const removeTech = (tech: string) => {
        const currentTechs = form.getValues("techStack");
        form.setValue("techStack", currentTechs.filter(t => t !== tech));
    };

    const onSubmit = (data: ProjectInput) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === "techStack") {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value as string);
            }
        });
        mutate(formData);
    };

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <LuPlus className="text-primary" />
                    New Project Blueprint
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="E-commerce Portal" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <FormControl>
                                            <Input placeholder="AI Agent / Web App" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="overview"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Overview</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="A summary of what the project does..."
                                            className="min-h-[100px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="keyFeatureTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Key Feature Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Universal Translation" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="keyFeatureSubject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Feature Impact</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Real-time multi-language support" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-3">
                            <FormLabel>Tech Stack</FormLabel>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add tech (e.g. Next.js)"
                                    value={techInput}
                                    onChange={(e) => setTechInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                                />
                                <Button type="button" variant="outline" onClick={handleAddTech}>
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {form.watch("techStack").map(tech => (
                                    <span key={tech} className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-2 border border-primary/20">
                                        {tech}
                                        <button type="button" onClick={() => removeTech(tech)} className="hover:text-red-500">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <Button type="submit" disabled={isPending} className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20">
                            {isPending ? <Spinner className="mr-2" /> : <LuSave className="mr-2" />}
                            Publish Project
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
