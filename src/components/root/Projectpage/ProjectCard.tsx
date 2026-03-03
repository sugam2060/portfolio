"use client";

import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ProjectCardProps {
    title: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
    technologies: string[];
    link?: string;
}

export default function ProjectCard({
    title,
    description,
    imageUrl,
    imageAlt,
    technologies,
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
                <div className="relative h-48 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url("${imageUrl}")` }}
                        aria-label={imageAlt}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark dark:from-[#1b1f27] to-transparent opacity-60"></div>
                </div>
                <div className="flex flex-col flex-1 p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-foreground dark:text-white text-lg font-bold group-hover:text-primary transition-colors">{title}</h4>
                        <ExternalLink className="size-5 text-muted-foreground dark:text-[#9ca6ba] group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-muted-foreground dark:text-[#9ca6ba] text-sm mb-4 flex-1 line-clamp-3">
                        {description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {technologies.map((tech) => (
                            <span key={tech} className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
