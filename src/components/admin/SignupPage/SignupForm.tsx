"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema, SignupInput } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/actions/CreateUser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupForm() {
    const router = useRouter();

    const form = useForm<SignupInput>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            fullname: "",
            email: "",
            password: "",
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: createUser,
        onSuccess: (data) => {
            if (data.error) {
                if (typeof data.error === "string") {
                    toast.error(data.error);
                } else {
                    toast.error("Please check the form for errors.");
                }
            } else {
                toast.success("Account created successfully! Redirecting to login...");
                setTimeout(() => router.push("/login"), 1500);
            }
        },
        onError: () => {
            toast.error("Something went wrong. Please try again later.");
        },
    });

    const onSubmit = (data: SignupInput) => {
        mutate(data);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md"
        >
            <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight mb-1">Create Account</h2>
                <p className="text-slate-400 text-sm">Join the portfolio command center.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="fullname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-300">Full Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Sugam Pudasaini"
                                        className="bg-black/20 border-white/10 focus:border-primary/50 py-6"
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
                            <FormItem>
                                <FormLabel className="text-slate-300">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="hello@sugam.dev"
                                        className="bg-black/20 border-white/10 focus:border-primary/50 py-6"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-300">Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="bg-black/20 border-white/10 focus:border-primary/50 py-6"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-6 text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                        {isPending ? (
                            <>
                                <Spinner className="mr-2 h-5 w-5 border-white" />
                                Working...
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </Button>
                </form>
            </Form>

            <div className="mt-8 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                    Log In
                </Link>
            </div>
        </motion.div>
    );
}
