"use client";

import { Building2, MapPin, Calendar, Tag } from "lucide-react";
import { motion } from "framer-motion";

interface NonEmptyStateProps {
    data: {
        id: number;
        companyName: string;
        role: string;
        duration: string;
        location: string;
        description: string; // JSON string
        skills: string; // JSON string
    };
}

export default function NonEmptyState({ data }: NonEmptyStateProps) {
    const descriptionPoints = JSON.parse(data.description || "[]");
    const skills = JSON.parse(data.skills || "[]");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-4"
        >
            <div className="relative w-full bg-surface-dark dark:bg-[#1a212e] rounded-xl border border-border/50 dark:border-[#282e39] overflow-hidden flex flex-col gap-6 p-8 hover:border-primary/30 transition-colors shadow-xl shadow-black/5">
                <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-border/10 dark:border-[#282e39]/50 pb-6">
                    <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                        <Building2 className="size-7" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-foreground dark:text-white text-2xl font-black uppercase tracking-tighter">{data.companyName}</h3>
                        <p className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                            {data.role}
                        </p>
                    </div>
                    <div className="md:text-right flex flex-col gap-1 items-start md:items-end">
                        <div className="flex items-center gap-2 text-muted-foreground dark:text-[#9ca6ba] text-xs font-black uppercase tracking-widest">
                            <Calendar className="size-3.5 text-primary" />
                            {data.duration}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest px-2 py-1 bg-muted/30 rounded-lg">
                            <MapPin className="size-3 text-primary" />
                            {data.location}
                        </div>
                    </div>
                </div>

                <ul className="space-y-4 text-muted-foreground dark:text-[#9ca6ba] text-sm font-medium">
                    {descriptionPoints.map((point: string, idx: number) => (
                        <li key={idx} className="flex gap-3 leading-relaxed">
                            <span className="mt-1.5 size-1.5 rounded-full bg-primary/40 shrink-0"></span>
                            {point}
                        </li>
                    ))}
                </ul>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-border/10">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground w-full mb-2 flex items-center gap-2">
                        <Tag className="size-3" /> Stack & Competencies
                    </span>
                    {skills.map((skill: string, idx: number) => (
                        <span key={idx} className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
