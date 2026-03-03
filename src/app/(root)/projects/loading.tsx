import { Spinner } from "@/components/ui/spinner";
import { Bot } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
            <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />

                <div className="relative flex flex-col items-center gap-6">
                    <div className="relative">
                        <Spinner className="size-20 text-primary" />
                        <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-center">
                            <Bot className="size-8 text-primary/40 animate-bounce" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-xl font-black uppercase tracking-[0.3em] text-foreground animate-pulse">
                            Loading <span className="text-primary italic">Archives</span>
                        </h2>
                        <div className="flex gap-1">
                            <div className="size-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="size-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="size-1.5 bg-primary/40 rounded-full animate-bounce" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
