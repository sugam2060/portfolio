"use client";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getProjects, deleteProject, toggleFeaturedProject } from "@/actions/ProjectActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LuPlus, LuTrash2, LuStar, LuList, LuLayers, LuInfo, LuArrowUpRight } from "react-icons/lu";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function ProjectList() {
    const queryClient = useQueryClient();
    const { data: projectsData, isLoading } = useQuery({
        queryKey: ["admin-projects"],
        queryFn: () => getProjects(1, 100), // Admin view usually needs more or all
    });

    const { mutate: handleDelete, isPending: isDeleting } = useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            toast.success("Project deleted!");
            queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
        },
    });

    const { mutate: handleToggleFeatured, isPending: isToggling } = useMutation({
        mutationFn: ({ id, isFeatured }: { id: number; isFeatured: boolean }) => toggleFeaturedProject(id, isFeatured),
        onSuccess: () => {
            toast.success("Project featured status updated!");
            queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
        },
    });

    if (isLoading) return <div className="flex justify-center p-10"><Spinner className="size-10 text-primary" /></div>;

    const projects = Array.isArray(projectsData?.data) ? projectsData.data : [];

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl mt-6">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/10 pb-4 mb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <LuList className="text-primary" />
                    Portfolio Repository
                </CardTitle>
                <div className="flex gap-2">
                    <Badge variant="outline" className="text-primary border-primary/20">Total: {projects.length}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {projects.map((project: any) => (
                        <div
                            key={project.id}
                            className="group flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md gap-4"
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <div className="relative size-12 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 flex-shrink-0 overflow-hidden">
                                    {project.gallery?.[0]?.photoUrl ? (
                                        <Image
                                            src={project.gallery[0].photoUrl}
                                            alt={project.title}
                                            fill
                                            sizes="48px"
                                            quality={60}
                                            className="object-cover"
                                        />
                                    ) : (
                                        <LuLayers className="size-6 z-10" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-extrabold text-foreground group-hover:text-primary transition-colors truncate text-base">{project.title}</h4>
                                        <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity">
                                            {project.type}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-1 max-w-md mt-1">{project.overview}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 ml-auto">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className={`h-9 w-9 rounded-lg border border-border/30 hover:bg-yellow-500/10 hover:text-yellow-500 transition-all ${project.isFeatured ? 'text-yellow-500 bg-yellow-500/5 border-yellow-500/20' : ''}`}
                                    onClick={() => handleToggleFeatured({ id: project.id, isFeatured: !project.isFeatured })}
                                    title={project.isFeatured ? "Unfeature Project" : "Feature Project"}
                                >
                                    <LuStar className={`size-4 ${project.isFeatured ? 'fill-current' : ''}`} />
                                </Button>

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-9 w-9 rounded-lg border border-border/30 text-destructive hover:bg-destructive hover:text-white transition-all"
                                    onClick={() => handleDelete(project.id)}
                                >
                                    <LuTrash2 className="size-4" />
                                </Button>

                                <Link href={`/admin/projects/edit/${project.id}`}>
                                    <Button size="icon" variant="outline" className="h-9 w-9 rounded-lg border border-border/30 hover:border-primary hover:text-primary transition-all">
                                        <LuArrowUpRight className="size-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}

                    {projects.length === 0 && (
                        <div className="py-12 text-center border-2 border-dashed border-border/50 rounded-2xl text-muted-foreground text-sm italic bg-muted/20">
                            Your architectural portfolio is empty. Start by adding a new project blueprint above.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
