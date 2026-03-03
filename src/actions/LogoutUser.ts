"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { redirect } from "next/navigation";

export const logoutUser = async () => {
    try {
        const cookieStore = await cookies();
        const tokenToken = cookieStore.get("access_token")?.value;

        if (tokenToken) {
            const { env } = getCloudflareContext() as unknown as { env: CloudflareEnv };
            const secret = new TextEncoder().encode(
                env.JWT_SECRET || "fallback_secret_change_me"
            );

            try {
                const { payload } = await jwtVerify(tokenToken, secret);
                if (payload && payload.id) {
                    const kv = env.portfolio_kv;
                    await kv.delete(`user_${payload.id}`);
                }
            } catch (err) {
                // Token invalid or expired, just proceed to clear cookie
                console.error("Logout: Token verification failed during logout:", err);
            }
        }

        // Clear the cookie
        (await cookies()).delete("access_token");

    } catch (error) {
        console.error("Logout failed:", error);
    }

    // Redirect to login page
    redirect("/admin/login");
};
