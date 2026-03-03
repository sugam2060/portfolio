"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, TerminalSquare } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface HeroSectionProps {
    heading?: string;
    subHeading?: string;
    imgTextHeading?: string;
    imgTextSubHeading?: string;
    imageUrl?: string;
}

export default function HeroSection({
    heading = "I build intelligent AI and web applications",
    subHeading = "Hi, I'm Sugam. An AI & Software Engineer turning complex problems into scalable solutions through modern frameworks and agentic systems.",
    imgTextHeading = "System Architecture",
    imgTextSubHeading = "Building scalable agentic workflows",
    imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBCSm8IgDDK9Ab7plJ4vjHPQX9APwWBTMMTyLc45zZESWiwLE1ukPHDOiw44xdsXZ3m2WzklM_SSCx87cZxgv-DFd7EafsoogVNp5MjCMuVDTYwVZoG2XkiZNB5HBWBQxn3O0SIGc-srieKLWYr7S3RcU_aic8F0bImCIe4imLvlCrFywmUDZG-8UemQmD8HyseSmG6wvZkddZaZRA3YQ8vIXS2LFY0aKeJmcbHuaZfrdABVSNvdqQfQQ05UKNahbVcgKnCxUkgDydk"
}: HeroSectionProps) {
    return (
        <section id="home" className="w-full relative px-6 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                <div className="@container">
                    <div className="flex flex-col gap-6 py-10 @[480px]:gap-8 @[864px]:flex-row-reverse items-center justify-between">

                        {/* Right Column: Visual Graphic */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0, y: [0, -10, 0] }}
                            transition={{
                                opacity: { duration: 0.7, ease: "easeOut", delay: 0.2 },
                                scale: { duration: 0.7, ease: "easeOut", delay: 0.2 },
                                x: { duration: 0.7, ease: "easeOut", delay: 0.2 },
                                y: { duration: 5, ease: "easeInOut", repeat: Infinity, delay: 0.9 }
                            }}
                            className="w-full max-w-md bg-center bg-no-repeat aspect-square bg-cover rounded-2xl @[480px]:h-auto @[480px]:min-w-[320px] @[864px]:w-[45%] shadow-2xl shadow-primary/20 relative overflow-hidden group ml-auto border border-border/10"
                            style={{ backgroundImage: `url("${imageUrl}")` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 dark:from-[#111318]/80 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-[90%] p-4 bg-background/90 dark:bg-[#1b1f27]/90 backdrop-blur rounded-xl border border-border/50 dark:border-[#282e39]">
                                <div className="flex items-center gap-2 text-primary font-bold">
                                    <TerminalSquare className="size-4" />
                                    <span className="text-xs uppercase tracking-wider">{imgTextHeading}</span>
                                </div>
                                <p className="text-foreground text-sm mt-1">{imgTextSubHeading}</p>
                            </div>
                        </motion.div>

                        {/* Left Column: Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:w-1/2 justify-center"
                        >
                            <div className="flex flex-col gap-4 text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/30 dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] w-fit">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span className="text-xs font-medium text-muted-foreground dark:text-[#9ca6ba] uppercase tracking-wide">Available for work</span>
                                </div>
                                <h1 className="text-foreground dark:text-white text-4xl font-black leading-[1.1] tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black">
                                    {heading}
                                </h1>
                                <h2 className="text-muted-foreground dark:text-[#9ca6ba] text-lg font-normal leading-relaxed">
                                    {subHeading}
                                </h2>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Button asChild size="lg" className="flex min-w-[84px] items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary hover:bg-blue-600 transition-all text-white text-base font-bold shadow-lg shadow-primary/25">
                                    <Link href="/projects">
                                        View Projects
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="flex min-w-[84px] items-center justify-center gap-2 rounded-lg h-12 px-6 bg-surface-dark border border-border-dark dark:bg-[#1b1f27] dark:border-[#282e39] dark:hover:bg-[#282e39] transition-all text-foreground dark:text-white text-base font-bold">
                                    <Link href="/contact">
                                        <TerminalSquare className="size-4" />
                                        Contact Me
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}
