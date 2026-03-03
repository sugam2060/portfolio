"use client";

import { motion } from "framer-motion";

export default function LoginHeroSection() {
    return (
        <div className="flex flex-col justify-center text-left max-w-lg">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl md:text-6xl font-black mb-6 tracking-tighter"
            >
                Welcome Back, <br />
                <span className="text-primary italic">Sugam.</span>
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed"
            >
                Access your dashboard to manage your portfolio, insights, and work experience.
                Your digital command center is ready.
            </motion.p>
        </div>
    );
}
