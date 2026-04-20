import { Resend } from 'resend';

// Verificar se a API key existe
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY não configurada. Funcionalidade de email desabilitada.");
}

export const resend = RESEND_API_KEY
    ? new Resend(RESEND_API_KEY)
    : null;

export const sendTeamInvitationEmail = async (email: string, teamName: string, token: string, inviterName: string) => {
    try {
        if (!resend) {
            console.warn("📧 Email não enviado: RESEND_API_KEY não configurada");
            return { success: false, error: "Email service not configured" };
        }

        const inviteLink = `${process.env.NEXTAUTH_URL}/invite/${token}`;

        const { data, error } = await resend.emails.send({
            from: 'AnalyticsPro <onboarding@resend.dev>',
            to: [email],
            subject: `Convite para participar do time ${teamName}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Convite para equipe</h2>
          <p>Olá!</p>
          <p><strong>${inviterName}</strong> convidou você para participar do time <strong>${teamName}</strong> no AnalyticsPro.</p>
          <p>Clique no botão abaixo para aceitar o convite:</p>
          <a href="${inviteLink}" 
             style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Aceitar Convite
          </a>
          <p>Este convite expira em 7 dias.</p>
          <p>Se você não esperava este convite, pode ignorar este email.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="color: #6b7280; font-size: 12px;">AnalyticsPro - Sua plataforma de análise de dados</p>
        </div>
      `,
        });

        if (error) {
            console.error("❌ Erro ao enviar email:", error);
            return { success: false, error };
        }

        console.log("✅ Email enviado com sucesso:", data?.id);
        return { success: true, data };
    } catch (error) {
        console.error("❌ Erro ao enviar email:", error);
        return { success: false, error };
    }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    try {
        if (!resend) {
            console.warn("📧 Email não enviado: RESEND_API_KEY não configurada");
            return { success: false, error: "Email service not configured" };
        }

        const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

        const { data, error } = await resend.emails.send({
            from: 'AnalyticsPro <onboarding@resend.dev>',
            to: [email],
            subject: 'Redefinir sua senha',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Redefinir senha</h2>
          <p>Olá!</p>
          <p>Recebemos uma solicitação para redefinir sua senha no AnalyticsPro.</p>
          <p>Clique no botão abaixo para criar uma nova senha:</p>
          <a href="${resetLink}" 
             style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Redefinir senha
          </a>
          <p>Este link expira em 1 hora.</p>
          <p>Se você não solicitou esta redefinição, ignore este email.</p>
        </div>
      `,
        });

        if (error) {
            console.error("❌ Erro ao enviar email:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error("❌ Erro ao enviar email:", error);
        return { success: false, error };
    }
};