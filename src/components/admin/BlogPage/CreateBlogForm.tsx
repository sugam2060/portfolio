"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogSchema, BlogInput } from "@/types/blogs";
import { createBlog } from "@/actions/BlogActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LuSave, LuX, LuImagePlus } from "react-icons/lu";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateBlogForm() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const form = useForm<BlogInput>({
        resolver: zodResolver(BlogSchema),
        defaultValues: {
            title: "",
            description: "",
            readTime: "",
            type: "",
            imageUrl: "",
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        }
    };

    const onSubmit = async (data: BlogInput) => {
        setIsPending(true);
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("readTime", data.readTime);
        formData.append("type", data.type);

        const imageInput = document.getElementById("blog-image") as HTMLInputElement;
        if (imageInput.files?.[0]) {
            formData.append("image", imageInput.files[0]);
        }

        try {
            const res = await createBlog(formData);
            if (res.success) {
                toast.success(res.success);
                router.push("/admin/blogs");
                router.refresh();
            } else {
                toast.error(typeof res.error === 'string' ? res.error : "Validation failed");
            }
        } catch (err) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-surface-dark dark:bg-[#11141a] p-8 rounded-2xl border border-border/50 dark:border-[#282e39]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="col-span-1 md:col-span-2">
                                <FormLabel className="uppercase text-[10px] font-black tracking-widest text-primary">Article Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter title..." {...field} className="bg-muted/50 border-border/50 font-bold uppercase text-xs" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-[10px] font-black tracking-widest text-primary">Category / Type</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. AI Systems" {...field} className="bg-muted/50 border-border/50 font-bold text-xs" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="readTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-[10px] font-black tracking-widest text-primary">Read Time</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 5 min" {...field} className="bg-muted/50 border-border/50 font-bold text-xs" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel className="uppercase text-[10px] font-black tracking-widest text-primary">Cover Image</FormLabel>
                        <div className="mt-2 flex items-center gap-4">
                            <div className="relative size-32 rounded-xl bg-muted border-2 border-dashed border-border/50 overflow-hidden flex items-center justify-center">
                                {imagePreview ? (
                                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <LuImagePlus className="size-8 text-muted-foreground/30" />
                                )}
                                <input
                                    type="file"
                                    id="blog-image"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div className="text-[10px] text-muted-foreground font-medium max-w-[200px]">
                                Upload a high-quality cover image for your article. 16:9 ratio recommended.
                            </div>
                        </div>
                    </FormItem>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="col-span-1 md:col-span-2">
                                <FormLabel className="uppercase text-[10px] font-black tracking-widest text-primary">Content / Overview</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write your blog content here..."
                                        {...field}
                                        className="min-h-[250px] bg-muted/50 border-border/50 font-medium text-sm leading-relaxed"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-border/10">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        className="font-black uppercase tracking-widest text-[10px]"
                    >
                        <LuX className="mr-2 size-3" />
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="font-black uppercase tracking-widest text-[10px] px-8"
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 size-3 animate-spin" />
                        ) : (
                            <LuSave className="mr-2 size-3" />
                        )}
                        Publish Article
                    </Button>
                </div>
            </form>
        </Form>
    );
}
