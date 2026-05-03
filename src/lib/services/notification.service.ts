import { supabase, supabaseAdmin } from "@/lib/supabase/client";

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'team' | 'report';
    read: boolean;
    metadata: any;
    createdAt: Date;
}

export class NotificationService {
    // Buscar UUID do usuário pelo email
    private async getUserId(identifier: string): Promise<string | null> {
        // Se já for um UUID válido, retorna
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(identifier)) {
            return identifier;
        }

        // Buscar diretamente no auth.users (mais confiável)
        const { data: authData, error: authError } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', identifier)
            .maybeSingle();

        if (authError) {
            console.error("❌ Erro ao buscar no auth.users:", authError);
        }

        if (authData) {
            console.log("✅ Usuário encontrado no auth.users:", authData.id);
            return authData.id;
        }

        // Tentar buscar no profiles como fallback
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', identifier)
            .maybeSingle();

        if (profileError) {
            console.error("❌ Erro ao buscar no profiles:", profileError);
        }

        if (profileData) {
            console.log("✅ Usuário encontrado no profiles:", profileData.id);
            return profileData.id;
        }

        console.error("❌ Usuário não encontrado em nenhuma tabela:", identifier);
        return null;
    }

    async getUserNotifications(userId: string): Promise<Notification[]> {
        try {
            const realUserId = await this.getUserId(userId);
            if (!realUserId) {
                console.log("⚠️ Usuário não encontrado:", userId);
                return [];
            }

            console.log("🔍 Buscando notificações para:", realUserId);

            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', realUserId)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) {
                console.error("❌ Erro ao buscar:", error);
                return [];
            }

            console.log("✅ Notificações encontradas:", data?.length);

            return (data || []).map(n => ({
                id: n.id,
                userId: n.user_id,
                title: n.title,
                message: n.message,
                type: n.type,
                read: n.read,
                metadata: n.metadata || {},
                createdAt: new Date(n.created_at)
            }));
        } catch (error) {
            console.error("❌ Erro:", error);
            return [];
        }
    }

    async getUnreadCount(userId: string): Promise<number> {
        try {
            const realUserId = await this.getUserId(userId);
            if (!realUserId) return 0;

            const { count, error } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', realUserId)
                .eq('read', false);

            if (error) throw error;
            return count || 0;
        } catch (error) {
            console.error("Erro:", error);
            return 0;
        }
    }

    async markAsRead(notificationId: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', notificationId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Erro:", error);
            return false;
        }
    }

    async markAllAsRead(userId: string): Promise<boolean> {
        try {
            const realUserId = await this.getUserId(userId);
            if (!realUserId) return false;

            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', realUserId)
                .eq('read', false);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Erro:", error);
            return false;
        }
    }

    async deleteNotification(notificationId: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', notificationId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Erro:", error);
            return false;
        }
    }

    async createNotification(userId: string, data: {
        title: string;
        message: string;
        type: Notification['type'];
        metadata?: any;
    }): Promise<Notification | null> {
        try {
            const realUserId = await this.getUserId(userId);
            if (!realUserId) {
                console.error("❌ Usuário não encontrado para criar notificação:", userId);
                return null;
            }

            const { data: notification, error } = await supabaseAdmin
                .from('notifications')
                .insert({
                    user_id: realUserId,
                    title: data.title,
                    message: data.message,
                    type: data.type,
                    metadata: data.metadata || {}
                })
                .select()
                .single();

            if (error) throw error;

            return {
                id: notification.id,
                userId: notification.user_id,
                title: notification.title,
                message: notification.message,
                type: notification.type,
                read: notification.read,
                metadata: notification.metadata,
                createdAt: new Date(notification.created_at)
            };
        } catch (error) {
            console.error("Erro ao criar notificação:", error);
            return null;
        }
    }
}

export const notificationService = new NotificationService();