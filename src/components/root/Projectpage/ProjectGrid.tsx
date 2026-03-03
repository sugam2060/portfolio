"use client";

import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface ProjectGridProps {
    projects: any[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export default function ProjectGrid({ projects = [], pagination }: ProjectGridProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const formattedProjects = projects.map(p => ({
        id: p.id,
        title: p.title,
        description: p.overview,
        type: p.type,
        technologies: typeof p.techStack === 'string' ? JSON.parse(p.techStack) : p.techStack,
        imageUrl: p.gallery?.[0]?.photoUrl,
        link: p.link,
    }));

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`, { scroll: false });
    };

    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-muted-foreground text-lg italic">No projects found in this sector.</p>
            </div>
        );
    }

    return (
        <>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.15 }
                    }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {formattedProjects.map((project) => (
                    <ProjectCard key={project.id} {...project} />
                ))}
            </motion.div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <div className="mt-12 mb-12 flex justify-center items-center gap-2">
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="flex items-center justify-center size-10 rounded-lg bg-surface-dark dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] text-muted-foreground dark:text-[#9ca6ba] hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                        <ChevronLeft className="size-5" />
                    </button>

                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`flex items-center justify-center size-10 rounded-lg font-bold transition-all shadow-lg ${pagination.page === pageNum
                                    ? "bg-primary text-white shadow-primary/25"
                                    : "bg-surface-dark dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] text-muted-foreground dark:text-[#9ca6ba] hover:bg-primary hover:text-white"
                                }`}
                        >
                            {pageNum}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="flex items-center justify-center size-10 rounded-lg bg-surface-dark dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] text-muted-foreground dark:text-[#9ca6ba] hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                        <ChevronRight className="size-5" />
                    </button>
                </div>
            )}
        </>
    );
}
