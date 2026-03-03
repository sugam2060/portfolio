"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Rocket,
    ArrowRight,
    Download,
    TerminalSquare,
    Database,
    FileJson,
    Blocks,
    Cloud
} from "lucide-react";
import Link from "next/link";

export default function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 animate-fade-in">

            {/* Animated Rocket Graphic */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-[600px] aspect-[16/9] mb-10 group"
            >
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>

                <div className="relative w-full h-full bg-surface-dark dark:bg-[#1a212e] rounded-xl border border-border/50 dark:border-[#282e39] overflow-hidden flex items-center justify-center flex-col gap-6 p-8">

                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
                        <div className="absolute inset-4 bg-primary/40 rounded-full blur-xl"></div>
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        >
                            <Rocket className="size-16 text-primary relative z-10" />
                        </motion.div>
                    </div>

                    <div className="space-y-2 text-center max-w-sm">
                        <div className="flex items-center justify-center gap-2 text-primary/80 font-mono text-xs uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Open to Work
                        </div>
                        <h3 className="text-foreground dark:text-white text-xl font-bold font-display">Ready for Launch</h3>
                    </div>

                </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex max-w-[520px] flex-col items-center gap-6 text-center"
            >
                <h2 className="text-foreground dark:text-white text-2xl sm:text-3xl font-bold leading-tight tracking-[-0.015em] font-display">
                    Currently seeking my first full-time role!
                </h2>

                <p className="text-muted-foreground dark:text-[#9ca6ba] text-lg font-normal leading-relaxed">
                    In the meantime, I&apos;m busy building AI applications, contributing to open source, and expanding my skill set.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
                    <Button asChild size="lg" className="group rounded-lg bg-primary hover:bg-blue-600 shadow-lg shadow-primary/25 hover:shadow-primary/40 font-bold transition-all h-12 px-6">
                        <Link href="/projects" className="flex items-center gap-2">
                            View My Projects
                            <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>

                    <Button asChild variant="outline" size="lg" className="bg-surface-dark dark:bg-[#1a212e] border-border/50 dark:border-[#282e39] hover:bg-accent dark:hover:bg-[#282e39] text-muted-foreground dark:text-slate-300 hover:text-foreground dark:hover:text-white font-medium h-12 px-6 rounded-lg transition-all">
                        <a href="/resume.pdf" className="flex items-center gap-2" download>
                            Download Resume
                            <Download className="size-5" />
                        </a>
                    </Button>
                </div>
            </motion.div>

            {/* Tech Stack Floating Banner */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-full border-t border-border/50 dark:border-[#282e39] pt-10 pb-4 mt-16"
            >
                <p className="text-center text-muted-foreground dark:text-[#9ca6ba] text-sm mb-6 uppercase tracking-widest font-bold">
                    Technologically Fluent In
                </p>

                <div className="flex flex-wrap justify-center gap-4 sm:gap-8 opacity-60 hover:opacity-100 transition-opacity">
                    {[
                        { name: "Python", icon: <TerminalSquare className="size-5 text-primary" /> },
                        { name: "TensorFlow", icon: <Database className="size-5 text-primary" /> },
                        { name: "JavaScript", icon: <FileJson className="size-5 text-primary" /> },
                        { name: "React", icon: <Blocks className="size-5 text-primary" /> },
                        { name: "AWS", icon: <Cloud className="size-5 text-primary" /> }
                    ].map((tech) => (
                        <div key={tech.name} className="flex items-center gap-2 px-4 py-2 bg-surface-dark dark:bg-[#1a212e] rounded-full border border-border/50 dark:border-[#282e39]">
                            {tech.icon}
                            <span className="text-sm font-medium text-muted-foreground dark:text-slate-300">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

        </div>
    );
}
