"use client";

import Link from "next/link";
import { Bot, LogOut, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useUserStore } from "@/store/userStore";
import { logoutUser } from "@/actions/LogoutUser";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
    { name: "Home", href: "/admin" },
    { name: "Projects", href: "/admin/projects" },
    { name: "Blogs", href: "/admin/blogs" },
    { name: "Experience", href: "/admin/experience" },
    { name: "Messages", href: "/admin/messages" },
];

export default function AdminHeader() {
    const pathname = usePathname();
    const { user, logout } = useUserStore();

    const handleLogout = async () => {
        try {
            await logoutUser();
            logout(); // Clear Zustand store
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

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
                <Link href="/" target="_blank">
                    <Button variant="outline" size="sm" className="hidden md:flex h-9 items-center justify-center px-4 transition-colors text-xs font-bold uppercase tracking-wider">
                        View Site
                    </Button>
                </Link>

                <Popover>
                    <PopoverTrigger asChild>
                        <Avatar className="cursor-pointer border border-border/50 hover:ring-2 hover:ring-primary/20 transition-all">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {user?.fullname?.charAt(0).toUpperCase() || <User className="size-4" />}
                            </AvatarFallback>
                        </Avatar>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2" align="end">
                        <div className="px-2 py-1.5 mb-2">
                            <p className="text-sm font-bold truncate">{user?.fullname}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        <div className="h-px bg-border/50 my-1" />
                        <Button
                            variant="destructive"
                            size="sm"
                            className="w-full justify-start gap-2 h-9"
                            onClick={handleLogout}
                        >
                            <LogOut className="size-4" />
                            Log Out
                        </Button>
                    </PopoverContent>
                </Popover>
            </div>
        </header>
    );
}
