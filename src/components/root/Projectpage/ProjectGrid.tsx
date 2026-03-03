"use client";

import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectGridProps {
    projects: any[];
}

export default function ProjectGrid({ projects = [] }: ProjectGridProps) {
    const formattedProjects = projects.map(p => ({
        id: p.id,
        title: p.title,
        description: p.overview,
        type: p.type,
        technologies: typeof p.techStack === 'string' ? JSON.parse(p.techStack) : p.techStack,
        imageUrl: p.gallery?.[0]?.photoUrl, // Take first image as thumbnail
    }));

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
            <div className="mt-12 mb-12 flex justify-center items-center gap-2">
                <button className="flex items-center justify-center size-10 rounded-lg bg-surface-dark dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] text-muted-foreground dark:text-[#9ca6ba] hover:bg-primary hover:text-white transition-all">
                    <ChevronLeft className="size-5" />
                </button>
                <button className="flex items-center justify-center size-10 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/25">
                    1
                </button>
                <button className="flex items-center justify-center size-10 rounded-lg bg-surface-dark dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] text-muted-foreground dark:text-[#9ca6ba] hover:bg-primary hover:text-white font-bold transition-all">
                    2
                </button>
                <button className="flex items-center justify-center size-10 rounded-lg bg-surface-dark dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] text-muted-foreground dark:text-[#9ca6ba] hover:bg-primary hover:text-white font-bold transition-all">
                    3
                </button>
                <span className="px-2 text-muted-foreground dark:text-[#9ca6ba]">...</span>
                <button className="flex items-center justify-center size-10 rounded-lg bg-surface-dark dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] text-muted-foreground dark:text-[#9ca6ba] hover:bg-primary hover:text-white font-bold transition-all">
                    12
                </button>
                <button className="flex items-center justify-center size-10 rounded-lg bg-surface-dark dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] text-muted-foreground dark:text-[#9ca6ba] hover:bg-primary hover:text-white transition-all">
                    <ChevronRight className="size-5" />
                </button>
            </div>
        </>
    );
}
