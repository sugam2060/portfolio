"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const POPULAR_TAGS = ["#AI", "#AgenticSystems", "#WebDev", "#Infrastructure"];

export default function Searchbar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");

    // Sync state with URL params
    useEffect(() => {
        setSearchTerm(searchParams.get("query") || "");
    }, [searchParams]);

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        params.delete("page"); // Reset to page 1 on search
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="max-w-3xl mx-auto w-full mb-12">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch(searchTerm);
                }}
                className="relative group"
            >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="size-5 text-muted-foreground dark:text-[#9ca6ba] group-focus-within:text-primary transition-colors" />
                </div>

                <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for articles, topics, or tech..."
                    className="block w-full pl-12 pr-32 py-7 bg-surface-dark dark:bg-[#1b1f27] border-border/50 dark:border-[#282e39] rounded-2xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#9ca6ba] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 transition-all outline-none shadow-xl text-base"
                />

                <div className="absolute inset-y-2 right-2 flex items-center">
                    <button
                        type="submit"
                        className="px-6 h-full bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                        Search
                    </button>
                </div>
            </form>

            <div className="mt-4 flex flex-wrap gap-2 items-center justify-center text-[10px] font-black uppercase tracking-widest text-muted-foreground dark:text-[#9ca6ba]">
                <span>Popular:</span>
                {POPULAR_TAGS.map((tag, idx) => (
                    <button
                        key={tag}
                        onClick={() => handleSearch(tag.replace('#', ''))}
                        className="hover:text-primary transition-colors hover:underline"
                    >
                        {tag}
                        {idx < POPULAR_TAGS.length - 1 && (
                            <span className="ml-2 inline-block size-1 rounded-full bg-border/50 dark:bg-[#282e39] align-middle"></span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
