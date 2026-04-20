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
    async getUserNotifications(userId: string): Promise<Notification[]> {
        try {
            console.log("🔍 Buscando notificações via API para:", userId);

            // Usar a API do Next.js em vez do Supabase diretamente
            const response = await fetch('/api/notifications');
            const data = await response.json();

            console.log("📊 Resposta da API:", data);

            if (!data.success) {
                throw new Error(data.error);
            }

            return (data.notifications || []).map((n: any) => ({
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
            console.error("❌ Erro ao buscar notificações:", error);
            return [];
        }
    }

    async getUnreadCount(userId: string): Promise<number> {
        try {
            const notifications = await this.getUserNotifications(userId);
            return notifications.filter(n => !n.read).length;
        } catch (error) {
            console.error("Erro:", error);
            return 0;
        }
    }

    async markAsRead(notificationId: string): Promise<boolean> {
        try {
            const response = await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'PUT'
            });
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error("Erro:", error);
            return false;
        }
    }

    async markAllAsRead(userId: string): Promise<boolean> {
        try {
            const response = await fetch('/api/notifications/read-all', {
                method: 'PUT'
            });
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error("Erro:", error);
            return false;
        }
    }

    async deleteNotification(notificationId: string): Promise<boolean> {
        try {
            const response = await fetch(`/api/notifications/${notificationId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error("Erro:", error);
            return false;
        }
    }
}

export const notificationService = new NotificationService();