"use client";

import { Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactHeroSection() {
    return (
        <div className="lg:col-span-4 flex flex-col gap-8">

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-start gap-4"
            >
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                    <Mail className="size-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground dark:text-slate-400">Email me at</p>
                    <p className="font-medium text-foreground dark:text-white">hello@sugam.dev</p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-start gap-4"
            >
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                    <MapPin className="size-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground dark:text-slate-400">Location</p>
                    <p className="font-medium text-foreground dark:text-white">Kathmandu, Nepal</p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-4 p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/50 border border-border/50 dark:border-slate-800"
            >
                <h3 className="font-bold mb-2 text-foreground dark:text-white">Availability</h3>
                <p className="text-sm text-muted-foreground dark:text-slate-400 leading-relaxed">
                    I&apos;m currently available for freelance work and full-time positions. Typical response time: <span className="text-primary font-medium">Within 24 hours</span>.
                </p>
            </motion.div>

        </div>
    );
}
