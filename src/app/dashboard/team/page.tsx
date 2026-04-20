"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; // ✅ CardContent (com C maiúsculo)
import { TeamList } from "@/components/team/TeamList";
import { CreateTeamDialog } from "@/components/team/CreateTeamDialog";
import { teamService } from "@/lib/services/team/team.service";
import { Team } from "@/types/team";
import { toast } from "sonner";

export default function TeamPage() {
    const { data: session } = useSession(); 
    const [teams, setTeams] = useState<Team[]>([]); 
    const [loading, setLoading] = useState(true); 
    const [createDialogOpen, setCreateDialogOpen] = useState(false); 

    const loadTeams = async () => {
        if (!session?.user?.id) return;

        try {
            setLoading(true);
            const userTeams = await teamService.getUserTeams(session.user.id);
            setTeams(userTeams);
        } catch (error) {
            console.error("Erro ao carregar times:", error);
            toast.error("Erro ao carregar times");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTeams();
    }, [session?.user?.id]);

    const handleCreateTeam = async (name: string) => {
        if (!session?.user?.id) return;

        try {
            const newTeam = await teamService.createTeam(session.user.id, name);
            if (newTeam) {
                toast.success("Time criado!", {
                    description: `O time ${name} foi criado com sucesso.`
                });
                await loadTeams();
                setCreateDialogOpen(false);
            }
        } catch (error) {
            toast.error("Erro ao criar time");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Cabeçalho com ação */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Meus Times</h2>
                    <p className="text-muted-foreground">
                        Gerencie os times que você participa
                    </p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Novo Time
                </Button>
            </div>

            {/* Lista de times */}
            {teams.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Users className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium">Nenhum time ainda</p>
                        <p className="text-sm text-gray-500 mb-4">
                            Crie seu primeiro time para começar a colaborar
                        </p>
                        <Button onClick={() => setCreateDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Criar Primeiro Time
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <TeamList teams={teams} onTeamUpdate={loadTeams} />
            )}

            <CreateTeamDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onCreateTeam={handleCreateTeam}
            />
        </div>
    );
}