"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { TeamMembers } from "@/components/team/TeamMembers";
import { TeamActivities } from "@/components/team/TeamActivities";
import { TeamSettings } from "@/components/team/TeamSettings";
import { PendingInvites } from "@/components/team/PendingInvites";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Activity, Settings, Mail, Loader2 } from "lucide-react";
import { teamService } from "@/lib/services/team/team.service";
import { Team } from "@/types/team";

export default function TeamDetailPage() {
    const params = useParams();
    const teamId = params.id as string;
    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTeam();
    }, [teamId]);

    const loadTeam = async () => {
        try {
            setLoading(true);
            const data = await teamService.getTeamById(teamId);
            setTeam(data);
        } catch (error) {
            console.error("Erro ao carregar time:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!team) {
        return (
            <Card>
                <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">Time não encontrado</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Cabeçalho do time */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
                <p className="text-muted-foreground">
                    Criado em {new Date(team.createdAt).toLocaleDateString('pt-BR')} • {team.memberCount} membros
                </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="members" className="space-y-4">
                <TabsList className="grid w-full max-w-2xl grid-cols-4">
                    <TabsTrigger value="members" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Membros
                    </TabsTrigger>
                    <TabsTrigger value="invites" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Convites
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Atividades
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Configurações
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="members" className="space-y-4">
                    <TeamMembers teamId={teamId} teamName={team.name} />
                </TabsContent>

                <TabsContent value="invites">
                    <PendingInvites teamId={teamId} />
                </TabsContent>

                <TabsContent value="activity">
                    <TeamActivities teamId={teamId} />
                </TabsContent>

                <TabsContent value="settings">
                    <TeamSettings team={team} onUpdate={loadTeam} />
                </TabsContent>
            </Tabs>
        </div>
    );
}