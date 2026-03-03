"use client";

import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "@/actions/BlogActions";
import { Spinner } from "@/components/ui/spinner";
import { useSearchParams, useRouter } from "next/navigation";

export default function BlogGrid() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 6;

    const { data: response, isLoading, isPlaceholderData } = useQuery({
        queryKey: ["blogs", page, limit],
        queryFn: () => getBlogs(page, limit),
        placeholderData: (previousData) => previousData,
    });

    const blogs = response?.data || [];
    const pagination = response?.pagination || { total: 0, page: 1, limit: 6, totalPages: 0 };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`, { scroll: false });
    };

    if (isLoading && !blogs.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Spinner className="size-12 text-primary" />
                <p className="mt-4 text-muted-foreground animate-pulse font-black uppercase tracking-widest text-xs">Fetching insights...</p>
            </div>
        );
    }

    if (!isLoading && blogs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-muted-foreground text-lg italic">The archive is currently quiet. Check back soon.</p>
            </div>
        );
    }

    return (
        <div className={isPlaceholderData ? "opacity-50 transition-opacity" : "transition-opacity"}>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 }
                    }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {blogs.map((blog: any) => (
                    <BlogCard
                        key={blog.id}
                        id={blog.id}
                        title={blog.title}
                        description={blog.description}
                        type={blog.type}
                        readTime={blog.readTime}
                        imageUrl={blog.imageUrl}
                    />
                ))}
            </motion.div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <div className="mt-16 mb-12 flex justify-center items-center gap-3">
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="flex items-center justify-center size-12 rounded-xl bg-surface-dark dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] text-muted-foreground dark:text-[#9ca6ba] hover:bg-primary hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed group shadow-sm hover:shadow-primary/20"
                    >
                        <ChevronLeft className="size-5 transition-transform group-hover:-translate-x-0.5" />
                    </button>

                    <div className="flex gap-2">
                        {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                            let pageNum = i + 1;
                            if (pagination.totalPages > 5 && pagination.page > 3) {
                                pageNum = pagination.page - 3 + i + 1;
                                if (pageNum > pagination.totalPages) pageNum = pagination.totalPages - (4 - i);
                            }
                            if (pageNum <= 0) pageNum = i + 1;

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`flex items-center justify-center h-12 px-5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${pagination.page === pageNum
                                        ? "bg-primary text-white shadow-primary/30 border-primary"
                                        : "bg-surface-dark dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] text-muted-foreground dark:text-[#9ca6ba] hover:border-primary/50 hover:text-primary"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="flex items-center justify-center size-12 rounded-xl bg-surface-dark dark:bg-[#1b1f27] border border-border/50 dark:border-[#282e39] text-muted-foreground dark:text-[#9ca6ba] hover:bg-primary hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed group shadow-sm hover:shadow-primary/20"
                    >
                        <ChevronRight className="size-5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                </div>
            )}
        </div>
    );
}
