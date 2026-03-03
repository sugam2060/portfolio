"use client";

import { Calendar, Code } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FeaturedProjectCard() {
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
                        className="h-64 md:h-auto bg-cover bg-center"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCOEC6q5lznEczwYQL3wLZp8EeBW317t4-fZTI-sD9V6LSXkSPDHYcwLzCrMRc25kuxz6lOVCOg2XMY4cVSbFBJUHDIinNtdy9F8xGlUHFs_qwA0IUEjRdLn-TEXPt6ixwlV9qW3oDgdWA21xM2Nggl8w3j1V7FaG84VbyeYdrLLkxhhoNFSliHqf-4F0qme6WGgtj-liejXZOI9Lsj_WLkSyTZtd10TC2-IlbM74w-AvFD1KpvGbRtY_0LSUJxZcR6l3_Xuc_8s1EV")' }}
                        aria-label="Abstract AI neural network visualization with blue nodes"
                    ></div>

                    {/* Content Column */}
                    <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">Featured</span>
                            <span className="text-muted-foreground dark:text-[#9ca6ba] text-sm flex items-center gap-1">
                                <Calendar className="size-4" /> 2023
                            </span>
                        </div>

                        <h3 className="text-foreground dark:text-white text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                            AI Chatbot Assistant
                        </h3>

                        <p className="text-muted-foreground dark:text-[#9ca6ba] text-base leading-relaxed mb-6">
                            A sophisticated conversational agent built with LangChain and OpenAI to assist with customer queries efficiently. It features memory retention, context awareness, and seamless integration with existing support tickets.
                        </p>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {["Python", "LangChain", "React", "PostgreSQL"].map((tech) => (
                                <span key={tech} className="px-3 py-1 rounded-full bg-background dark:bg-[#111318] text-muted-foreground dark:text-[#9ca6ba] text-xs font-medium border border-border/50 dark:border-[#282e39]">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <Link href="#" className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-colors">
                                View Case Study
                            </Link>
                            <Link href="#" className="flex items-center justify-center rounded-lg h-10 px-6 bg-transparent border border-border/50 dark:border-[#282e39] hover:border-primary text-muted-foreground dark:text-[#9ca6ba] hover:text-primary text-sm font-bold transition-colors">
                                <Code className="size-4 mr-2" /> Source Code
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
}
