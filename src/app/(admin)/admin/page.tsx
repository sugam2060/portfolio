"use client";

import { useQuery } from "@tanstack/react-query";
import { getHomepageData } from "@/actions/HomepageActions";
import EditHeroSection from "@/components/admin/AdminHome/EditHeroSection";
import EditAboutmeSection from "@/components/admin/AdminHome/EditAboutmeSection";
import EditExpertise from "@/components/admin/AdminHome/EditExpertise";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import { LuLayoutDashboard, LuCircleAlert } from "react-icons/lu";

export default function AdminHomePage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["homepage-data"],
        queryFn: async () => {
            const resp = await getHomepageData();
            if ("error" in resp) throw new Error(resp.error as string);
            return resp;
        },
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Spinner className="h-10 w-10 text-primary" />
                <p className="text-muted-foreground animate-pulse font-medium">Loading command center...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <LuCircleAlert className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Failed to load data</h2>
                <p className="text-muted-foreground">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 lg:px-40 space-y-12 pb-20">
            <header className="flex flex-col gap-2">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3"
                >
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <LuLayoutDashboard className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Manage Home</h1>
                </motion.div>
                <p className="text-muted-foreground">Modify the core sections of your portfolio landing page.</p>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-10"
            >
                <EditHeroSection initialData={data?.hero} />
                <EditAboutmeSection initialData={data?.about} />
                <EditExpertise initialData={data?.expertise} />
            </motion.div>
        </div>
    );
}
