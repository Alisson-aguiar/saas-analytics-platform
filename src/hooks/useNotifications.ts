"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase/client";
import { notificationService, Notification } from "@/lib/services/notification.service";
import { toast } from "sonner";

export function useNotifications() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [realtimeChannel, setRealtimeChannel] = useState<any>(null);

    const loadNotifications = useCallback(async () => {
        if (!session?.user?.email && !session?.user?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            // Usar email como identificador (mais confiável que o ID do Google)
            const identifier = session.user.email || session.user.id;
            const [data, count] = await Promise.all([
                notificationService.getUserNotifications(identifier),
                notificationService.getUnreadCount(identifier)
            ]);
            setNotifications(data);
            setUnreadCount(count);
        } catch (error) {
            console.error("Erro ao carregar notificações:", error);
        } finally {
            setLoading(false);
        }
    }, [session?.user?.email, session?.user?.id]);

    const markAsRead = useCallback(async (notificationId: string) => {
        const success = await notificationService.markAsRead(notificationId);
        if (success) {
            setNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId ? { ...n, read: true } : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
        return success;
    }, []);

    const markAllAsRead = useCallback(async () => {
        if (!session?.user?.email) return false;
        const success = await notificationService.markAllAsRead(session.user.email);
        if (success) {
            setNotifications(prev =>
                prev.map(n => ({ ...n, read: true }))
            );
            setUnreadCount(0);
            toast.success("Todas as notificações marcadas como lidas");
        }
        return success;
    }, [session?.user?.email]);

    const deleteNotification = useCallback(async (notificationId: string) => {
        const success = await notificationService.deleteNotification(notificationId);
        if (success) {
            const deleted = notifications.find(n => n.id === notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            if (deleted && !deleted.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
            toast.success("Notificação removida");
        }
        return success;
    }, [notifications]);

    // Configurar inscrição em tempo real
    useEffect(() => {
        if (!session?.user?.email) return;

        const setupRealtime = async () => {
            const identifier = session.user.email || session.user.id;
            const realUserId = await notificationService['getUserId'](identifier);

            if (!realUserId) return;

            loadNotifications();

            const channel = supabase
                .channel(`notifications-${realUserId}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${realUserId}`
                    },
                    (payload: any) => {
                        const newNotification = payload.new;
                        const notification: Notification = {
                            id: newNotification.id,
                            userId: newNotification.user_id,
                            title: newNotification.title,
                            message: newNotification.message,
                            type: newNotification.type,
                            read: newNotification.read,
                            metadata: newNotification.metadata || {},
                            createdAt: new Date(newNotification.created_at)
                        };

                        setNotifications(prev => [notification, ...prev]);
                        setUnreadCount(prev => prev + 1);

                        toast.info(notification.title, {
                            description: notification.message,
                            duration: 5000,
                            action: {
                                label: "Ver",
                                onClick: () => window.location.href = '/dashboard/notifications'
                            }
                        });
                    }
                )
                .subscribe();

            setRealtimeChannel(channel);

            return () => {
                if (channel) {
                    supabase.removeChannel(channel);
                }
            };
        };

        setupRealtime();
    }, [session?.user?.email, loadNotifications]);

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refresh: loadNotifications
    };
}