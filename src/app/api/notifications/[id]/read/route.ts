import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/client";

// PUT - Marcar notificação como lida (rota específica /read)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const { id } = await params;
        console.log("📝 Marcando notificação como lida (via /read):", id);

        const { error } = await supabaseAdmin
            .from('notifications')
            .update({ read: true })
            .eq('id', id)
            .eq('user_id', session.user.id);

        if (error) {
            console.error("❌ Erro ao marcar como lida:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log("✅ Notificação marcada como lida!");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Erro ao marcar notificação como lida:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}