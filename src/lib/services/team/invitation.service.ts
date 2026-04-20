import { supabase, supabaseAdmin } from "@/lib/supabase/client";
import { Invitation } from "@/types/team";
import { v4 as uuidv4 } from 'uuid';
import { sendTeamInvitationEmail } from "@/lib/resend"; // ✅ Apenas esta importação

export class InvitationService {
    // Criar convite
    async createInvitation(teamId: string, email: string, role: 'admin' | 'member'): Promise<Invitation | null> {
        try {
            const token = uuidv4();
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias de validade

            const { data, error } = await supabaseAdmin
                .from('team_invitations')
                .insert({
                    team_id: teamId,
                    email,
                    role,
                    token,
                    expires_at: expiresAt.toISOString(),
                    status: 'pending'
                })
                .select()
                .single();

            if (error) throw error;

            return {
                id: data.id,
                teamId: data.team_id,
                email: data.email,
                role: data.role,
                token: data.token,
                status: data.status,
                expiresAt: new Date(data.expires_at),
                createdAt: new Date(data.created_at)
            };
        } catch (error) {
            console.error("Erro ao criar convite:", error);
            return null;
        }
    }

    // Enviar convite por email
    async sendInvitationEmail(invitation: Invitation, teamName: string, inviterName: string): Promise<boolean> {
        try {
            // ✅ Usar APENAS a função sendTeamInvitationEmail
            const result = await sendTeamInvitationEmail(
                invitation.email,
                teamName,
                invitation.token,
                inviterName
            );

            return result.success;
        } catch (error) {
            console.error("Erro ao enviar email:", error);
            return false;
        }
    }

    // Buscar convites do time
    async getTeamInvitations(teamId: string): Promise<Invitation[]> {
        try {
            const { data, error } = await supabase
                .from('team_invitations')
                .select('*')
                .eq('team_id', teamId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return (data || []).map(inv => ({
                id: inv.id,
                teamId: inv.team_id,
                email: inv.email,
                role: inv.role,
                token: inv.token,
                status: inv.status,
                expiresAt: new Date(inv.expires_at),
                createdAt: new Date(inv.created_at)
            }));
        } catch (error) {
            console.error("Erro ao buscar convites:", error);
            return [];
        }
    }

    // Aceitar convite
    async acceptInvitation(token: string, userId: string): Promise<boolean> {
        try {
            // Buscar convite
            const { data: invitation, error: fetchError } = await supabase
                .from('team_invitations')
                .select('*')
                .eq('token', token)
                .eq('status', 'pending')
                .single();

            if (fetchError || !invitation) {
                throw new Error("Convite inválido ou expirado");
            }

            // Verificar se não expirou
            if (new Date(invitation.expires_at) < new Date()) {
                await supabaseAdmin
                    .from('team_invitations')
                    .update({ status: 'expired' })
                    .eq('id', invitation.id);

                throw new Error("Convite expirado");
            }

            // Adicionar usuário ao time
            const { error: memberError } = await supabaseAdmin
                .from('team_members')
                .insert({
                    team_id: invitation.team_id,
                    user_id: userId,
                    role: invitation.role
                });

            if (memberError) throw memberError;

            // Atualizar status do convite
            await supabaseAdmin
                .from('team_invitations')
                .update({ status: 'accepted' })
                .eq('id', invitation.id);

            return true;
        } catch (error) {
            console.error("Erro ao aceitar convite:", error);
            return false;
        }
    }

    // Cancelar convite
    async cancelInvitation(invitationId: string): Promise<boolean> {
        try {
            const { error } = await supabaseAdmin
                .from('team_invitations')
                .delete()
                .eq('id', invitationId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Erro ao cancelar convite:", error);
            return false;
        }
    }

    // Reenviar convite
    async resendInvitation(invitationId: string): Promise<boolean> {
        try {
            // Buscar convite
            const { data: invitation, error: fetchError } = await supabase
                .from('team_invitations')
                .select('*, team:team_id(name)')
                .eq('id', invitationId)
                .single();

            if (fetchError || !invitation) {
                throw new Error("Convite não encontrado");
            }

            // Atualizar data de expiração
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

            const { error: updateError } = await supabaseAdmin
                .from('team_invitations')
                .update({
                    expires_at: expiresAt.toISOString(),
                    status: 'pending'
                })
                .eq('id', invitationId);

            if (updateError) throw updateError;

            // Reenviar email
            await this.sendInvitationEmail(
                {
                    id: invitation.id,
                    teamId: invitation.team_id,
                    email: invitation.email,
                    role: invitation.role,
                    token: invitation.token,
                    status: invitation.status,
                    expiresAt: new Date(invitation.expires_at),
                    createdAt: new Date(invitation.created_at)
                },
                invitation.team.name,
                'Administrador'
            );

            return true;
        } catch (error) {
            console.error("Erro ao reenviar convite:", error);
            return false;
        }
    }
}

export const invitationService = new InvitationService();