"use client";

import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProjectGrid() {
    const projects = [
        {
            title: "E-commerce Microservices",
            description: "Scalable backend architecture using Node.js microservices. Handles high-concurrency order processing and inventory management with Redis caching.",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsUIpoUYBpyAwQZ5BsM-divell4sUGVK80O58swURaBRD91GY1ab7GXso_PzV67V1UB4FsCjbWGiUUJ8w6WI8NDVesxNC7QrEaUB4cgHy5dyH7jBDV3IhZtNSIGJ7E19ovbEKnVkdo_3tgxMGVL8YP7NsWhRKLXtCPVD7MAtG8c10g5Iux4mMB326oEpYcG95--YjVIyCjm8831ifBWoHKsXcQwgbRYDGbQwi08nbtsJ6M9GLgherTauYzAPjRCunfy1mDH53T2kJE",
            imageAlt: "E-commerce payment processing dashboard interface",
            technologies: ["Node.js", "Docker", "Kafka"]
        },
        {
            title: "Real-time Analytics",
            description: "A dashboard visualizing live data streams. Built with WebSocket for real-time updates and D3.js for interactive data visualization.",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDD0un3DZZZxVnD8ZbXy_q3Q9xKFARAmW_gyUSzS3FkQyMV2vguewoZgVe9uF4GCh9g0v_cHk9RnVckkv2ebHAJTY9_4EOsYDf7daY3iib2x1HQQcVREFZRk3fXpHw39kTsp8kO0cI3Nug8L7C2KixiYPN1rOO4AXnd6XPvhX13A-RdzUCOR6l1L_zGMuIeV8woEWDPHAatT3kRascQiP6i_J8cxowK92H18pLDFl4_BJrN-F_B1vcYTG-hWJOuU0o4gEige26akpE4",
            imageAlt: "Real-time data analytics chart on dark background",
            technologies: ["React", "D3.js", "WebSockets"]
        },
        {
            title: "Auth Service API",
            description: "Secure authentication and authorization service supporting OAuth2, JWT, and multi-factor authentication for enterprise applications.",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDylSv8BEWFRjeeeRVhKRHlsfa7r3JymiWkiveBmP2SKBJvrERO5o7keiphVLVONwpEBFJjy3Py_mnicDxBPo4vkxdiYRl_t4P2Y6y6sxHxNdNcYO0_lGiZmoL9po576OB5S1zG7-XmIiSKUQmwsfnbEU8asuXo_rwMmp45QaPOrVJE-q6KEUTjMyVa_94tOv5nu2cYbKrvilJIyyN3Hoy0degdz6BdlcJdvN0KG4F32Ah8d1-ITaBms0UKP-XdxtrbG1XgSeEWoMf3",
            imageAlt: "Code editor screen focusing on security algorithms",
            technologies: ["Go", "gRPC", "OAuth2"]
        }
    ];

    return (
        <>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.15 }
                    }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {projects.map((project, index) => (
                    <ProjectCard key={index} {...project} />
                ))}
            </motion.div>

            {/* Pagination Controls */}
            <div className="mt-12 mb-12 flex justify-center items-center gap-2">
                <button className="flex items-center justify-center size-10 rounded-lg bg-surface-dark dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] text-muted-foreground dark:text-[#9ca6ba] hover:bg-primary hover:text-white transition-all">
                    <ChevronLeft className="size-5" />
                </button>
                <button className="flex items-center justify-center size-10 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/25">
                    1
                </button>
                <button className="flex items-center justify-center size-10 rounded-lg bg-surface-dark dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] text-muted-foreground dark:text-[#9ca6ba] hover:bg-primary hover:text-white font-bold transition-all">
                    2
                </button>
                <button className="flex items-center justify-center size-10 rounded-lg bg-surface-dark dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] text-muted-foreground dark:text-[#9ca6ba] hover:bg-primary hover:text-white font-bold transition-all">
                    3
                </button>
                <span className="px-2 text-muted-foreground dark:text-[#9ca6ba]">...</span>
                <button className="flex items-center justify-center size-10 rounded-lg bg-surface-dark dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] text-muted-foreground dark:text-[#9ca6ba] hover:bg-primary hover:text-white font-bold transition-all">
                    12
                </button>
                <button className="flex items-center justify-center size-10 rounded-lg bg-surface-dark dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] text-muted-foreground dark:text-[#9ca6ba] hover:bg-primary hover:text-white transition-all">
                    <ChevronRight className="size-5" />
                </button>
            </div>
        </>
    );
}
