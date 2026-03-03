"use client";

import { User, MapPin, GraduationCap, Focus } from "lucide-react";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { motion, Variants } from "framer-motion";

export default function AboutSection() {
    // Animation variants for staggered bento cards
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <section id="about" className="w-full mt-12 mb-8">
            <div className="container mx-auto px-6 md:px-10 lg:px-40">

                {/* Section Header */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="h-px flex-1 bg-border/50 dark:bg-[#282e39]"></span>
                    <User className="size-5 text-primary" />
                    <h2 className="text-foreground dark:text-white text-2xl font-bold tracking-tight">About Me</h2>
                    <span className="h-px flex-1 bg-border/50 dark:bg-[#282e39]"></span>
                </div>

                {/* Main Content: Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start py-6 @container">

                    {/* Left Column: Bio */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-6"
                    >
                        <h3 className="text-foreground dark:text-white tracking-tight text-3xl font-bold leading-tight">
                            From Nepal to Global Tech
                        </h3>
                        <p className="text-muted-foreground dark:text-[#9ca6ba] text-lg leading-relaxed">
                            I am a passionate developer originally from Nepal, currently honing my craft at <span className="text-foreground dark:text-white font-medium">KIIT University</span>. My journey is defined by a relentless curiosity for AI agents, automation, and full-stack engineering. I don't just write code; I design systems that think.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4 mt-2">
                            <Link href="https://github.com" target="_blank" className="text-muted-foreground dark:text-[#9ca6ba] hover:text-primary transition-colors">
                                <FaGithub className="size-6" />
                            </Link>
                            <Link href="https://linkedin.com" target="_blank" className="text-muted-foreground dark:text-[#9ca6ba] hover:text-primary transition-colors">
                                <FaLinkedin className="size-6" />
                            </Link>
                            <Link href="mailto:hello@sugam.com" className="text-muted-foreground dark:text-[#9ca6ba] hover:text-primary transition-colors">
                                <FaEnvelope className="size-6" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Column: Bento Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                        {/* Education Card */}
                        <motion.div variants={itemVariants} className="group flex flex-col gap-3 rounded-xl border border-border/50 dark:border-[#282e39] bg-card dark:bg-[#1b1f27] p-5 hover:border-primary/50 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <GraduationCap className="size-6" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-foreground dark:text-white text-base font-bold leading-tight">Education</h2>
                                <p className="text-muted-foreground dark:text-[#9ca6ba] text-sm mt-1">KIIT University</p>
                            </div>
                        </motion.div>

                        {/* Background Card */}
                        <motion.div variants={itemVariants} className="group flex flex-col gap-3 rounded-xl border border-border/50 dark:border-[#282e39] bg-card dark:bg-[#1b1f27] p-5 hover:border-primary/50 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <MapPin className="size-6" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-foreground dark:text-white text-base font-bold leading-tight">Background</h2>
                                <p className="text-muted-foreground dark:text-[#9ca6ba] text-sm mt-1">Born in Nepal</p>
                            </div>
                        </motion.div>

                        {/* Focus Card (Full Width) */}
                        <motion.div variants={itemVariants} className="group flex flex-col gap-3 rounded-xl border border-border/50 dark:border-[#282e39] bg-card dark:bg-[#1b1f27] p-5 hover:border-primary/50 transition-colors sm:col-span-2">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <Focus className="size-6" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-foreground dark:text-white text-base font-bold leading-tight">Focus</h2>
                                <p className="text-muted-foreground dark:text-[#9ca6ba] text-sm mt-1">AI Agents, Automation & Scalable Systems</p>
                            </div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
