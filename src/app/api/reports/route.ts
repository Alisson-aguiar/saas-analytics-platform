import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/client";

// GET - Buscar todos os relatórios do usuário
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const { data, error } = await supabaseAdmin
            .from('reports')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ success: true, reports: data || [] });
    } catch (error) {
        console.error("Erro ao buscar relatórios:", error);
        return NextResponse.json({ error: "Erro ao buscar relatórios" }, { status: 500 });
    }
}

// POST - Criar um novo relatório
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, config, isPublic } = body;

        if (!title) {
            return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 });
        }

        console.log("📝 Criando relatório:", { title, description, config, isPublic });

        const { data, error } = await supabaseAdmin
            .from('reports')
            .insert({
                user_id: session.user.id,
                title,
                description: description || '',
                config: config || {},
                is_public: isPublic || false
            })
            .select()
            .single();

        if (error) {
            console.error("❌ Erro Supabase:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log("✅ Relatório criado:", data.id);

        return NextResponse.json({ success: true, report: data });
    } catch (error) {
        console.error("❌ Erro ao criar relatório:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}