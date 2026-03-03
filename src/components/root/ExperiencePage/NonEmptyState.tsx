"use client";

import { Building2 } from "lucide-react";

export default function NonEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <div className="relative w-full bg-surface-dark dark:bg-[#1a212e] rounded-xl border border-border/50 dark:border-[#282e39] overflow-hidden flex flex-col gap-6 p-8">
                <div className="flex items-center gap-4 border-b border-border/50 dark:border-[#282e39] pb-6">
                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Building2 className="size-6" />
                    </div>
                    <div>
                        <h3 className="text-foreground dark:text-white text-xl font-bold">Future Company Inc.</h3>
                        <p className="text-muted-foreground dark:text-[#9ca6ba] text-sm">Software Engineer</p>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-muted-foreground dark:text-[#9ca6ba] text-sm">Present</p>
                        <p className="text-xs text-muted-foreground dark:text-[#9ca6ba]/70">Remote</p>
                    </div>
                </div>

                <ul className="list-disc list-inside space-y-2 text-muted-foreground dark:text-[#9ca6ba] text-sm">
                    <li>Led development of core features using next-gen AI stacks.</li>
                    <li>Designed resilient microservice architectures for heavy workloads.</li>
                    <li>Optimized frontend performance yielding a 40% speedup in load times.</li>
                </ul>

                <div className="flex flex-wrap gap-2 pt-4">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">React</span>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Node.js</span>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Python</span>
                </div>
            </div>
        </div>
    );
}
