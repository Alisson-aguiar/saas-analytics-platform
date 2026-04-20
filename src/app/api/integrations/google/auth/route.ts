import { NextResponse } from "next/server";
import { googleSheetsService } from "@/lib/services/google-sheets.service";

export async function GET() {
    try {
        const authUrl = googleSheetsService.getAuthUrl();
        return NextResponse.redirect(authUrl);
    } catch (error) {
        console.error("Erro ao gerar URL de autenticação:", error);
        return NextResponse.redirect(new URL('/dashboard/integrations?error=auth_failed', process.env.NEXTAUTH_URL));
    }
}