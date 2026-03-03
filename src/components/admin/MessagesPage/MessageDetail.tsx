"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessageById, deleteMessage } from "@/actions/MessageActions";
import { Mail, Trash2, Clock, AtSign, ChevronLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

export default function MessageDetail({ id }: { id: number }) {
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data: message, isLoading, error } = useQuery({
        queryKey: ["admin-message", id],
        queryFn: () => getMessageById(id),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteMessage(id),
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Message permanently deleted");
                queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
                router.push("/admin/messages");
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

    if (error || !message) return (
        <div className="bg-surface-dark dark:bg-[#11141a] p-16 rounded-3xl border border-border/50 text-center">
            <AlertCircle className="size-12 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-bold mb-2">Message Not Found</h2>
            <p className="text-muted-foreground mb-6">The message you are looking for doesn&apos;t exist or has been deleted.</p>
            <Link href="/admin/messages">
                <Button variant="outline">
                    <ChevronLeft className="mr-2 size-4" /> Back to Inbox
                </Button>
            </Link>
        </div>
    );

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            <Link href="/admin/messages" className="inline-flex items-center gap-2 group text-muted-foreground hover:text-primary transition-colors text-xs font-black uppercase tracking-widest">
                <div className="size-7 rounded-lg bg-surface flex items-center justify-center border border-border/50 group-hover:border-primary/50 group-hover:bg-primary/5">
                    <ChevronLeft className="size-4" />
                </div>
                Back to Inbox
            </Link>

            <div className="bg-surface-dark dark:bg-[#11141a] rounded-3xl border border-border/50 shadow-2xl overflow-hidden">
                <div className="bg-muted/10 p-8 border-b border-border/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="size-16 rounded-2xl bg-primary flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-primary/20">
                                {message.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-black uppercase tracking-tight text-foreground dark:text-white leading-tight">
                                    {message.name}
                                </h1>
                                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mt-1">
                                    <AtSign className="size-3" />
                                    {message.email}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col md:items-end gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            {!message.isRead && (
                                <Badge className="bg-primary hover:bg-primary text-[10px] h-6 px-3 ml-auto">UNREAD MESSAGE</Badge>
                            )}
                            <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-full border border-border/50">
                                <Clock className="size-3 text-primary" />
                                {message.createdAt ? new Date(message.createdAt).toLocaleString('en-US', { month: 'long', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12 space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground dark:text-white border-l-4 border-primary pl-4">
                            {message.subject}
                        </h2>
                    </div>

                    <div className="bg-muted/20 dark:bg-[#151921] p-8 md:p-10 rounded-2xl border border-border/50 min-h-[250px] relative">
                        <div className="absolute top-4 right-4 text-primary/10 select-none">
                            <Mail size={80} />
                        </div>
                        <p className="text-base text-foreground dark:text-slate-300 leading-relaxed whitespace-pre-wrap relative z-10 font-medium italic">
                            &quot;{message.message}&quot;
                        </p>
                    </div>

                    <div className="flex justify-between items-center pt-8 border-t border-border/10">
                        <a href={`mailto:${message.email}?subject=Re: ${message.subject}`} className="flex-1 max-w-xs">
                            <Button className="w-full h-12 text-xs font-black uppercase tracking-widest gap-2 shadow-xl shadow-primary/20">
                                <Mail className="size-4" /> Reply via Email
                            </Button>
                        </a>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 font-bold uppercase tracking-widest text-[10px] gap-2 py-6 px-6"
                            onClick={() => {
                                if (confirm("Permanently delete this message?")) {
                                    deleteMutation.mutate(message.id);
                                }
                            }}
                        >
                            <Trash2 className="size-4" /> Delete Permanently
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
