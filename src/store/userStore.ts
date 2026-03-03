import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
    user: {
        id: number;
        fullname: string;
        email: string;
    } | null;
    setUser: (user: UserState["user"]) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            logout: () => set({ user: null }),
        }),
        {
            name: "portfolio-user-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
