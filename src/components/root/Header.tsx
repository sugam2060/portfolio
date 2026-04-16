"use client";

import Link from "next/link";
import { Bot } from "lucide-react";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Projects", href: "/projects" },
        { name: "Blog", href: "/blogs" },
        { name: "Experience", href: "/experience" },
    ];

    const menuVariants: Variants = {
        closed: {
            x: "100%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        },
        open: {
            x: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const linkVariants: Variants = {
        closed: { opacity: 0, x: 20 },
        open: { opacity: 1, x: 0 }
    };

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-border/50 dark:border-[#282e39] bg-background/80 dark:bg-[#111318]/80 backdrop-blur-md px-6 py-4 md:px-10 lg:px-40">
            <div className="flex items-center gap-4 text-foreground dark:text-white">
                <Link href="/" className="flex items-center gap-2">
                    <div className="size-8 text-primary flex items-center justify-center">
                        <Bot className="size-8" />
                    </div>
                    <h2 className="text-foreground dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Sugam Pudasaini</h2>
                </Link>
            </div>

            <div className="flex flex-1 justify-end items-center gap-4 md:gap-8">
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-9">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name}
                            className="text-muted-foreground dark:text-[#9ca6ba] hover:text-foreground dark:hover:text-white transition-colors text-sm font-medium leading-normal" 
                            href={link.href}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/contact" className="hidden sm:block">
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]">
                            <span className="truncate">Hire Me</span>
                        </button>
                    </Link>

                    {/* Mobile Menu Toggle Button */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-foreground dark:text-white focus:outline-none z-[60]"
                        aria-label="Toggle menu"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isMenuOpen ? "close" : "open"}
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
                            </motion.div>
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        />
                        
                        {/* Menu Panel */}
                        <motion.div
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-[#0a0a0a] z-50 md:hidden border-l border-border/50 dark:border-[#282e39] shadow-2xl flex flex-col pt-24 px-6"
                        >
                            <nav className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <motion.div key={link.name} variants={linkVariants}>
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-xl font-semibold text-white hover:text-primary hover:bg-white/5 transition-all block py-4 px-6 rounded-xl border border-white/5 hover:border-primary/20 bg-zinc-900/50"
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                ))}
                                
                                <motion.div variants={linkVariants} className="pt-8 border-t border-border/50 dark:border-[#282e39]">
                                    <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                                        <button className="w-full flex items-center justify-center rounded-xl h-14 bg-primary hover:bg-blue-600 transition-colors text-white text-lg font-bold shadow-lg shadow-primary/20">
                                            Hire Me
                                        </button>
                                    </Link>
                                </motion.div>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}

