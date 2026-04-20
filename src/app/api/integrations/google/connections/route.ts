import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/client";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const { data: connections, error } = await supabaseAdmin
            .from('google_sheets_connections')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({
            success: true,
            connections: connections || []
        });
    } catch (error) {
        console.error("Erro:", error);
        return NextResponse.json({ error: "Erro ao buscar conexões" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const body = await request.json();
        const { name, spreadsheetId, sheetName, syncFrequency } = body;

        const { data, error } = await supabaseAdmin
            .from('google_sheets_connections')
            .insert({
                user_id: session.user.id,
                name,
                spreadsheet_id: spreadsheetId,
                sheet_name: sheetName,
                sync_frequency: syncFrequency || 'manual',
                active: true
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, connection: data });
    } catch (error) {
        console.error("Erro:", error);
        return NextResponse.json({ error: "Erro ao criar conexão" }, { status: 500 });
    }
}