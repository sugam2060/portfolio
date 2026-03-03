export const runtime = "edge";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    const isLoginPage = request.nextUrl.pathname === "/login";
    const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

    let isValid = false;

    if (token) {
        try {
            const secret = new TextEncoder().encode(
                process.env.JWT_SECRET || "fallback_secret_change_me"
            );
            await jwtVerify(token, secret);
            isValid = true;
        } catch (error) {
            isValid = false;
        }
    }

    // Protect admin routes
    if (isAdminPath && !isValid) {
        const loginUrl = new URL("/login", request.url);
        // Optional: add a redirect param so you can come back after login
        // loginUrl.searchParams.set("from", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Prevent logged-in users from seeing the login page again
    if (isLoginPage && isValid) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
