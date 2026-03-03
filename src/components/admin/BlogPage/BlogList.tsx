"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBlogs, deleteBlog } from "@/actions/BlogActions";
import { Button } from "@/components/ui/button";
import { LuPlus, LuTrash2, LuExternalLink, LuClock, LuPencil } from "react-icons/lu";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

export default function BlogList() {
    const [page, setPage] = useState(1);
    const limit = 10;
    const queryClient = useQueryClient();

    const { data: response, isLoading } = useQuery({
        queryKey: ["admin-blogs", page],
        queryFn: () => getBlogs(page, limit),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteBlog(id),
        onSuccess: (res) => {
            if (res.success) {
                toast.success(res.success);
                queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
            } else {
                toast.error(res.error);
            }
        },
    });

    if (isLoading) return (
        <div className="flex justify-center py-10">
            <Spinner className="size-8" />
        </div>
    );

    const blogs = response?.data || [];
    const pagination = response?.pagination;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold uppercase tracking-tight">Blog Archive</h2>
                <Link href="/admin/blogs/new">
                    <Button className="font-black uppercase tracking-widest text-[10px] gap-2">
                        <LuPlus className="size-3" />
                        Compose New
                    </Button>
                </Link>
            </div>

            <div className="bg-surface-dark dark:bg-[#11141a] rounded-2xl border border-border/50 dark:border-[#282e39] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/50 dark:border-[#282e39] bg-muted/30">
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Article</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Stats</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {blogs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-muted-foreground italic text-sm">
                                        No articles found. Start publishing!
                                    </td>
                                </tr>
                            ) : (
                                blogs.map((blog: any) => (
                                    <tr key={blog.id} className="hover:bg-muted/10 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative size-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                                    {blog.imageUrl ? (
                                                        <Image src={blog.imageUrl} alt={blog.title} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center font-black text-[8px] text-muted-foreground">NO IMG</div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-xs uppercase truncate max-w-[200px]">{blog.title}</p>
                                                    <p className="text-[10px] text-muted-foreground">{new Date(blog.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[10px] font-black uppercase tracking-tighter bg-primary/10 text-primary px-2 py-0.5 rounded">
                                                {blog.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                                                <LuClock className="size-3" />
                                                {blog.readTime}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/blogs/${blog.id}`} target="_blank">
                                                    <Button variant="ghost" size="icon" className="size-8" title="View Article">
                                                        <LuExternalLink className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/blogs/${blog.id}`}>
                                                    <Button variant="ghost" size="icon" className="size-8" title="Edit Article">
                                                        <LuPencil className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 text-destructive hover:bg-destructive/10"
                                                    onClick={() => {
                                                        if (confirm("Permanently delete this article?")) {
                                                            deleteMutation.mutate(blog.id);
                                                        }
                                                    }}
                                                >
                                                    <LuTrash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination && pagination.totalPages > 1 && (
                    <div className="p-4 border-t border-border/10 flex justify-between items-center bg-muted/5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            Page {page} of {pagination.totalPages}
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="h-8 text-[10px] font-black uppercase tracking-widest"
                            >
                                Prev
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === pagination.totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="h-8 text-[10px] font-black uppercase tracking-widest"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
