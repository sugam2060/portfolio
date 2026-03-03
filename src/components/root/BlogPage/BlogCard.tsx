"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

interface BlogCardProps {
    title: string;
    description: string;
    date: string;
    readTime: string;
    category: string;
    imageUrl: string;
    imageAlt: string;
    icon: React.ReactNode;
    link?: string;
}

export default function BlogCard({
    title,
    description,
    date,
    readTime,
    category,
    imageUrl,
    imageAlt,
    icon,
    link = "#"
}: BlogCardProps) {
    return (
        <motion.article
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeOut" }
                }
            }}
            className="flex flex-col group rounded-2xl border border-border/50 dark:border-[#282e39] bg-surface-dark dark:bg-[#1b1f27] p-5 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5"
        >
            <div className="relative aspect-video overflow-hidden rounded-xl mb-4">
                <div className="absolute inset-0 bg-slate-200 dark:bg-primary/5 flex items-center justify-center">
                    {icon}
                </div>
                <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 relative z-10 opacity-90"
                />
                <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                        {category}
                    </span>
                </div>
            </div>

            <div className="flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs text-muted-foreground dark:text-[#9ca6ba] mb-3">
                    <span>{date}</span>
                    <span className="size-1 rounded-full bg-primary/40"></span>
                    <span>{readTime}</span>
                </div>

                <h3 className="text-foreground dark:text-white text-xl font-bold mb-2 group-hover:text-primary transition-colors leading-tight">
                    {title}
                </h3>

                <p className="text-muted-foreground dark:text-[#9ca6ba] text-sm line-clamp-2 mb-4 leading-relaxed">
                    {description}
                </p>

                <Link href={link} className="mt-auto inline-flex items-center text-sm font-bold text-primary gap-1 group/link">
                    Read More
                    <ArrowRight className="size-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
            </div>
        </motion.article>
    );
}
