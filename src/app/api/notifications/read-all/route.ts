import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/client";

export async function PUT() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const { error } = await supabaseAdmin
            .from('notifications')
            .update({ read: true })
            .eq('user_id', session.user.id)
            .eq('read', false);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao marcar todas como lidas:", error);
        return NextResponse.json({ error: "Erro ao marcar todas como lidas" }, { status: 500 });
    }
}