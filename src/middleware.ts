import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Middleware to protect admin routes
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isLoginPage = pathname === "/login";
    const isAdminPath = pathname.startsWith("/admin");

    // Get the access_token cookie
    const token = request.cookies.get("access_token")?.value;

    let isValid = false;

    if (token) {
        try {
            const secret = new TextEncoder().encode(
                process.env.JWT_SECRET || "fallback_secret_change_me"
            );
            // Verify the JWT signature at the edge
            const { payload } = await jwtVerify(token, secret);

            // Basic check for required fields in our payload
            if (payload && payload.id && payload.email) {
                isValid = true;
            }
        } catch (error) {
            isValid = false;
        }
    }

    // Protect admin routes: Redirect to login if not authenticated
    if (isAdminPath && !isValid) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect logged-in users away from the login page
    if (isLoginPage && isValid) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api routes
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - static assets
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
