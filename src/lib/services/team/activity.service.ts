import { supabase } from "@/lib/supabase/client";

export interface TeamActivity {
    id: string;
    teamId: string;
    userId: string;
    userName: string;
    action: 'member_added' | 'member_removed' | 'role_changed' | 'team_updated' | 'invitation_sent' | 'invitation_accepted';
    details: any;
    createdAt: Date;
}

export class ActivityService {
    async logActivity(teamId: string, userId: string, action: TeamActivity['action'], details: any = {}) {
        try {
            const { error } = await supabase
                .from('team_activities')
                .insert({
                    team_id: teamId,
                    user_id: userId,
                    action,
                    details
                });

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Erro ao registrar atividade:", error);
            return false;
        }
    }

    async getTeamActivities(teamId: string): Promise<TeamActivity[]> {
        try {
            const { data, error } = await supabase
                .from('team_activities')
                .select(`
          *,
          user:user_id (
            email,
            raw_user_meta_data
          )
        `)
                .eq('team_id', teamId)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            return (data || []).map(activity => ({
                id: activity.id,
                teamId: activity.team_id,
                userId: activity.user_id,
                userName: activity.user?.raw_user_meta_data?.full_name || 'Usuário',
                action: activity.action,
                details: activity.details,
                createdAt: new Date(activity.created_at)
            }));
        } catch (error) {
            console.error("Erro ao buscar atividades:", error);
            return [];
        }
    }

    getActionDescription(action: TeamActivity['action'], details: any): string {
        const descriptions: Record<TeamActivity['action'], string> = {
            member_added: `adicionou ${details.userName || 'um novo membro'} ao time`,
            member_removed: `removeu ${details.userName || 'um membro'} do time`,
            role_changed: `alterou o papel de ${details.userName} para ${details.newRole}`,
            team_updated: `atualizou as configurações do time`,
            invitation_sent: `enviou um convite para ${details.email}`,
            invitation_accepted: `${details.userName} aceitou o convite para entrar no time`
        };
        return descriptions[action] || 'realizou uma ação no time';
    }
}

export const activityService = new ActivityService();