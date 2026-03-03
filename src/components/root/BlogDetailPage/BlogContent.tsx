"use client";

import { motion } from "framer-motion";

interface BlogContentProps {
    content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
    return (
        <section className="py-12 md:py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="prose prose-lg dark:prose-invert prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none"
                >
                    <div className="whitespace-pre-wrap text-foreground/80 dark:text-gray-300 text-lg leading-relaxed font-medium">
                        {content}
                    </div>
                </motion.div>

                {/* Share Buttons / Footer can go here */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-20 pt-10 border-t border-border/10 flex items-center justify-between"
                >
                    <div className="text-xs text-muted-foreground font-black uppercase tracking-widest">
                        End of Article
                    </div>
                    <div className="flex gap-4">
                        {/* Static social links for now */}
                        <span className="text-[10px] font-black uppercase text-primary tracking-widest cursor-pointer hover:underline">Share on Twitter</span>
                        <span className="text-[10px] font-black uppercase text-primary tracking-widest cursor-pointer hover:underline">Share on LinkedIn</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
