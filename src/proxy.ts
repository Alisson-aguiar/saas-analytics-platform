import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function proxy(req) {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // Rotas públicas
                if (
                    pathname === "/" ||
                    pathname.startsWith("/auth/") ||
                    pathname.startsWith("/api/auth/") ||
                    pathname.startsWith("/api/health") ||
                    pathname.startsWith("/_next/") ||
                    pathname === "/favicon.ico" ||
                    pathname === "/robots.txt" ||
                    pathname === "/sitemap.xml"
                ) {
                    return true;
                }

                return !!token;
            },
        },
        pages: {
            signIn: "/auth/login",
        },
    }
);

export const config = {
    matcher: [
        "/((?!api/auth|api/health|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};