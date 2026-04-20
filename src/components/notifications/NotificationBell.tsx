"use client";

import { useState } from "react";
import { Bell, Check, X, BellRing, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const typeColors: Record<string, string> = {
    info: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    team: "bg-purple-500",
    report: "bg-indigo-500",
};

const typeIcons: Record<string, string> = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
    team: "👥",
    report: "📊",
};

export function NotificationBell() {
    const [open, setOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, loading } = useNotifications();

    const getTimeAgo = (date: Date) => {
        return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button className="relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="w-96 p-0 border rounded-lg shadow-lg"
                style={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))'
                }}
                align="end"
            >
                <div
                    className="flex items-center justify-between border-b p-3"
                    style={{ borderBottomColor: 'hsl(var(--border))' }}
                >
                    <div className="flex items-center gap-2">
                        <BellRing className="h-4 w-4" />
                        <h4 className="font-semibold">Notificações</h4>
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                                {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                            </Badge>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="h-8 gap-1 text-xs"
                        >
                            <CheckCheck className="h-3 w-3" />
                            Marcar todas como lidas
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Bell className="h-12 w-12 text-muted-foreground opacity-50" />
                            <p className="mt-2 text-sm text-muted-foreground">
                                Nenhuma notificação
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Você será notificado quando houver novidades
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y" style={{ borderColor: 'hsl(var(--border))' }}>
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "group relative p-4 transition-colors hover:bg-muted/50",
                                        !notification.read && "bg-primary/5"
                                    )}
                                >
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0">
                                            <div className={cn(
                                                "h-2 w-2 rounded-full mt-2",
                                                typeColors[notification.type],
                                                notification.read && "opacity-50"
                                            )} />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">
                                                    {notification.title}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {typeIcons[notification.type]}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {getTimeAgo(notification.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                            {!notification.read && (
                                                <button
                                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-6 w-6"
                                                    onClick={() => markAsRead(notification.id)}
                                                >
                                                    <Check className="h-3 w-3" />
                                                </button>
                                            )}
                                            <button
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-6 w-6"
                                                onClick={() => deleteNotification(notification.id)}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {notifications.length > 0 && (
                    <div
                        className="border-t p-3 text-center"
                        style={{ borderTopColor: 'hsl(var(--border))' }}
                    >
                        <Button
                            variant="link"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                                setOpen(false);
                                window.location.href = '/dashboard/notifications';
                            }}
                        >
                            Ver todas as notificações
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}