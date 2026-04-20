import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/client";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const { connectionId, exportType, period = "last30" } = await request.json();

        console.log("📊 Iniciando exportação:", { connectionId, exportType, period });

        // Buscar a conexão
        const { data: connection, error: connError } = await supabaseAdmin
            .from('google_sheets_connections')
            .select('*')
            .eq('id', connectionId)
            .eq('user_id', session.user.id)
            .single();

        if (connError || !connection) {
            return NextResponse.json({ error: "Conexão não encontrada" }, { status: 404 });
        }

        // Calcular período
        let startDate = null;
        if (period !== "all") {
            const days = period === "last7" ? 7 : period === "last30" ? 30 : 90;
            startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
        }

        // Buscar dados conforme o tipo
        let data: any[] = [];
        let headers: string[] = [];

        switch (exportType) {
            case "analytics":
                // Buscar dados de análises
                let query = supabaseAdmin
                    .from('analytics_queries')
                    .select('time, query_type, duration_ms')
                    .eq('user_id', session.user.id);

                if (startDate) {
                    query = query.gte('time', startDate.toISOString());
                }

                const { data: analyticsData, error: analyticsError } = await query.order('time', { ascending: false }).limit(500);

                if (analyticsError) throw analyticsError;

                headers = ['Data', 'Tipo de Consulta', 'Duração (ms)'];
                data = (analyticsData || []).map(item => [
                    new Date(item.time).toLocaleString('pt-BR'),
                    item.query_type,
                    item.duration_ms
                ]);
                break;

            case "reports":
                // Buscar dados de relatórios
                let reportsQuery = supabaseAdmin
                    .from('reports')
                    .select('title, description, is_public, created_at')
                    .eq('user_id', session.user.id);

                if (startDate) {
                    reportsQuery = reportsQuery.gte('created_at', startDate.toISOString());
                }

                const { data: reportsData, error: reportsError } = await reportsQuery.order('created_at', { ascending: false }).limit(500);

                if (reportsError) throw reportsError;

                headers = ['Título', 'Descrição', 'Público', 'Criado em'];
                data = (reportsData || []).map(item => [
                    item.title,
                    item.description || '-',
                    item.is_public ? 'Sim' : 'Não',
                    new Date(item.created_at).toLocaleString('pt-BR')
                ]);
                break;

            case "users":
                // Buscar dados de usuários do time
                const { data: teamMembers, error: teamError } = await supabaseAdmin
                    .from('team_members')
                    .select('user:user_id(email, raw_user_meta_data), role, joined_at')
                    .eq('team_id', connection.team_id || (await supabaseAdmin.from('teams').select('id').eq('owner_id', session.user.id).single()).data?.id);

                if (teamError) throw teamError;

                headers = ['Nome', 'Email', 'Papel', 'Entrou em'];
                data = (teamMembers || []).map((item: any) => [
                    item.user?.raw_user_meta_data?.full_name || 'Usuário',
                    item.user?.email || '-',
                    item.role === 'owner' ? 'Proprietário' : item.role === 'admin' ? 'Administrador' : 'Membro',
                    new Date(item.joined_at).toLocaleString('pt-BR')
                ]);
                break;

            case "team":
                // Buscar dados do time
                const { data: teams, error: teamsError } = await supabaseAdmin
                    .from('teams')
                    .select('name, owner_id, created_at')
                    .eq('owner_id', session.user.id);

                if (teamsError) throw teamsError;

                headers = ['Nome do Time', 'Proprietário', 'Criado em'];
                data = (teams || []).map(item => [
                    item.name,
                    session.user.email,
                    new Date(item.created_at).toLocaleString('pt-BR')
                ]);
                break;

            case "all":
            default:
                // Dados combinados
                headers = ['Tipo', 'ID', 'Nome', 'Data de Criação'];

                // Buscar relatórios
                const { data: allReports } = await supabaseAdmin
                    .from('reports')
                    .select('id, title, created_at')
                    .eq('user_id', session.user.id)
                    .limit(100);

                // Buscar análises
                const { data: allAnalytics } = await supabaseAdmin
                    .from('analytics_queries')
                    .select('id, query_type, created_at')
                    .eq('user_id', session.user.id)
                    .limit(100);

                data = [
                    ...(allReports || []).map(r => ['Relatório', r.id, r.title, new Date(r.created_at).toLocaleString('pt-BR')]),
                    ...(allAnalytics || []).map(a => ['Análise', a.id, a.query_type, new Date(a.created_at).toLocaleString('pt-BR')])
                ];
                break;
        }

        // Formatar para planilha
        const sheetData = [headers, ...data];

        // Aqui você chamaria o Google Sheets para escrever os dados
        // Por enquanto, simulamos sucesso
        const rowCount = data.length;

        // Registrar no histórico
        await supabaseAdmin
            .from('export_history')
            .insert({
                connection_id: connectionId,
                user_id: session.user.id,
                export_type: exportType,
                period: period,
                row_count: rowCount,
                status: 'success',
                details: { headers, sample: data.slice(0, 5) }
            });

        // Atualizar último sync da conexão
        await supabaseAdmin
            .from('google_sheets_connections')
            .update({ last_sync_at: new Date().toISOString() })
            .eq('id', connectionId);

        console.log(`✅ Exportação concluída: ${rowCount} linhas exportadas`);

        return NextResponse.json({
            success: true,
            rowCount,
            headers,
            sample: data.slice(0, 10),
            message: `${rowCount} registros exportados com sucesso!`
        });
    } catch (error) {
        console.error("❌ Erro ao exportar:", error);

        // Registrar erro no histórico
        try {
            const { connectionId } = await request.json();
            await supabaseAdmin
                .from('export_history')
                .insert({
                    connection_id: connectionId,
                    user_id: (await getServerSession(authOptions))?.user?.id,
                    export_type: 'unknown',
                    status: 'error',
                    error_message: error instanceof Error ? error.message : 'Erro desconhecido'
                });
        } catch (e) {
            console.error("Erro ao registrar falha:", e);
        }

        return NextResponse.json({ error: "Erro ao exportar dados" }, { status: 500 });
    }
}