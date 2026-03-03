"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUserAction } from "@/actions/CurrentUser";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";

export function useCurrentUser() {
    const setUser = useUserStore((state) => state.setUser);
    const user = useUserStore((state) => state.user);

    const query = useQuery({
        queryKey: ["current-user"],
        queryFn: async () => {
            const result = await getCurrentUserAction();
            return result;
        },
        // Don't refetch on window focus for auth checks to keep it snappy
        refetchOnWindowFocus: false,
        retry: false
    });

    // Keep the Zustand store in sync with the session check
    useEffect(() => {
        if (query.data?.user) {
            setUser(query.data.user);
        }
    }, [query.data, setUser]);

    return {
        ...query,
        // We consider the user authorized if they are in KV (status: true) 
        // OR if they were found in DB (message: "User found in database")
        isLoading: query.isLoading,
        isAuthorized: !!query.data?.user,
        fromCache: query.data?.status === true,
        userData: query.data?.user || user,
        authMessage: query.data?.message
    };
}
