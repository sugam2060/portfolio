"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactFormSchema, ContactFormValues } from "@/types/contact";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { sendMessage } from "@/actions/MessageActions";
import { toast } from "sonner";
import { useState } from "react";

export default function ContactForm() {
    const [isPending, setIsPending] = useState(false);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(ContactFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    const onSubmit = async (data: ContactFormValues) => {
        setIsPending(true);
        try {
            const res = await sendMessage({
                name: data.fullName,
                email: data.email,
                subject: data.subject,
                message: data.message,
            });

            if (res.success) {
                toast.success("Message sent successfully! I'll get back to you soon.");
                form.reset();
            } else {
                toast.error(res.error || "Something went wrong. Please try again later.");
            }
        } catch (err) {
            toast.error("Failed to connect to the server.");
        } finally {
            setIsPending(false);
        }
    };

    const inputClasses = "w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-primary py-4 px-5 text-foreground dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all outline-none";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel className="text-sm font-semibold px-1 text-foreground dark:text-white">Full Name</FormLabel>
                                    <FormControl>
                                        <input
                                            placeholder="John Doe"
                                            className={inputClasses}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel className="text-sm font-semibold px-1 text-foreground dark:text-white">Email Address</FormLabel>
                                    <FormControl>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className={inputClasses}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-1">
                                <FormLabel className="text-sm font-semibold px-1 text-foreground dark:text-white">Subject</FormLabel>
                                <FormControl>
                                    <input
                                        placeholder="How can I help you?"
                                        className={inputClasses}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-1">
                                <FormLabel className="text-sm font-semibold px-1 text-foreground dark:text-white">Message</FormLabel>
                                <FormControl>
                                    <textarea
                                        placeholder="Tell me about your project details..."
                                        rows={6}
                                        className={`${inputClasses} resize-none`}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-xl shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isPending ? (
                            <>
                                Sending...
                                <Loader2 className="size-5 animate-spin" />
                            </>
                        ) : (
                            <>
                                Send Message
                                <Send className="size-5 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </button>
                </form>
            </Form>
        </motion.div>
    );
}
