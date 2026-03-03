"use client";

import Link from "next/link";
import { Bot } from "lucide-react";

export default function Header() {
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

            <div className="flex flex-1 justify-end gap-8">
                <div className="hidden md:flex items-center gap-9">
                    <Link className="text-muted-foreground dark:text-[#9ca6ba] hover:text-foreground dark:hover:text-white transition-colors text-sm font-medium leading-normal" href="/">Home</Link>
                    <Link className="text-muted-foreground dark:text-[#9ca6ba] hover:text-foreground dark:hover:text-white transition-colors text-sm font-medium leading-normal" href="/projects">Projects</Link>
                    <Link className="text-muted-foreground dark:text-[#9ca6ba] hover:text-foreground dark:hover:text-white transition-colors text-sm font-medium leading-normal" href="/blogs">Blog</Link>
                    <Link className="text-muted-foreground dark:text-[#9ca6ba] hover:text-foreground dark:hover:text-white transition-colors text-sm font-medium leading-normal" href="/experience">Experience</Link>
                </div>
                <Link href="/contact">
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]">
                        <span className="truncate">Hire Me</span>
                    </button>
                </Link>
            </div>
        </header>
    );
}
