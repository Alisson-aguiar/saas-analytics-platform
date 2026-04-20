import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // Permitir acesso à landing page e páginas de auth sem autenticação
                if (pathname === "/" ||
                    pathname === "/auth/login" ||
                    pathname === "/auth/register" ||
                    pathname.startsWith("/auth/")) {
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
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};