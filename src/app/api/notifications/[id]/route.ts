import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/client";

async function getUserId(identifier: string): Promise<string | null> {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(identifier)) {
        return identifier;
    }

    const { data, error } = await supabaseAdmin
        .schema('auth')
        .from('users')
        .select('id')
        .eq('email', identifier)
        .maybeSingle();

    if (error) return null;
    if (data) return data.id;

    const { data: profileData } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', identifier)
        .maybeSingle();

    return profileData?.id || null;
}

// GET - Buscar uma notificação específica
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const realUserId = await getUserId(session.user.email);
        if (!realUserId) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        const { id } = await params;

        const { data, error } = await supabaseAdmin
            .from('notifications')
            .select('*')
            .eq('id', id)
            .eq('user_id', realUserId)
            .maybeSingle();

        if (error || !data) {
            return NextResponse.json({ error: "Notificação não encontrada" }, { status: 404 });
        }

        return NextResponse.json({ success: true, notification: data });
    } catch (error) {
        console.error("❌ Erro ao buscar notificação:", error);
        return NextResponse.json({ error: "Erro ao buscar notificação" }, { status: 500 });
    }
}

// DELETE - Deletar notificação
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const realUserId = await getUserId(session.user.email);
        if (!realUserId) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        const { id } = await params;

        const { error } = await supabaseAdmin
            .from('notifications')
            .delete()
            .eq('id', id)
            .eq('user_id', realUserId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Erro ao deletar notificação:", error);
        return NextResponse.json({ error: "Erro ao deletar notificação" }, { status: 500 });
    }
}

// PUT - Atualizar notificação (marcar como lida)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const realUserId = await getUserId(session.user.email);
        if (!realUserId) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        const { id } = await params;
        const body = await request.json();
        const { read } = body;

        const { error } = await supabaseAdmin
            .from('notifications')
            .update({ read: read === true })
            .eq('id', id)
            .eq('user_id', realUserId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Erro ao atualizar notificação:", error);
        return NextResponse.json({ error: "Erro ao atualizar notificação" }, { status: 500 });
    }
}