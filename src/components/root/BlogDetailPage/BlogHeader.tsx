"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface BlogHeaderProps {
    title: string;
    type: string;
    readTime: string;
    createdAt: Date | string | null;
    imageUrl: string;
}

export default function BlogHeader({ title, type, readTime, createdAt, imageUrl }: BlogHeaderProps) {
    const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : "Recently published";

    return (
        <section className="relative w-full pt-12 md:pt-20 pb-12 overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8 group uppercase tracking-widest"
                    >
                        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                        Back to Insights
                    </Link>
                </motion.div>

                {/* Categories & Metadata */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex flex-wrap items-center gap-4 mb-6"
                >
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                        <Tag className="size-3" />
                        {type}
                    </span>
                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground/60">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="size-3.5" />
                            {formattedDate}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="size-3.5" />
                            {readTime}
                        </span>
                    </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-12 uppercase text-foreground"
                >
                    {title}
                </motion.h1>

                {/* Image Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
                    className="relative aspect-video rounded-3xl overflow-hidden bg-surface-dark border border-border/50 shadow-2xl shadow-primary/5"
                >
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            priority
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/20 text-muted-foreground/20 italic">
                            No cover image available
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-[150px]" />
            </div>
        </section>
    );
}
