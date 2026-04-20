import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutos

export async function GET(request: Request) {
    try {
        // Verificar se é uma requisição autorizada (opcional)
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        console.log("🔄 Iniciando sincronização agendada...");

        // Buscar conexões que precisam ser sincronizadas
        const { data: connections, error } = await supabaseAdmin
            .from('google_sheets_connections')
            .select('*')
            .eq('active', true)
            .not('sync_frequency', 'eq', 'manual')
            .filter('next_sync_at', 'lte', new Date().toISOString());

        if (error) throw error;

        console.log(`📊 ${connections?.length || 0} conexões precisam ser sincronizadas`);

        const results = [];

        for (const connection of connections || []) {
            try {
                console.log(`📝 Sincronizando: ${connection.name}`);

                // Buscar dados para exportar
                const { data: analytics } = await supabaseAdmin
                    .from('analytics_queries')
                    .select('*')
                    .eq('user_id', connection.user_id)
                    .limit(1000);

                // Simular exportação (aqui você chamaria o Google Sheets)
                // Por enquanto, apenas registramos o sucesso

                // Registrar no histórico
                await supabaseAdmin
                    .from('export_history')
                    .insert({
                        connection_id: connection.id,
                        user_id: connection.user_id,
                        export_type: 'scheduled',
                        period: connection.sync_frequency,
                        row_count: analytics?.length || 0,
                        status: 'success',
                        details: { scheduled: true, source: 'cron' }
                    });

                // Atualizar última sincronização
                await supabaseAdmin
                    .from('google_sheets_connections')
                    .update({
                        last_sync_at: new Date().toISOString(),
                        next_sync_at: connection.sync_frequency === 'daily'
                            ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                            : connection.sync_frequency === 'weekly'
                                ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                    })
                    .eq('id', connection.id);

                results.push({
                    id: connection.id,
                    name: connection.name,
                    status: 'success',
                    rows: analytics?.length || 0
                });

            } catch (err) {
                console.error(`❌ Erro ao sincronizar ${connection.name}:`, err);

                await supabaseAdmin
                    .from('export_history')
                    .insert({
                        connection_id: connection.id,
                        user_id: connection.user_id,
                        export_type: 'scheduled',
                        status: 'error',
                        error_message: err instanceof Error ? err.message : 'Erro desconhecido'
                    });

                results.push({
                    id: connection.id,
                    name: connection.name,
                    status: 'error',
                    error: err instanceof Error ? err.message : 'Erro desconhecido'
                });
            }
        }

        console.log("✅ Sincronização concluída!");

        return NextResponse.json({
            success: true,
            processed: connections?.length || 0,
            results
        });

    } catch (error) {
        console.error("❌ Erro na sincronização:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}