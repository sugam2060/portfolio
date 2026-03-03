"use client";

import { ExternalLink, Layers } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ProjectCardProps {
    id: number;
    title: string;
    description: string;
    imageUrl?: string;
    technologies: string[];
    type: string;
    link?: string;
}

export default function ProjectCard({
    title,
    description,
    imageUrl,
    technologies,
    type,
    link = "#"
}: ProjectCardProps) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeOut" }
                }
            }}
            className="group flex flex-col rounded-xl bg-surface-dark dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] overflow-hidden transition-all hover:border-primary/50 hover:-translate-y-1 duration-300"
        >
            <Link href={link} className="flex flex-col h-full">
                <div className="relative h-48 overflow-hidden bg-primary/5 flex items-center justify-center border-b border-border/10">
                    {imageUrl ? (
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: `url("${imageUrl}")` }}
                            aria-label={title}
                        ></div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-primary/40 group-hover:text-primary transition-colors">
                            <Layers className="size-16" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{type}</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark dark:from-[#1b1f27] to-transparent opacity-60"></div>
                </div>
                <div className="flex flex-col flex-1 p-5">
                    <div className="flex justify-between items-start mb-2 gap-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-primary tracking-widest">{type}</span>
                            <h4 className="text-foreground dark:text-white text-lg font-bold group-hover:text-primary transition-colors">{title}</h4>
                        </div>
                        <ExternalLink className="size-5 text-muted-foreground dark:text-[#9ca6ba] group-hover:text-primary transition-colors shrink-0" />
                    </div>
                    <p className="text-muted-foreground dark:text-[#9ca6ba] text-sm mb-4 flex-1 line-clamp-3">
                        {description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                        {technologies?.map((tech) => (
                            <span key={tech} className="text-[10px] font-extrabold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md uppercase tracking-tighter">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
