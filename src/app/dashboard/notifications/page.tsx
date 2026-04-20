"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, CheckCheck, Trash2, Bell, BellRing, Loader2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const typeColors = {
    info: "bg-blue-100 text-blue-700 border-blue-200",
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    error: "bg-red-100 text-red-700 border-red-200",
    team: "bg-purple-100 text-purple-700 border-purple-200",
    report: "bg-indigo-100 text-indigo-700 border-indigo-200",
};

export default function NotificationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, loading, refresh } = useNotifications();
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    if (status === "unauthenticated") {
        router.push("/auth/login");
        return null;
    }

    const filteredNotifications = notifications.filter(n =>
        filter === 'all' || !n.read
    );

    const getTimeAgo = (date: Date) => {
        return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    };

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Notificações</h1>
                    <p className="text-muted-foreground">
                        Acompanhe todas as atividades e alertas importantes
                    </p>
                </div>
                <div className="flex gap-2">
                    {unreadCount > 0 && (
                        <Button variant="outline" onClick={markAllAsRead}>
                            <CheckCheck className="h-4 w-4 mr-2" />
                            Marcar todas como lidas ({unreadCount})
                        </Button>
                    )}
                    <Button variant="outline" onClick={refresh}>
                        <BellRing className="h-4 w-4 mr-2" />
                        Atualizar
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="space-y-4" onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
                <TabsList>
                    <TabsTrigger value="all" className="flex items-center gap-2">
                        Todas
                        <Badge variant="secondary">{notifications.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="flex items-center gap-2">
                        Não lidas
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-1">{unreadCount}</Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={filter}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                {filter === 'all' ? 'Todas as notificações' : 'Notificações não lidas'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : filteredNotifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Bell className="h-16 w-16 text-muted-foreground opacity-30" />
                                    <p className="mt-4 text-lg font-medium">Nenhuma notificação</p>
                                    <p className="text-sm text-muted-foreground">
                                        {filter === 'unread'
                                            ? 'Você não tem notificações não lidas'
                                            : 'Você não tem nenhuma notificação ainda'}
                                    </p>
                                </div>
                            ) : (
                                <ScrollArea className="h-[500px] pr-4">
                                    <div className="space-y-2">
                                        {filteredNotifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={cn(
                                                    "flex items-start justify-between p-4 rounded-lg border transition-all",
                                                    !notification.read && "bg-primary/5 border-primary/20",
                                                    typeColors[notification.type as keyof typeof typeColors]  
                                                )}
                                            >
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-semibold">{notification.title}</h4>
                                                        <Badge variant="outline" className="text-xs">
                                                            {notification.type === 'info' && 'Informação'}
                                                            {notification.type === 'success' && 'Sucesso'}
                                                            {notification.type === 'warning' && 'Aviso'}
                                                            {notification.type === 'error' && 'Erro'}
                                                            {notification.type === 'team' && 'Time'}
                                                            {notification.type === 'report' && 'Relatório'}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {getTimeAgo(notification.createdAt)}
                                                    </p>
                                                    {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                                                        <details className="mt-2">
                                                            <summary className="text-xs cursor-pointer text-muted-foreground">
                                                                Detalhes
                                                            </summary>
                                                            <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-auto">
                                                                {JSON.stringify(notification.metadata, null, 2)}
                                                            </pre>
                                                        </details>
                                                    )}
                                                </div>
                                                <div className="flex gap-1 ml-4">
                                                    {!notification.read && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => markAsRead(notification.id)}
                                                            title="Marcar como lida"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:text-red-600"
                                                        onClick={() => deleteNotification(notification.id)}
                                                        title="Remover"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}