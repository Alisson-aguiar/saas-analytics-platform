import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/client";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const connectionId = searchParams.get('connectionId');

        if (!connectionId) {
            return NextResponse.json({ error: "connectionId é obrigatório" }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('export_history')
            .select('*')
            .eq('connection_id', connectionId)
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        return NextResponse.json({ success: true, history: data || [] });
    } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        return NextResponse.json({ error: "Erro ao buscar histórico" }, { status: 500 });
    }
}