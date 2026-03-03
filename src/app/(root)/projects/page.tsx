import FeaturedProjectCard from "@/components/root/Projectpage/FeaturedProjectCard";
import ProjectGrid from "@/components/root/Projectpage/ProjectGrid";
import { Sparkles, Bot, ServerCog, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getProjects, getFeaturedProjects } from "@/actions/ProjectActions";
import { Suspense } from "react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export const dynamic = "force-dynamic";

interface SearchParams {
    page?: string;
    type?: string;
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams;
    const currentPage = parseInt(params.page || "1", 10);
    const currentType = params.type || "All";
    const limit = 6;

    const queryClient = new QueryClient();

    // Prefetch projects with type filter
    await queryClient.prefetchQuery({
        queryKey: ["projects", currentPage, limit, currentType],
        queryFn: () => getProjects(currentPage, limit, currentType),
    });

    const featuredData = await getFeaturedProjects();
    const featuredResults = Array.isArray(featuredData) ? featuredData : [];
    const featuredProject = featuredResults[0]?.project;

    const filters = [
        { label: "All", icon: <Sparkles className="size-4" />, active: currentType === "All" },
        { label: "AI/ML", icon: <Bot className="size-4" />, active: currentType === "AI/ML" },
        { label: "Backend", icon: <ServerCog className="size-4" />, active: currentType === "Backend" },
        { label: "Web Dev", icon: <Globe className="size-4" />, active: currentType === "Web Dev" },
    ];

    return (
        <main className="flex flex-1 justify-center py-10 px-4 md:px-10 lg:px-40">
            <div className="layout-content-container flex flex-col w-full max-w-[1200px] flex-1">

                <div className="flex flex-col items-center text-center pb-10 pt-6">
                    <h1 className="text-foreground dark:text-white tracking-tight text-4xl md:text-5xl font-bold leading-tight mb-4 uppercase font-black">
                        Project <span className="text-primary italic">Showcase</span>
                    </h1>
                    <p className="text-muted-foreground dark:text-[#9ca6ba] max-w-2xl text-lg font-medium">
                        Exploring the intersection of AI, robust backends, and intuitive frontends.
                        Engineered with precision, delivered with passion.
                    </p>
                </div>

                <div className="flex gap-3 pb-12 flex-wrap justify-center">
                    {filters.map((filter, index) => (
                        <Link
                            key={index}
                            href={`?type=${filter.label}`}
                            scroll={false}
                            className={`group flex h-10 items-center justify-center gap-x-2 rounded-full px-6 transition-all border ${filter.active
                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                : "bg-surface-dark dark:bg-[#1b1f27] border-border/50 dark:border-[#282e39] text-muted-foreground dark:text-[#9ca6ba] hover:border-primary/50 hover:text-primary"
                                }`}
                        >
                            {filter.icon}
                            <span className="text-xs font-black uppercase tracking-widest">{filter.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Featured Project - Only shown on 'All' or if relevant to filter (keeping it simple for now) */}
                {featuredProject && (currentType === "All" || featuredProject.type === currentType) && (
                    <FeaturedProjectCard project={featuredProject} />
                )}

                {/* Hydrated Project Grid */}
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <Suspense fallback={
                        <div className="h-40 flex flex-col items-center justify-center gap-3">
                            <Bot className="size-8 animate-bounce text-primary/40" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Initializing Grid...</p>
                        </div>
                    }>
                        <ProjectGrid />
                    </Suspense>
                </HydrationBoundary>

                <div className="flex justify-center mt-8 mb-12">
                    <Link href="#" className="group flex items-center justify-center gap-2 rounded-xl px-10 py-4 bg-transparent border-2 border-border/50 dark:border-[#282e39] hover:border-primary text-muted-foreground dark:text-[#9ca6ba] hover:text-primary transition-all font-black uppercase tracking-widest text-sm shadow-sm hover:shadow-xl hover:shadow-primary/5">
                        Archive
                        <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
