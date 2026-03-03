"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginInput } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/actions/LoginUser";
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

import { useUserStore } from "@/store/userStore";

export default function LoginForm() {
    const router = useRouter();
    const setUser = useUserStore((state) => state.setUser);

    const form = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            if (data.error) {
                toast.error(typeof data.error === "string" ? data.error : "Login failed. Please check your credentials.");
            } else {
                if (data.user) {
                    setUser(data.user);
                }
                toast.success("Welcome back! Redirecting to dashboard...");
                setTimeout(() => router.push("/"), 1500);
            }
        },
        onError: () => {
            toast.error("Something went wrong. Please try again.");
        },
    });

    const onSubmit = (data: LoginInput) => {
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
                <h2 className="text-2xl font-bold tracking-tight mb-1">Login</h2>
                <p className="text-slate-400 text-sm">Enter your credentials to access the admin area.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                                <div className="flex justify-between items-center">
                                    <FormLabel className="text-slate-300">Password</FormLabel>
                                    <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                                </div>
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
                                Validating...
                            </>
                        ) : (
                            "Log In"
                        )}
                    </Button>
                </form>
            </Form>

            <div className="mt-8 text-center text-sm text-slate-500">
                New here?{" "}
                <Link href="/signup" className="text-primary hover:underline font-medium">
                    Create Account
                </Link>
            </div>
        </motion.div>
    );
}
