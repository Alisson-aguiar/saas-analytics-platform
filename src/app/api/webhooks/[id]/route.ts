import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/client";

// DELETE - Deletar um webhook
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const { id } = await params;
        console.log("🗑️ Deletando webhook:", id);

        // Verificar se o webhook existe e pertence ao usuário
        const { data: webhook, error: fetchError } = await supabaseAdmin
            .from('webhooks')
            .select('id')
            .eq('id', id)
            .eq('user_id', session.user.id)
            .single();

        if (fetchError) {
            console.error("❌ Webhook não encontrado:", fetchError);
            return NextResponse.json({ error: "Webhook não encontrado" }, { status: 404 });
        }

        // Deletar logs relacionados primeiro (por causa da foreign key)
        const { error: logsError } = await supabaseAdmin
            .from('webhook_logs')
            .delete()
            .eq('webhook_id', id);

        if (logsError) {
            console.error("⚠️ Erro ao deletar logs:", logsError);
            // Continua mesmo assim
        }

        // Deletar o webhook
        const { error } = await supabaseAdmin
            .from('webhooks')
            .delete()
            .eq('id', id)
            .eq('user_id', session.user.id);

        if (error) {
            console.error("❌ Erro ao deletar webhook:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log("✅ Webhook deletado com sucesso!");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Erro ao deletar webhook:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

// GET - Buscar um webhook específico
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const { id } = await params;

        const { data, error } = await supabaseAdmin
            .from('webhooks')
            .select('*')
            .eq('id', id)
            .eq('user_id', session.user.id)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        // Buscar logs do webhook
        const { data: logs } = await supabaseAdmin
            .from('webhook_logs')
            .select('*')
            .eq('webhook_id', id)
            .order('created_at', { ascending: false })
            .limit(20);

        return NextResponse.json({
            success: true,
            webhook: data,
            logs: logs || []
        });
    } catch (error) {
        console.error("❌ Erro ao buscar webhook:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

// PATCH - Atualizar um webhook
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { name, url, events, active } = body;

        const updateData: any = { updated_at: new Date().toISOString() };
        if (name !== undefined) updateData.name = name;
        if (url !== undefined) updateData.url = url;
        if (events !== undefined) updateData.events = events;
        if (active !== undefined) updateData.active = active;

        const { error } = await supabaseAdmin
            .from('webhooks')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', session.user.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Erro ao atualizar webhook:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}