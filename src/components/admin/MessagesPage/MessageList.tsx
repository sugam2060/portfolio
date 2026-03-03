"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessages, deleteMessage } from "@/actions/MessageActions";
import { LuMail } from "react-icons/lu";
import { Clock, Trash2, Eye } from "lucide-react";
import { Message } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export default function MessageList() {
    const queryClient = useQueryClient();

    const { data: messages = [], isLoading } = useQuery({
        queryKey: ["admin-messages"],
        queryFn: () => getMessages(),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteMessage(id),
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Message deleted");
                queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
            } else {
                toast.error(res.error);
            }
        },
    });

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <Spinner className="size-8" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-surface-dark dark:bg-[#11141a] p-4 rounded-xl border border-border/50">
                <div className="flex items-center gap-2">
                    <LuMail className="text-primary size-5" />
                    <h2 className="font-black text-sm uppercase tracking-widest text-foreground dark:text-white">
                        Inbox <span className="text-muted-foreground ml-2 font-medium">({messages.length})</span>
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {messages.length === 0 ? (
                    <div className="bg-surface-dark dark:bg-[#11141a] p-16 rounded-3xl border border-dashed border-border/50 text-center">
                        <LuMail className="size-12 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground font-medium">Your inbox is empty. No messages yet!</p>
                    </div>
                ) : (
                    messages.map((msg: Message) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "group relative overflow-hidden bg-surface-dark dark:bg-[#11141a] p-6 rounded-2xl border transition-all duration-300",
                                msg.isRead
                                    ? "border-border/50 dark:border-[#282e39] opacity-80"
                                    : "border-primary/30 dark:border-primary/20 shadow-lg shadow-primary/5 bg-gradient-to-br from-primary/5 to-transparent"
                            )}
                        >
                            {!msg.isRead && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                            )}

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={cn(
                                            "size-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0",
                                            msg.isRead ? "bg-muted text-muted-foreground" : "bg-primary text-white shadow-lg shadow-primary/20"
                                        )}>
                                            {msg.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-black text-sm uppercase truncate text-foreground dark:text-white leading-tight">
                                                    {msg.name}
                                                </h3>
                                                {!msg.isRead && (
                                                    <Badge className="bg-primary hover:bg-primary text-[8px] h-4 font-black uppercase tracking-widest">New</Badge>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider truncate">
                                                {msg.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h4 className="font-bold text-sm text-foreground dark:text-white line-clamp-1">
                                            {msg.subject}
                                        </h4>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {msg.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:items-end justify-between gap-4 md:min-w-[140px]">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">
                                        <Clock className="size-3" />
                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit' }) : 'N/A'}
                                    </div>

                                    <div className="flex gap-2">
                                        <Link href={`/admin/messages/${msg.id}`}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-[9px] font-black uppercase tracking-widest gap-1.5 px-3 bg-white dark:bg-[#1a1f26] border-border/50"
                                            >
                                                <Eye className="size-3 text-primary" />
                                                Read
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
                                            onClick={() => {
                                                if (confirm("Permanently delete this message?")) {
                                                    deleteMutation.mutate(msg.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="size-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
