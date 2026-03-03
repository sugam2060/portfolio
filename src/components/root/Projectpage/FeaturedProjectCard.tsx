"use client";

import { Calendar, Code, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

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
            className="mb-12 w-full"
        >
            <div className="group relative overflow-hidden rounded-[2rem] bg-surface-dark dark:bg-[#11141a]/90 border border-border/50 dark:border-[#282e39] shadow-2xl transition-all duration-500 hover:border-primary/50 hover:shadow-primary/5">
                <div className="grid md:grid-cols-5 gap-0">

                    {/* Image Column - 3/5 width */}
                    <div className="md:col-span-3 relative h-72 md:h-[450px] overflow-hidden bg-primary/5">
                        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-700 z-10" />

                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-2 text-primary/20">
                                <Code className="size-32" />
                                <span className="text-[10px] font-black uppercase tracking-[1em] ml-4">{project.type}</span>
                            </div>
                        )}

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-surface-dark/80 z-20"></div>

                        {/* Featured Tag */}
                        <div className="absolute top-6 left-6 z-30">
                            <div className="flex items-center gap-2 bg-primary px-4 py-2 rounded-full shadow-2xl shadow-primary/40">
                                <div className="size-1.5 bg-white rounded-full animate-pulse" />
                                <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Featured Blueprint</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Column - 2/5 width */}
                    <div className="md:col-span-2 flex flex-col justify-center p-8 md:p-12 relative z-30">
                        <div className="mb-4">
                            <span className="text-[10px] uppercase font-black text-primary tracking-[0.3em]">
                                {project.type}
                            </span>
                        </div>

                        <h3 className="text-foreground dark:text-white text-3xl md:text-4xl font-black mb-4 group-hover:text-primary transition-colors tracking-tighter uppercase leading-none">
                            {project.title}
                        </h3>

                        <p className="text-muted-foreground dark:text-[#9ca6ba] text-base leading-relaxed mb-8 line-clamp-5 font-medium">
                            {project.overview}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-10">
                            {technologies?.slice(0, 5).map((tech: string) => (
                                <span key={tech} className="px-3 py-1.5 rounded-lg bg-primary/5 text-primary text-[10px] font-black uppercase border border-primary/10 tracking-widest transition-colors hover:bg-primary/10">
                                    {tech}
                                </span>
                            ))}
                            {technologies?.length > 5 && (
                                <span className="text-[10px] font-bold text-muted-foreground/40 self-center">
                                    +{technologies.length - 5}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {project.link && (
                                <Link
                                    href={project.link}
                                    target="_blank"
                                    className="flex items-center justify-center rounded-xl h-14 px-8 bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all active:scale-95 group/btn"
                                >
                                    Live Demo
                                    <ExternalLink className="size-4 ml-2 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                                </Link>
                            )}
                            {project.github && (
                                <Link
                                    href={project.github}
                                    target="_blank"
                                    className="flex items-center justify-center rounded-xl h-14 px-8 bg-transparent border border-border/50 dark:border-[#282e39] hover:border-primary text-muted-foreground dark:text-[#9ca6ba] hover:text-primary text-xs font-black uppercase tracking-[0.2em] transition-all group/source"
                                >
                                    <Github className="size-4 mr-2" />
                                    Source
                                </Link>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
}
