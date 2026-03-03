"use client";

import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import { ChevronLeft, ChevronRight, Bot, Database, Code, Settings, Cpu, BrainCircuit } from "lucide-react";

export default function BlogGrid() {
    const blogs = [
        {
            title: "The Rise of Agentic Systems: Beyond LLM Chatbots",
            description: "How autonomous agents are shifting the paradigm from simple query-response to complex goal-oriented software workflows.",
            date: "Oct 12, 2023",
            readTime: "5 min read",
            category: "Agentic Systems",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBahqgK8rtLFCRa77qgQLwIZA1MSlgWGsg0PThJKU8w12XTzyoa7EaMVmQr1PlL23h_6PpVe-eqKrgvhnudFpwsH79EtR4zBhcTwkvetgsdjQzwZ6zRsJbG9SXaGPZBdjsCUkifn4XO2DNQYn_xK7Z_aWGB00t8YROICRLihCP8vJICUqRmQDDyEKuBr7dlzGAc3rEfqgAj0TiKr4vDELTcmS0HTV3M_rCxOqvL3bLDZkZ03reqJwuTzKiStFpUz7zJoJexGy2ESuxa",
            imageAlt: "Futuristic glowing AI brain network visualization",
            icon: <Bot className="text-5xl text-primary/20" />
        },
        {
            title: "Scaling Large Language Models for Production",
            description: "A deep dive into the specialized infrastructure and orchestration required to serve next-gen AI at scale.",
            date: "Oct 05, 2023",
            readTime: "8 min read",
            category: "Infrastructure",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAisXP6VPqgri5tXfVouuvROJcXZyD_LvkgbNQFpKLMTRw2IyMU-p6jXmsk4ZFop8Bj8FoKH-ZcDdif7pFuYK_z3IPx06ecbCLjZbapxYP4vKtaz9TYgRJUg9T07HxjaIZopyHvnbXP96ASl6rqkYdkL_MINc-H5RxypcU2ZMQplZ4C-Ldm0CV6lbGqjt1HM7cCz_wb1KsB37yGUYwAZ50HPQxWbg8X_cIaf4wmWSPQOLQ8ZQczXx7zjpn87PDW7pJNO1nlurxATNwg",
            imageAlt: "Data center server racks with orange lighting",
            icon: <Database className="text-5xl text-primary/20" />
        },
        {
            title: "React & Generative AI: The New Frontend",
            description: "Exploring how streaming UI components and LLM integration are redefining the user experience.",
            date: "Sep 28, 2023",
            readTime: "4 min read",
            category: "Web Dev",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUDxiQFW9IR-3Thv7qXQ_Qm07EFKgQxxsHD_zbqul0q_yXfKXFWWE-kQyKgYlNhRAsXKopIRWwmlemjbF8u0_F-JI_kIlR0gGM0ndAY7txDFQXUrgdNyjYmK1G-UoNu24Gl7UO5qehhoaH3i_aQn-ZkRQ4obRGGo6tNPPwkUt8YR0UUjfrt1StF4TkB-y456INExx-sddNEVyVaPVdXfTMXM1dhIHrmVNzzVxAt77wg49g4r9D-KRT9TUbucOGYUwHKiFEwzafeAz1",
            imageAlt: "React logo displayed on a digital screen",
            icon: <Code className="text-5xl text-primary/20" />
        },
        {
            title: "Building Robust AI Pipelines: MLOps in 2024",
            description: "Moving from prototypes to production with automated testing, versioning, and monitoring for ML models.",
            date: "Sep 15, 2023",
            readTime: "10 min read",
            category: "Artificial Intelligence",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAL-X39A2bdVBbhox0fAvakiNi2MWIiisABN3CRfXGwgfJR2vnrq0kwNahowpoYEGWFJDCX9-2fJD-NfoOdEYdCA8JcH6CF9KIpepAqUm0KErgQ6AVa7P5OIvY9bxhhqfhVFUqHzNgEImaLS6VE-3yaxObFlRF4ztpjTdO7e7FyonzZOr8ohbjXBoR1FN5diKp701axNwpMXJguU9rmseMejAnHQM7lTVCLtcpikkGTL89RFbk3ZYTWB7UvsBh18r1KBhJCmJdDXDLl",
            imageAlt: "Cybersecurity concept digital circuit board pattern",
            icon: <Settings className="text-5xl text-primary/20" />
        },
        {
            title: "Edge Computing: Bringing AI Closer to the User",
            description: "Reducing latency and cost by running smaller, optimized models directly in the browser or on local hardware.",
            date: "Sep 02, 2023",
            readTime: "6 min read",
            category: "Infrastructure",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBltjZg-rz2ZPKvhLhEYx73dNAOsrspmf_jboX7jH_Jp_3iMcXLHakP1X8cHaxbB5lkTGuy8urbbtRpskrbU9fZw7ahiFGrn3J3hqkTN0r0UZ06xq2_kqd2LgnXua1d_l75V প্রচ",
            imageAlt: "Macro photo of hardware circuit board",
            icon: <Cpu className="text-5xl text-primary/20" />
        },
        {
            title: "The Ethics of Autonomous Software Agents",
            description: "Discussing accountability, safety measures, and transparency in systems that act on behalf of humans.",
            date: "Aug 24, 2023",
            readTime: "12 min read",
            category: "Agentic Systems",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCLGOzpRcScyAv-JmBWXxOsVggBvfDx7ljjFzQxxB8_3Fok1EZRsMECaJ_WK6JSmFGnIn8Ic3eD4Wbv1Q-aLjtUfxGgGY_ugitHYb8LE5vCuIOrzgF6bjoZbsaC4Qrc1tAn2Tf6lVrOAkGdUokk-3Gl4kADanDJ1Ixls-ywlfjBeoWbX-88obhVQYp88LWWEL5RL285LNpnN1KIpEz_YiijpVfyIYLpbDLJ2x5PxFw96loUkox3kcK2csx0mKEQGnCh_lsJr_yHqeR",
            imageAlt: "Abstract white robotic head sculpture profile",
            icon: <BrainCircuit className="text-5xl text-primary/20" />
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {blogs.map((blog, index) => (
                    <BlogCard key={index} {...blog} />
                ))}
            </motion.div>

            {/* Pagination Controls */}
            <div className="mt-16 mb-12 flex justify-center items-center gap-2">
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
