import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/client";

// DELETE - Remover conexão
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const { id } = await params; // ← IMPORTANTE: usar await

        console.log("🗑️ Deletando conexão:", id);
        console.log("👤 Usuário:", session.user.id);

        // Verificar se a conexão existe
        const { data: connection, error: fetchError } = await supabaseAdmin
            .from('google_sheets_connections')
            .select('id')
            .eq('id', id)
            .eq('user_id', session.user.id)
            .single();

        if (fetchError) {
            console.error("❌ Conexão não encontrada:", fetchError);
            return NextResponse.json({ error: "Conexão não encontrada" }, { status: 404 });
        }

        // Deletar a conexão
        const { error } = await supabaseAdmin
            .from('google_sheets_connections')
            .delete()
            .eq('id', id)
            .eq('user_id', session.user.id);

        if (error) {
            console.error("❌ Erro ao deletar:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log("✅ Conexão deletada com sucesso!");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Erro ao deletar conexão:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

// GET - Buscar uma conexão específica
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const { id } = await params; // ← IMPORTANTE: usar await

        const { data, error } = await supabaseAdmin
            .from('google_sheets_connections')
            .select('*')
            .eq('id', id)
            .eq('user_id', session.user.id)
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, connection: data });
    } catch (error) {
        console.error("Erro ao buscar conexão:", error);
        return NextResponse.json({ error: "Erro ao buscar conexão" }, { status: 500 });
    }
}

// PATCH - Atualizar conexão
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const { id } = await params; // ← IMPORTANTE: usar await
        const body = await request.json();
        const { active, name, sheetName, syncFrequency } = body;

        const updateData: any = { updated_at: new Date().toISOString() };
        if (active !== undefined) updateData.active = active;
        if (name !== undefined) updateData.name = name;
        if (sheetName !== undefined) updateData.sheet_name = sheetName;
        if (syncFrequency !== undefined) updateData.sync_frequency = syncFrequency;

        const { error } = await supabaseAdmin
            .from('google_sheets_connections')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', session.user.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao atualizar conexão:", error);
        return NextResponse.json({ error: "Erro ao atualizar conexão" }, { status: 500 });
    }
}