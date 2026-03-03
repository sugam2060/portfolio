"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExperiences, deleteExperience } from "@/actions/ExperienceActions";
import { Button } from "@/components/ui/button";
import { LuPlus, LuTrash2, LuPencil, LuBriefcase, LuMapPin, LuCalendar } from "react-icons/lu";
import { toast } from "sonner";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

export default function ExperienceList() {
    const queryClient = useQueryClient();

    const { data: experiences = [], isLoading } = useQuery({
        queryKey: ["admin-experience"],
        queryFn: () => getExperiences(),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteExperience(id),
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Experience deleted");
                queryClient.invalidateQueries({ queryKey: ["admin-experience"] });
            } else {
                toast.error(res.error);
            }
        },
    });

    if (isLoading) return (
        <div className="flex justify-center py-10">
            <Spinner className="size-8" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold uppercase tracking-tight text-foreground dark:text-white">Professional History</h2>
                <Link href="/admin/admin/experience/new">
                    <Button className="font-black uppercase tracking-widest text-[10px] gap-2">
                        <LuPlus className="size-3" />
                        Add Experience
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {experiences.length === 0 ? (
                    <div className="bg-surface-dark dark:bg-[#11141a] p-12 rounded-2xl border border-dashed border-border/50 text-center">
                        <p className="text-muted-foreground italic text-sm">No work history found. Add your first role!</p>
                    </div>
                ) : (
                    experiences.map((exp: any) => (
                        <div key={exp.id} className="bg-surface-dark dark:bg-[#11141a] p-6 rounded-2xl border border-border/50 dark:border-[#282e39] group hover:border-primary/50 transition-all">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <LuBriefcase className="size-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-sm uppercase text-foreground dark:text-white">{exp.companyName}</h3>
                                        <p className="text-xs text-primary font-bold uppercase tracking-wider">{exp.role}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:items-end text-xs text-muted-foreground font-medium">
                                    <div className="flex items-center gap-2">
                                        <LuCalendar className="size-3" />
                                        {exp.duration}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <LuMapPin className="size-3" />
                                        {exp.location}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Link href={`/admin/admin/experience/${exp.id}`}>
                                        <Button variant="ghost" size="icon" className="size-8 hover:bg-primary/10 hover:text-primary">
                                            <LuPencil className="size-3.5" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 text-destructive hover:bg-destructive/10"
                                        onClick={() => {
                                            if (confirm("Delete this experience entry?")) {
                                                deleteMutation.mutate(exp.id);
                                            }
                                        }}
                                    >
                                        <LuTrash2 className="size-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
