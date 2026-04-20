import { supabase, supabaseAdmin } from "@/lib/supabase/client";

export interface Report {
    id: string;
    title: string;
    description: string;
    config: any;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    userEmail: string;
    userName: string;
}

export interface CreateReportDTO {
    title: string;
    description: string;
    config: any;
    isPublic?: boolean;
}

export class ReportService {
    // LEITURAS - usa supabase normal (com RLS)
    async getUserReports(userId: string): Promise<Report[]> {
        try {
            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("❌ Erro ao buscar relatórios:", error);
                return [];
            }

            if (!data || data.length === 0) return [];

            // Buscar informações do usuário
            const { data: userData } = await supabase
                .from('profiles')
                .select('full_name, email')
                .eq('id', userId)
                .maybeSingle();

            return data.map(report => ({
                id: report.id,
                title: report.title,
                description: report.description || '',
                config: report.config || {},
                isPublic: report.is_public || false,
                createdAt: new Date(report.created_at),
                updatedAt: new Date(report.updated_at),
                userEmail: userData?.email || '',
                userName: userData?.full_name || 'Usuário'
            }));
        } catch (error) {
            console.error("❌ Erro:", error);
            return [];
        }
    }

    async getReportById(reportId: string): Promise<Report | null> {
        try {
            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .eq('id', reportId)
                .maybeSingle();

            if (error || !data) return null;

            const { data: userData } = await supabase
                .from('profiles')
                .select('full_name, email')
                .eq('id', data.user_id)
                .maybeSingle();

            return {
                id: data.id,
                title: data.title,
                description: data.description || '',
                config: data.config || {},
                isPublic: data.is_public || false,
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at),
                userEmail: userData?.email || '',
                userName: userData?.full_name || 'Usuário'
            };
        } catch (error) {
            return null;
        }
    }

    async getPublicReports(): Promise<Report[]> {
        try {
            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .eq('is_public', true)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error || !data) return [];

            const reportsWithUsers = await Promise.all(
                data.map(async (report) => {
                    const { data: userData } = await supabase
                        .from('profiles')
                        .select('full_name, email')
                        .eq('id', report.user_id)
                        .maybeSingle();

                    return {
                        id: report.id,
                        title: report.title,
                        description: report.description || '',
                        config: report.config || {},
                        isPublic: report.is_public,
                        createdAt: new Date(report.created_at),
                        updatedAt: new Date(report.updated_at),
                        userEmail: userData?.email || '',
                        userName: userData?.full_name || 'Usuário'
                    };
                })
            );

            return reportsWithUsers;
        } catch (error) {
            return [];
        }
    }

    // ESCRITAS - usa supabaseAdmin (ignora RLS)
    async createReport(userId: string, report: CreateReportDTO): Promise<Report | null> {
        try {
            console.log("📝 Criando relatório com admin...");

            const { data, error } = await supabaseAdmin
                .from('reports')
                .insert({
                    user_id: userId,
                    title: report.title,
                    description: report.description || '',
                    config: report.config || {},
                    is_public: report.isPublic || false
                })
                .select()
                .single();

            if (error) {
                console.error("❌ Erro ao criar:", error);
                return null;
            }

            console.log("✅ Relatório criado:", data.id);
            return {
                id: data.id,
                title: data.title,
                description: data.description || '',
                config: data.config || {},
                isPublic: data.is_public || false,
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at),
                userEmail: '',
                userName: ''
            };
        } catch (error) {
            console.error("❌ Erro:", error);
            return null;
        }
    }

    async updateReport(reportId: string, report: Partial<CreateReportDTO>): Promise<boolean> {
        try {
            console.log("📝 Atualizando relatório com admin...");

            const updateData: any = {
                updated_at: new Date().toISOString()
            };

            if (report.title !== undefined) updateData.title = report.title;
            if (report.description !== undefined) updateData.description = report.description;
            if (report.config !== undefined) updateData.config = report.config;
            if (report.isPublic !== undefined) updateData.is_public = report.isPublic;

            const { error } = await supabaseAdmin
                .from('reports')
                .update(updateData)
                .eq('id', reportId);

            if (error) {
                console.error("❌ Erro ao atualizar:", error);
                return false;
            }

            console.log("✅ Relatório atualizado!");
            return true;
        } catch (error) {
            console.error("❌ Erro:", error);
            return false;
        }
    }

    async deleteReport(reportId: string): Promise<boolean> {
        try {
            console.log("🗑️ Deletando relatório com admin...");

            const { error } = await supabaseAdmin
                .from('reports')
                .delete()
                .eq('id', reportId);

            if (error) {
                console.error("❌ Erro ao deletar:", error);
                return false;
            }

            console.log("✅ Relatório deletado!");
            return true;
        } catch (error) {
            console.error("❌ Erro:", error);
            return false;
        }
    }
}

export const reportService = new ReportService();