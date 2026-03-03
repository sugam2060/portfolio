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

    const [previewUrl, setPreviewUrl] = useState<string>(initialData?.imageUrl || "");

    const { mutate, isPending } = useMutation({
        mutationFn: updateHeroSection,
        onSuccess: (data: any) => {
            if (data.error) {
                toast.error(typeof data.error === 'string' ? data.error : "Failed to update hero section");
            } else {
                toast.success("Hero section updated!");
                queryClient.invalidateQueries({ queryKey: ["homepage-data"] });
                // If a new image was uploaded, the server should return the new URL
                // and we should update the form's imageUrl and previewUrl
                if (data.imageUrl) {
                    form.setValue("imageUrl", data.imageUrl);
                    setPreviewUrl(data.imageUrl);
                }
            }
        },
    });

    const onSubmit = (data: HeroSectionInput) => {
        const formData = new FormData();
        formData.append("heading", data.heading);
        formData.append("subHeading", data.subHeading);
        formData.append("imgTextHeading", data.imgTextHeading);
        formData.append("imgTextSubHeading", data.imgTextSubHeading);
        // Only append imageUrl if no new file is selected, otherwise the server will handle it
        if (!fileInputRef.current?.files?.[0]) {
            formData.append("imageUrl", data.imageUrl || "");
        }

        const file = fileInputRef.current?.files?.[0];
        if (file) {
            formData.append("file", file);
        }

        mutate(formData);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Preview the locally selected file
            const transientUrl = URL.createObjectURL(file);
            setPreviewUrl(transientUrl);
            toast.info(`Image selected: ${file.name}`);
            // Clear the form's imageUrl field if a new file is selected,
            // as the server will provide the new URL upon successful upload.
            form.setValue("imageUrl", "");
        } else {
            // If file selection is cancelled, revert preview to initial or current form value
            setPreviewUrl(form.getValues("imageUrl") || initialData?.imageUrl || "");
        }
    };

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <LuImagePlus className="text-primary animate-pulse" />
                    Hero Section
                </CardTitle>
                <CardDescription>
                    Manage the main greeting and visual on your homepage.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Image Preview Area */}
                        {(previewUrl || form.getValues("imageUrl")) && (
                            <div className="relative w-full h-48 rounded-xl overflow-hidden group border border-border/50">
                                <img
                                    src={previewUrl || form.getValues("imageUrl")}
                                    alt="Hero Preview"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <p className="text-white text-sm font-medium">Click upload icon to change</p>
                                </div>
                            </div>
                        )}

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
                                    <FormLabel>Hero Image URL / key</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input placeholder="Upload an image..." {...field} className="flex-1" readOnly />
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
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <LuImagePlus className="h-4 w-4" />
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
