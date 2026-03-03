"use client";

import { Terminal, Box, Code2, Bot, Layers, Server, BrainCircuit, Network } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface ExpertiseItem {
    id: number;
    heading: string;
    content: string[];
}

interface ExpertiseSectionProps {
    expertiseList?: ExpertiseItem[];
}

export default function ExpertiseSection({ expertiseList = [] }: ExpertiseSectionProps) {
    const defaultExpertise = [
        {
            title: "Core Engineering",
            icon: <Server className="size-8 text-cyan-400" />,
            topGradient: "bg-gradient-to-r from-blue-500 to-cyan-400",
            hoverGlow: "hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:border-cyan-400/50",
            skills: ["Python", "TypeScript", "Docker", "PostgreSQL", "FastAPI", "Next.js"],
        },
        {
            title: "AI & Agentic Dev",
            icon: <BrainCircuit className="size-8 text-primary" />,
            topGradient: "bg-gradient-to-r from-primary to-purple-500",
            hoverGlow: "hover:shadow-[0_0_30px_rgba(13,89,242,0.3)] hover:border-primary/50",
            skills: ["n8n", "Flowise", "OpenAI API", "Anthropic", "Prompt Eng."],
        },
        {
            title: "AI Frameworks",
            icon: <Network className="size-8 text-pink-500" />,
            topGradient: "bg-gradient-to-r from-purple-500 to-pink-500",
            hoverGlow: "hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:border-pink-500/50",
            skills: ["LangChain", "LangGraph", "LlamaIndex", "AutoGen", "RAG"],
        },
    ];

    // Helper to get visual theme based on index
    const getVisualTheme = (index: number) => {
        const themes = [
            {
                icon: <Server className="size-8 text-cyan-400" />,
                topGradient: "bg-gradient-to-r from-blue-500 to-cyan-400",
                hoverGlow: "hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:border-cyan-400/50",
            },
            {
                icon: <BrainCircuit className="size-8 text-primary" />,
                topGradient: "bg-gradient-to-r from-primary to-purple-500",
                hoverGlow: "hover:shadow-[0_0_30px_rgba(13,89,242,0.3)] hover:border-primary/50",
            },
            {
                icon: <Network className="size-8 text-pink-500" />,
                topGradient: "bg-gradient-to-r from-purple-500 to-pink-500",
                hoverGlow: "hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:border-pink-500/50",
            }
        ];
        return themes[index % themes.length];
    };

    const displayExpertise = expertiseList.length > 0
        ? expertiseList.map((item, idx) => ({
            title: item.heading,
            skills: item.content,
            ...getVisualTheme(idx)
        }))
        : defaultExpertise;

    // Animation variants for cards container
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    // Animation variants for individual cards
    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <section id="skills" className="w-full mt-12 pb-20">
            <div className="container mx-auto px-6 md:px-10 lg:px-40">

                {/* Section Header */}
                <div className="flex items-center gap-3 mb-8">
                    <span className="h-px flex-1 bg-border/50 dark:bg-[#282e39]"></span>
                    <Terminal className="size-5 text-primary" />
                    <h2 className="text-foreground dark:text-white text-2xl font-bold tracking-tight">Technical Expertise</h2>
                    <span className="h-px flex-1 bg-border/50 dark:bg-[#282e39]"></span>
                </div>

                {/* Grid Content: Three Columns */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {displayExpertise.map((area, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className={`flex flex-col rounded-2xl border border-border/50 dark:border-[#282e39] bg-surface-dark dark:bg-[#1b1f27] overflow-hidden transition-all duration-300 ${area.hoverGlow}`}
                        >
                            {/* Color Top Border */}
                            <div className={`h-2 w-full ${area.topGradient}`}></div>

                            <div className="p-6 flex flex-col gap-6 h-full">
                                {/* Card Header */}
                                <div className="flex items-center gap-3">
                                    {area.icon}
                                    <h3 className="text-foreground dark:text-white text-xl font-bold">{area.title}</h3>
                                </div>

                                {/* Skills Pills */}
                                <div className="flex flex-wrap gap-2 content-start">
                                    {area.skills.map((skill, skillIndex) => (
                                        <span
                                            key={skillIndex}
                                            className="px-3 py-1 rounded-md bg-background dark:bg-[#111318] border border-border/50 dark:border-[#282e39] text-sm text-muted-foreground dark:text-[#9ca6ba] font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}
