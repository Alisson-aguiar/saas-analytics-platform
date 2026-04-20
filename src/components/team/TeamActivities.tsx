"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, UserPlus, UserMinus, Shield, Mail, Check, Settings } from "lucide-react";
import { activityService, TeamActivity } from "@/lib/services/team/activity.service";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TeamActivitiesProps {
    teamId: string;
}

const actionIcons = {
    member_added: UserPlus,
    member_removed: UserMinus,
    role_changed: Shield,
    team_updated: Settings,
    invitation_sent: Mail,
    invitation_accepted: Check,
};

const actionColors = {
    member_added: "text-green-600 bg-green-50",
    member_removed: "text-red-600 bg-red-50",
    role_changed: "text-blue-600 bg-blue-50",
    team_updated: "text-purple-600 bg-purple-50",
    invitation_sent: "text-yellow-600 bg-yellow-50",
    invitation_accepted: "text-emerald-600 bg-emerald-50",
};

export function TeamActivities({ teamId }: TeamActivitiesProps) {
    const [activities, setActivities] = useState<TeamActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadActivities();
    }, [teamId]);

    const loadActivities = async () => {
        try {
            setLoading(true);
            const data = await activityService.getTeamActivities(teamId);
            setActivities(data);
        } catch (error) {
            console.error("Erro ao carregar atividades:", error);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Atividades Recentes
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                    {activities.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            Nenhuma atividade registrada ainda
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activities.map((activity) => {
                                const Icon = actionIcons[activity.action] || Clock;
                                const colorClass = actionColors[activity.action] || "text-gray-600 bg-gray-50";

                                return (
                                    <div key={activity.id} className="flex items-start gap-3">
                                        <div className={`p-2 rounded-full ${colorClass}`}>
                                            <Icon className="h-4 w-4" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={`https://avatar.vercel.sh/${activity.userId}`} />
                                                    <AvatarFallback className="text-xs">
                                                        {getInitials(activity.userName)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-sm">{activity.userName}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {activity.action === 'member_added' && 'Adicionou membro'}
                                                    {activity.action === 'member_removed' && 'Removeu membro'}
                                                    {activity.action === 'role_changed' && 'Alterou papel'}
                                                    {activity.action === 'team_updated' && 'Atualizou time'}
                                                    {activity.action === 'invitation_sent' && 'Enviou convite'}
                                                    {activity.action === 'invitation_accepted' && 'Convite aceito'}
                                                </Badge>
                                            </div>

                                            <p className="text-sm text-muted-foreground">
                                                {activityService.getActionDescription(activity.action, activity.details)}
                                            </p>

                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatDistanceToNow(activity.createdAt, {
                                                    addSuffix: true,
                                                    locale: ptBR
                                                })}
                                            </p>

                                            {activity.details && Object.keys(activity.details).length > 0 && (
                                                <div className="mt-2 text-xs bg-muted p-2 rounded">
                                                    <pre className="whitespace-pre-wrap">
                                                        {JSON.stringify(activity.details, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}