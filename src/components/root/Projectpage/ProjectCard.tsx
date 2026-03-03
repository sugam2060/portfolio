"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LuExternalLink, LuLayers, LuSparkles } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
    id: number;
    title: string;
    description: string;
    type: string;
    technologies: string[];
    imageUrl?: string;
    link?: string;
}

export default function ProjectCard({
    title,
    description,
    type,
    technologies,
    imageUrl,
    link
}: ProjectCardProps) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="group h-full"
        >
            <Card className="relative overflow-hidden h-full border-border/50 dark:border-[#282e39] bg-surface-dark dark:bg-[#11141a]/80 backdrop-blur-md hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col">
                {/* Image Section */}
                <div className="relative aspect-[16/10] overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#1b1f27] flex items-center justify-center">
                            <LuLayers className="size-12 text-muted-foreground/20" />
                        </div>
                    )}

                    {/* Floating Badge */}
                    <div className="absolute top-4 left-4 z-20">
                        <Badge className="bg-primary/90 text-white border-0 px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                            {type}
                        </Badge>
                    </div>
                </div>

                <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-3 gap-2">
                        <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1 uppercase">
                            {title}
                        </h3>
                        {link && (
                            <Link
                                href={link}
                                target="_blank"
                                className="p-2 rounded-lg bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                            >
                                <LuExternalLink className="size-4" />
                            </Link>
                        )}
                    </div>

                    <p className="text-muted-foreground dark:text-[#9ca6ba] text-sm font-medium leading-relaxed mb-6 line-clamp-3">
                        {description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-border/20 flex flex-wrap gap-2">
                        {technologies.slice(0, 3).map((tech) => (
                            <span
                                key={tech}
                                className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-primary/70 bg-primary/5 px-2 py-1 rounded"
                            >
                                <LuSparkles className="size-2" />
                                {tech}
                            </span>
                        ))}
                        {technologies.length > 3 && (
                            <span className="text-[10px] font-bold text-muted-foreground/50 self-center">
                                +{technologies.length - 3}
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
