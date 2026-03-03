"use client";

import { Calendar, Code } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface FeaturedProjectCardProps {
    project: any;
}

export default function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
    if (!project) return null;

    const technologies = typeof project.techStack === 'string' ? JSON.parse(project.techStack) : project.techStack;
    const imageUrl = project.gallery?.[0]?.photoUrl;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8 w-full"
        >
            <div className="group relative overflow-hidden rounded-xl bg-surface-dark dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] shadow-sm transition-all hover:border-primary/50 hover:shadow-md hover:shadow-primary/5">
                <div className="grid md:grid-cols-2 gap-0">

                    {/* Image Column */}
                    <div
                        className="h-64 md:h-auto bg-cover bg-center bg-primary/5 flex items-center justify-center relative"
                        style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : {}}
                        aria-label={project.title}
                    >
                        {!imageUrl && (
                            <div className="flex flex-col items-center gap-2 text-primary/40">
                                <Code className="size-20" />
                                <span className="text-xs font-black uppercase tracking-[0.3em] font-mono">{project.type}</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface-dark dark:to-[#1b1f27] opacity-40"></div>
                    </div>

                    {/* Content Column */}
                    <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-1 rounded bg-primary text-white text-[10px] font-black uppercase tracking-widest">Featured</span>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">
                                {project.type}
                            </span>
                        </div>

                        <h3 className="text-foreground dark:text-white text-2xl font-black mb-3 group-hover:text-primary transition-colors tracking-tight">
                            {project.title}
                        </h3>

                        <p className="text-muted-foreground dark:text-[#9ca6ba] text-base leading-relaxed mb-6 line-clamp-4">
                            {project.overview}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-8">
                            {technologies?.map((tech: string) => (
                                <span key={tech} className="px-3 py-1 rounded-md bg-primary/5 text-primary text-[10px] font-bold uppercase border border-primary/10">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <Link href="#" className="flex items-center justify-center rounded-lg h-11 px-8 bg-primary hover:bg-primary/90 text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95">
                                Case Study
                            </Link>
                            <Link href="#" className="flex items-center justify-center rounded-lg h-11 px-8 bg-transparent border border-border/50 dark:border-[#282e39] hover:border-primary text-muted-foreground dark:text-[#9ca6ba] hover:text-primary text-sm font-bold transition-all">
                                <Code className="size-4 mr-2" /> Source
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
}
