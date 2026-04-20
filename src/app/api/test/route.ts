import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/client";

export async function POST() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const types = ['info', 'success', 'warning', 'error', 'team', 'report'];
        const titles = [
            '🎉 Nova notificação!',
            '📊 Relatório pronto',
            '👥 Novo membro no time',
            '⚠️ Atenção!',
            '✅ Tarefa concluída',
            '🔔 Alerta importante'
        ];
        const messages = [
            'Esta é uma notificação de teste gerada automaticamente.',
            'Seu relatório está disponível para download.',
            'Um novo membro entrou no time.',
            'Verifique suas configurações de segurança.',
            'A tarefa foi concluída com sucesso.',
            'Ação necessária: revise os dados.'
        ];

        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        const { data, error } = await supabaseAdmin
            .from('notifications')
            .insert({
                user_id: session.user.id,
                title: randomTitle,
                message: randomMessage,
                type: randomType,
                metadata: { test: true, source: 'api-test' }
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, notification: data });
    } catch (error) {
        console.error("Erro:", error);
        return NextResponse.json({ error: "Erro ao criar notificação" }, { status: 500 });
    }
}