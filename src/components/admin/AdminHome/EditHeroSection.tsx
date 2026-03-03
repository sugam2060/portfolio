"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HeroSectionSchema, HeroSectionInput } from "@/types/homepage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHeroSection } from "@/actions/HomepageActions";
import { uploadFile } from "@/actions/FileUpload";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LuImagePlus, LuSave } from "react-icons/lu";
import { useState, useRef } from "react";

export default function EditHeroSection({ initialData }: { initialData?: any }) {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm<HeroSectionInput>({
        resolver: zodResolver(HeroSectionSchema),
        defaultValues: {
            heading: initialData?.heading || "",
            subHeading: initialData?.subHeading || "",
            imgTextHeading: initialData?.imgTextHeading || "",
            imgTextSubHeading: initialData?.imgTextSubHeading || "",
            imageUrl: initialData?.imageUrl || "",
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: updateHeroSection,
        onSuccess: (data: any) => {
            if (data.error) {
                toast.error("Error updating hero section");
            } else {
                toast.success("Hero section updated!");
                queryClient.invalidateQueries({ queryKey: ["homepage-data"] });
            }
        },
    });

    const onSubmit = (data: HeroSectionInput) => {
        const formData = new FormData();
        formData.append("heading", data.heading);
        formData.append("subHeading", data.subHeading);
        formData.append("imgTextHeading", data.imgTextHeading);
        formData.append("imgTextSubHeading", data.imgTextSubHeading);
        formData.append("imageUrl", data.imageUrl || "");

        const file = fileInputRef.current?.files?.[0];
        if (file) {
            formData.append("file", file);
        }

        mutate(formData);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Preview or simple state update if needed
            toast.info(`Selected: ${file.name}`);
        }
    };

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <LuImagePlus className="text-primary" />
                    Hero Section
                </CardTitle>
                <CardDescription>
                    Manage the main greeting and visual on your homepage.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="heading"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Main Heading</FormLabel>
                                        <FormControl>
                                            <Input placeholder="I build intelligent AI..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="subHeading"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sub Heading (Bio Blurb)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Hi, I'm Sugam..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="imgTextHeading"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image Overlay Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="System Architecture" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="imgTextSubHeading"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image Overlay Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Building scalable workflows" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hero Image URL</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} className="flex-1" />
                                        </FormControl>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            disabled={isUploading}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {isUploading ? <Spinner className="h-4 w-4" /> : <LuImagePlus className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    <FormDescription>
                                        Provide a link or upload an image to your R2 bucket.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isPending} className="w-full md:w-auto">
                            {isPending ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4 border-white" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <LuSave className="mr-2 h-4 w-4" />
                                    Update Hero Section
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
