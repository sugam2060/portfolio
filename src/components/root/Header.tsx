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
            </div>
        </header>
    );
}

