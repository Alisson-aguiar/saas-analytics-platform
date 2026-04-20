import { supabase } from "@/lib/supabase/client";
import { Team, TeamMember } from "@/types/team";

export class TeamService {
    // Buscar times do usuário
    async getUserTeams(userId: string): Promise<Team[]> {
        try {
            console.log("🔍 Buscando times para usuário:", userId);

            // Buscar diretamente os times onde o usuário é membro
            const { data: teams, error } = await supabase
                .from('teams')
                .select(`
          *,
          team_members!inner (
            user_id,
            role
          )
        `)
                .eq('team_members.user_id', userId);

            if (error) {
                console.error("❌ Erro ao buscar times:", error);
                return [];
            }

            console.log("✅ Times encontrados:", teams);

            // Contar membros para cada time
            const teamsWithCount = await Promise.all(
                (teams || []).map(async (team) => {
                    const { count } = await supabase
                        .from('team_members')
                        .select('*', { count: 'exact', head: true })
                        .eq('team_id', team.id);

                    return {
                        id: team.id,
                        name: team.name,
                        ownerId: team.owner_id,
                        createdAt: new Date(team.created_at),
                        updatedAt: new Date(team.updated_at),
                        memberCount: count || 0
                    };
                })
            );

            return teamsWithCount;
        } catch (error) {
            console.error("❌ Erro inesperado:", error);
            return [];
        }
    }

    // Buscar time por ID
    async getTeamById(teamId: string): Promise<Team | null> {
        try {
            const { data, error } = await supabase
                .from('teams')
                .select('*')
                .eq('id', teamId)
                .single();

            if (error) throw error;

            const { count } = await supabase
                .from('team_members')
                .select('*', { count: 'exact', head: true })
                .eq('team_id', teamId);

            return {
                id: data.id,
                name: data.name,
                ownerId: data.owner_id,
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at),
                memberCount: count || 0
            };
        } catch (error) {
            console.error("Erro ao buscar time:", error);
            return null;
        }
    }

    // Buscar membros do time
    async getTeamMembers(teamId: string): Promise<TeamMember[]> {
        try {
            const { data, error } = await supabase
                .from('team_members')
                .select(`
          *,
          user:user_id (
            email,
            raw_user_meta_data
          )
        `)
                .eq('team_id', teamId);

            if (error) throw error;

            return (data || []).map(member => ({
                id: member.id,
                userId: member.user_id,
                teamId: member.team_id,
                role: member.role,
                joinedAt: new Date(member.joined_at),
                user: {
                    email: member.user?.email || '',
                    name: member.user?.raw_user_meta_data?.full_name || 'Usuário',
                    avatar: member.user?.raw_user_meta_data?.avatar_url
                }
            }));
        } catch (error) {
            console.error("Erro ao buscar membros:", error);
            return [];
        }
    }

    // Criar novo time
    async createTeam(userId: string, name: string): Promise<Team | null> {
        try {
            // Inserir time
            const { data: team, error: teamError } = await supabase
                .from('teams')
                .insert({
                    name,
                    owner_id: userId
                })
                .select()
                .single();

            if (teamError) throw teamError;

            // Adicionar criador como membro owner
            const { error: memberError } = await supabase
                .from('team_members')
                .insert({
                    team_id: team.id,
                    user_id: userId,
                    role: 'owner'
                });

            if (memberError) throw memberError;

            return {
                id: team.id,
                name: team.name,
                ownerId: team.owner_id,
                createdAt: new Date(team.created_at),
                updatedAt: new Date(team.updated_at),
                memberCount: 1
            };
        } catch (error) {
            console.error("Erro ao criar time:", error);
            return null;
        }
    }

    // Sair do time
    async leaveTeam(teamId: string, userId: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('team_members')
                .delete()
                .eq('team_id', teamId)
                .eq('user_id', userId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Erro ao sair do time:", error);
            return false;
        }
    }

    // Deletar time
    async deleteTeam(teamId: string, userId: string): Promise<boolean> {
        try {
            // Verificar se é owner
            const { data: team } = await supabase
                .from('teams')
                .select('owner_id')
                .eq('id', teamId)
                .single();

            if (team?.owner_id !== userId) {
                throw new Error("Apenas o proprietário pode deletar o time");
            }

            const { error } = await supabase
                .from('teams')
                .delete()
                .eq('id', teamId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Erro ao deletar time:", error);
            return false;
        }
    }
    async updateMemberRole(memberId: string, role: 'admin' | 'member'): Promise<boolean> {
        try {
            console.log("📝 Atualizando papel do membro:", { memberId, role });

            const { error } = await supabase
                .from('team_members')
                .update({ role })
                .eq('id', memberId);

            if (error) {
                console.error("❌ Erro ao atualizar papel:", error);
                return false;
            }

            console.log("✅ Papel atualizado com sucesso");
            return true;
        } catch (error) {
            console.error("❌ Erro inesperado:", error);
            return false;
        }
    }

    // Remover membro
    async removeMember(memberId: string): Promise<boolean> {
        try {
            console.log("🗑️ Removendo membro:", memberId);

            const { error } = await supabase
                .from('team_members')
                .delete()
                .eq('id', memberId);

            if (error) {
                console.error("❌ Erro ao remover membro:", error);
                return false;
            }

            console.log("✅ Membro removido com sucesso");
            return true;
        } catch (error) {
            console.error("❌ Erro inesperado:", error);
            return false;
        }
    }
}

export const teamService = new TeamService();