"use client";

import Link from "next/link";
import { Bot, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
    { name: "Home", href: "/admin" },
    { name: "Projects", href: "/admin/projects" },
    { name: "Blogs", href: "/admin/blogs" },
    { name: "Experience", href: "/admin/experience" },
    { name: "Messages", href: "/admin/messages" },
];

export default function AdminHeader() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-border/50 dark:border-[#282e39] bg-background/80 dark:bg-[#111318]/80 backdrop-blur-md px-6 py-4 md:px-10 lg:px-40">
            <div className="flex items-center gap-4 text-foreground dark:text-white">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="size-8 text-primary flex items-center justify-center">
                        <Bot className="size-8" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-foreground dark:text-white text-lg font-bold leading-tight tracking-tight">Admin Console</h2>
                        <span className="text-[10px] text-primary uppercase font-black tracking-widest leading-none">Command Center</span>
                    </div>
                </Link>
            </div>

            <nav className="hidden xl:flex items-center gap-8">
                {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-sm font-semibold transition-all hover:text-primary relative py-1",
                                isActive
                                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="flex items-center gap-4">
                <Link href="/">
                    <button className="hidden md:flex h-9 items-center justify-center rounded-lg px-4 border border-border hover:bg-muted transition-colors text-xs font-bold uppercase tracking-wider">
                        View Site
                    </button>
                </Link>
                <button className="flex size-9 items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors">
                    <LogOut className="size-4" />
                </button>
            </div>
        </header>
    );
}
