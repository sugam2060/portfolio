"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

export default function Searchbar() {
    return (
        <div className="max-w-3xl mx-auto w-full mb-12">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="size-5 text-muted-foreground dark:text-[#9ca6ba] group-focus-within:text-primary transition-colors" />
                </div>

                <Input
                    type="text"
                    placeholder="Search for articles, topics, or tech..."
                    className="block w-full pl-12 pr-32 py-7 bg-surface-dark dark:bg-[#1b1f27] border-border/50 dark:border-[#282e39] rounded-2xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#9ca6ba] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 transition-all outline-none shadow-xl text-base"
                />

                <div className="absolute inset-y-2 right-2 flex items-center">
                    <button className="px-6 h-full bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        Search
                    </button>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 items-center justify-center text-xs text-muted-foreground dark:text-[#9ca6ba]">
                <span>Popular:</span>
                <Link href="#" className="hover:text-primary transition-colors">#AI</Link>
                <span className="size-1 rounded-full bg-border/50 dark:bg-[#282e39]"></span>
                <Link href="#" className="hover:text-primary transition-colors">#AgenticSystems</Link>
                <span className="size-1 rounded-full bg-border/50 dark:bg-[#282e39]"></span>
                <Link href="#" className="hover:text-primary transition-colors">#WebDev</Link>
                <span className="size-1 rounded-full bg-border/50 dark:bg-[#282e39]"></span>
                <Link href="#" className="hover:text-primary transition-colors">#Infrastructure</Link>
            </div>
        </div>
    );
}
