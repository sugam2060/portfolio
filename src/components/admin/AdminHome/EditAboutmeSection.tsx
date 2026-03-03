"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AboutSectionSchema, AboutSectionInput } from "@/types/homepage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAboutSection } from "@/actions/HomepageActions";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LuUser, LuSave } from "react-icons/lu";

export default function EditAboutmeSection({ initialData }: { initialData?: any }) {
    const queryClient = useQueryClient();

    const form = useForm<AboutSectionInput>({
        resolver: zodResolver(AboutSectionSchema),
        defaultValues: {
            heading: initialData?.heading || "",
            subHeading: initialData?.subHeading || "",
            focusOn: initialData?.focusOn || "",
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: updateAboutSection,
        onSuccess: (data: any) => {
            if (data.error) {
                toast.error("Error updating about section");
            } else {
                toast.success("About section updated!");
                queryClient.invalidateQueries({ queryKey: ["homepage-data"] });
            }
        },
    });

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <LuUser className="text-primary" />
                    About Me Section
                </CardTitle>
                <CardDescription>
                    Customize your biography and research focus.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) => mutate(data))} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="heading"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Main Heading</FormLabel>
                                    <FormControl>
                                        <Input placeholder="From Nepal to Global Tech" {...field} />
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
                                    <FormLabel>Bio Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="I am a passionate developer..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="focusOn"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Focus Areas (Comma Separated)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="AI Agents, Automation & Scalable Systems" {...field} />
                                    </FormControl>
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
                                    Update About Section
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
