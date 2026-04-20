import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { googleSheetsService } from "@/lib/services/google-sheets.service";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        const url = new URL(request.url);
        const code = url.searchParams.get('code');

        if (!code) {
            return NextResponse.redirect(new URL('/dashboard/integrations?error=missing_code', request.url));
        }

        // Trocar código por tokens
        const tokens = await googleSheetsService.getTokens(code);

        // Redirecionar para página de configuração
        return NextResponse.redirect(new URL('/dashboard/integrations/google/setup', request.url));
    } catch (error) {
        console.error("Erro no callback:", error);
        return NextResponse.redirect(new URL('/dashboard/integrations?error=auth_failed', request.url));
    }
}