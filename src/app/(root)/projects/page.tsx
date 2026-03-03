"use client";

import FeaturedProjectCard from "@/components/root/Projectpage/FeaturedProjectCard";
import ProjectGrid from "@/components/root/Projectpage/ProjectGrid";
import { Sparkles, Bot, ServerCog, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
    const filters = [
        { label: "All", icon: <Sparkles className="size-4" />, active: true },
        { label: "AI/ML", icon: <Bot className="size-4" />, active: false },
        { label: "Backend", icon: <ServerCog className="size-4" />, active: false },
        { label: "Web Dev", icon: <Globe className="size-4" />, active: false },
    ];

    return (
        <main className="flex flex-1 justify-center py-10 px-4 md:px-10 lg:px-40">
            <div className="layout-content-container flex flex-col w-full max-w-[1200px] flex-1">

                {/* Section Header */}
                <div className="flex flex-col items-center text-center pb-10 pt-6">
                    <h1 className="text-foreground dark:text-white tracking-tight text-4xl md:text-5xl font-bold leading-tight mb-4">
                        Awesome Projects
                    </h1>
                    <p className="text-muted-foreground dark:text-[#9ca6ba] max-w-2xl text-lg">
                        Exploring the intersection of AI, robust backends, and intuitive frontends. Here are some things I've built.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-3 pb-8 flex-wrap justify-center">
                    {filters.map((filter, index) => (
                        <button
                            key={index}
                            className={`group flex h-9 items-center justify-center gap-x-2 rounded-full px-5 transition-all ${filter.active
                                    ? "bg-primary text-white"
                                    : "bg-surface-dark dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] text-muted-foreground dark:text-[#9ca6ba] hover:bg-muted dark:hover:bg-[#282e39] hover:text-foreground dark:hover:text-white"
                                }`}
                        >
                            {filter.icon}
                            <span className="text-sm font-medium leading-normal">{filter.label}</span>
                        </button>
                    ))}
                </div>

                {/* Featured Project */}
                <FeaturedProjectCard />

                {/* Standard Project Grid */}
                <ProjectGrid />

                <div className="flex justify-center mt-[-1rem] mb-12">
                    <Link href="#" className="group flex items-center justify-center gap-2 rounded-lg px-8 py-3 bg-transparent border border-border/50 dark:border-[#282e39] hover:border-primary text-muted-foreground dark:text-[#9ca6ba] hover:text-primary transition-all font-bold">
                        View All Archive
                        <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
