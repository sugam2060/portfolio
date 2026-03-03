import { Bot } from "lucide-react";
import Link from "next/link";
import { RiAdminLine } from "react-icons/ri";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border/50 dark:border-[#282e39] bg-surface-dark/50 dark:bg-[#1b1f27]/50 backdrop-blur-sm pt-12 pb-8">
            <div className="layout-content-container flex flex-col max-w-[960px] mx-auto px-6 md:px-10 lg:px-40">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">

                    {/* Left: Branding & Blurb */}
                    <div className="flex flex-col gap-1 items-center md:items-start">
                        <Link href="/" className="flex items-center gap-2 text-foreground dark:text-white mb-2 hover:opacity-80 transition-opacity">
                            <Bot className="size-6 text-primary" />
                            <span className="font-bold text-lg tracking-tight">Sugam Pudasaini</span>
                        </Link>
                        <p className="text-muted-foreground dark:text-[#9ca6ba] text-sm max-w-xs text-center md:text-left">
                            Building intelligent systems and scalable software solutions.
                        </p>
                    </div>

                    {/* Right Socials & Contact */}
                    <div className="flex flex-col items-center md:items-end gap-4">
                        <div className="flex gap-4">
                            <a aria-label="GitHub" className="w-10 h-10 rounded-full border border-border/50 dark:border-[#282e39] bg-background dark:bg-[#111318] flex items-center justify-center text-muted-foreground dark:text-[#9ca6ba] hover:text-foreground dark:hover:text-white hover:border-primary hover:bg-primary/10 transition-all duration-300 group" href="https://github.com" target="_blank">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.28-1.56 3.285-1.23 3.285-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"></path>
                                </svg>
                            </a>
                            <a aria-label="LinkedIn" className="w-10 h-10 rounded-full border border-border/50 dark:border-[#282e39] bg-background dark:bg-[#111318] flex items-center justify-center text-muted-foreground dark:text-[#9ca6ba] hover:text-foreground dark:hover:text-white hover:border-primary hover:bg-primary/10 transition-all duration-300 group" href="https://linkedin.com" target="_blank">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9H12.909v1.632h.048c.495-.938 1.706-1.927 3.509-1.927 3.754 0 4.448 2.471 4.448 5.684v6.063zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                                </svg>
                            </a>
                            <a aria-label="X (Twitter)" className="w-10 h-10 rounded-full border border-border/50 dark:border-[#282e39] bg-background dark:bg-[#111318] flex items-center justify-center text-muted-foreground dark:text-[#9ca6ba] hover:text-foreground dark:hover:text-white hover:border-primary hover:bg-primary/10 transition-all duration-300 group" href="https://twitter.com" target="_blank">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path>
                                </svg>
                            </a>
                        </div>
                        <a className="flex items-center gap-2 text-muted-foreground dark:text-[#9ca6ba] hover:text-primary transition-colors text-sm font-medium" href="mailto:hello@sugam.com">
                            <span className="material-symbols-outlined text-lg">mail</span>
                            hello@sugam.com
                        </a>
                    </div>
                </div>

                {/* Bottom Bar Segment */}
                <div className="w-full h-px bg-border/50 dark:bg-[#282e39] my-4"></div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground dark:text-[#9ca6ba]">
                    <p>© {currentYear} Sugam Pudasaini. All rights reserved.</p>
                    <Link href="/login" className="hover:text-primary transition-colors opacity-50 hover:opacity-100">
                        <RiAdminLine className="size-4" />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
