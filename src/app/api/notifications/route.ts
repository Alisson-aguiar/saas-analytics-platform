import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/client";

// Função para converter ID do usuário (Google/GitHub) para UUID
async function getUserId(identifier: string): Promise<string | null> {
    // Se já for UUID, retorna
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(identifier)) {
        return identifier;
    }

    // Buscar pelo email no schema auth.users
    const { data, error } = await supabaseAdmin
        .schema('auth')
        .from('users')
        .select('id')
        .eq('email', identifier)
        .maybeSingle();

    if (error) {
        console.error("❌ Erro ao buscar usuário no auth.users:", error.message);
    }

    if (data) {
        console.log("✅ Usuário encontrado no auth.users:", data.id);
        return data.id;
    }

    // Fallback: buscar no profiles
    const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', identifier)
        .maybeSingle();

    if (profileError) {
        console.error("❌ Erro ao buscar perfil:", profileError.message);
    }

    if (profileData) {
        console.log("✅ Usuário encontrado no profiles:", profileData.id);
        return profileData.id;
    }

    console.error("❌ Usuário não encontrado:", identifier);
    return null;
}

// GET - Buscar notificações do usuário
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const realUserId = await getUserId(session.user.email);

        if (!realUserId) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        console.log("🔍 Buscando notificações para:", realUserId);

        const { data, error } = await supabaseAdmin
            .from('notifications')
            .select('*')
            .eq('user_id', realUserId)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error("❌ Erro na consulta:", error);
            throw error;
        }

        return NextResponse.json({ success: true, notifications: data || [] });
    } catch (error) {
        console.error("❌ Erro ao buscar notificações:", error);
        return NextResponse.json({ error: "Erro ao buscar notificações" }, { status: 500 });
    }
}

// POST - Criar notificação de teste
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const realUserId = await getUserId(session.user.email);

        if (!realUserId) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        const body = await request.json();
        const { title, message, type } = body;

        const finalTitle = title || "📢 Nova notificação!";
        const finalMessage = message || "Esta é uma notificação gerada automaticamente.";
        const finalType = type || "info";

        console.log("📝 Criando notificação para:", realUserId);
        console.log("📝 Dados:", { title: finalTitle, message: finalMessage, type: finalType });

        const { data, error } = await supabaseAdmin
            .from('notifications')
            .insert({
                user_id: realUserId,
                title: finalTitle,
                message: finalMessage,
                type: finalType,
                metadata: { source: 'api', created_at: new Date().toISOString() }
            })
            .select()
            .single();

        if (error) {
            console.error("❌ Erro ao inserir:", error);
            throw error;
        }

        console.log("✅ Notificação criada:", data.id);

        return NextResponse.json({ success: true, notification: data });
    } catch (error) {
        console.error("❌ Erro ao criar notificação:", error);
        return NextResponse.json({ error: "Erro ao criar notificação" }, { status: 500 });
    }
}

// DELETE - Deletar todas as notificações (opcional)
export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const realUserId = await getUserId(session.user.email);

        if (!realUserId) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        const { error } = await supabaseAdmin
            .from('notifications')
            .delete()
            .eq('user_id', realUserId);

        if (error) throw error;

        return NextResponse.json({ success: true, message: "Todas as notificações foram deletadas" });
    } catch (error) {
        console.error("❌ Erro ao deletar notificações:", error);
        return NextResponse.json({ error: "Erro ao deletar notificações" }, { status: 500 });
    }
}