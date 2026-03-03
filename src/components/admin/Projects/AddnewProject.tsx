"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "@/actions/ProjectActions";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
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
import { LuPlus, LuSave, LuCode, LuLayers, LuInfo, LuTrash2, LuImage, LuLink, LuGithub } from "react-icons/lu";
import { useState, useRef } from "react";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

export default function AddNewProject() {
    const queryClient = useQueryClient();
    const [techInput, setTechInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const form = useForm<ProjectInput>({
        resolver: zodResolver(ProjectSchema),
        defaultValues: {
            title: "",
            overview: "",
            techStack: [],
            type: "Web Application",
            link: "",
            github: "",
            features: [{ title: "", subject: "" }],
            images: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "features",
    });

    const { mutate, isPending } = useMutation({
        mutationFn: createProject,
        onSuccess: (data: any) => {
            if (data.error) {
                toast.error(typeof data.error === 'string' ? data.error : "Failed to add project");
            } else {
                toast.success("Project added successfully!");
                form.reset();
                setTechInput("");
                setPreviews([]);
                setSelectedFiles([]);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newFiles = [...selectedFiles, ...files];
        setSelectedFiles(newFiles);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);

        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const onSubmit = (data: ProjectInput) => {
        const formData = new FormData();

        // Append basic fields
        formData.append("title", data.title);
        formData.append("overview", data.overview);
        formData.append("type", data.type);
        formData.append("link", data.link || "");
        formData.append("github", data.github || "");
        formData.append("techStack", JSON.stringify(data.techStack));
        formData.append("features", JSON.stringify(data.features));

        // Append files
        selectedFiles.forEach(file => {
            formData.append("images", file);
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* Basic Info */}
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

                        {/* Links */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="link"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2"><LuLink className="size-3" /> Live Demo URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="github"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2"><LuGithub className="size-3" /> GitHub Repo URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://github.com/..." {...field} />
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
                                    <FormLabel>Professional Overview</FormLabel>
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

                        {/* Tech Stack */}
                        <div className="space-y-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                            <FormLabel className="text-primary font-black uppercase tracking-widest text-xs">Technology Stack</FormLabel>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add tech (e.g. Next.js)"
                                    value={techInput}
                                    onChange={(e) => setTechInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                                    className="bg-background"
                                />
                                <Button type="button" variant="outline" onClick={handleAddTech} className="shrink-0">
                                    Add Tech
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {form.watch("techStack").map(tech => (
                                    <span key={tech} className="bg-primary/20 text-primary text-[10px] font-black px-3 py-1.5 rounded-md flex items-center gap-2 border border-primary/20 uppercase tracking-tighter">
                                        {tech}
                                        <button type="button" onClick={() => removeTech(tech)} className="hover:text-red-500 font-bold ml-1">×</button>
                                    </span>
                                ))}
                            </div>
                            <FormMessage>{form.formState.errors.techStack?.message}</FormMessage>
                        </div>

                        {/* Key Features */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-foreground font-bold">Key Project Features</FormLabel>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => append({ title: "", subject: "" })}
                                    className="text-primary hover:bg-primary/5"
                                >
                                    <LuPlus className="mr-1 size-4" /> Add Feature
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 items-start p-4 rounded-lg border border-border/50 bg-background/30">
                                        <FormField
                                            control={form.control}
                                            name={`features.${index}.title`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder="Feature Title" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`features.${index}.subject`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder="Feature Description/Subject" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {fields.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                className="text-destructive hover:bg-destructive/10"
                                            >
                                                <LuTrash2 className="size-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <FormMessage>{form.formState.errors.features?.message}</FormMessage>
                        </div>

                        {/* Image Gallery */}
                        <div className="space-y-4 p-5 border-2 border-dashed border-border/50 rounded-2xl bg-muted/5">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <FormLabel className="flex items-center gap-2"><LuImage className="text-primary" /> Visual Gallery</FormLabel>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Upload project screenshots</p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-primary/50 text-primary hover:bg-primary/5 shadow-sm"
                                >
                                    Select Images
                                </Button>
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {previews.map((src, index) => (
                                    <div key={index} className="group relative aspect-video rounded-lg overflow-hidden border border-border/50 bg-background shadow-sm hover:border-primary/50 transition-all">
                                        <Image src={src} alt={`Preview ${index}`} fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 p-1.5 bg-background/80 backdrop-blur-sm rounded-md text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white shadow-xl"
                                        >
                                            <LuTrash2 className="size-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button type="submit" disabled={isPending} className="w-full h-14 text-lg font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]">
                            {isPending ? <Spinner className="mr-3" /> : <LuSave className="mr-3" />}
                            Engineer & Publish
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
