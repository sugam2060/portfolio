import { Bot } from "lucide-react";
import Link from "next/link";

export default function AdminFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border/50 dark:border-[#282e39] bg-background dark:bg-[#0a0c10] py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-6 md:px-10 lg:px-40">
                <div className="flex items-center gap-2 opacity-50">
                    <Bot className="size-5 text-primary" />
                    <span className="font-bold text-sm tracking-tight text-foreground dark:text-white uppercase">
                        Admin System <span className="text-primary">v1.0</span>
                    </span>
                </div>

                <div className="flex items-center gap-8 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                    <Link href="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
                    <Link href="/admin/settings" className="hover:text-primary transition-colors">Settings</Link>
                    <Link href="/admin/security" className="hover:text-primary transition-colors">Security</Link>
                </div>

                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                    © {currentYear} Sugam Pudasaini • Internal Use Only
                </p>
            </div>
        </footer>
    );
}
