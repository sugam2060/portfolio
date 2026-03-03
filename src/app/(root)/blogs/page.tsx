import Searchbar from "@/components/root/BlogPage/Searchbar";
import BlogGrid from "@/components/root/BlogPage/BlogGrid";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function BlogPage() {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* Hero Section */}
            <div className="mb-12">
                <h1 className="text-foreground dark:text-white tracking-tight text-4xl md:text-5xl font-black leading-[1.1] mb-4">
                    Insights
                </h1>
                <p className="text-muted-foreground dark:text-[#9ca6ba] text-lg font-normal leading-relaxed max-w-2xl">
                    Thoughts on AI, Software Engineering, and the future of tech. Deep dives into autonomous agents and scalable systems.
                </p>
            </div>

            {/* Search and Filters */}
            <Searchbar />

            {/* Blog Grid */}
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-20">
                    <Spinner className="size-12 text-primary" />
                    <p className="mt-4 text-muted-foreground animate-pulse font-black uppercase tracking-widest text-xs">Loading context...</p>
                </div>
            }>
                <BlogGrid />
            </Suspense>

        </main>
    );
}
