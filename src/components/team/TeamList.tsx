"use client";

import { Team } from "@/types/team";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface TeamListProps {
    teams: Team[];
    onTeamUpdate?: () => void;
}

export function TeamList({ teams, onTeamUpdate }: TeamListProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
                <Card key={team.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            {team.name}
                        </CardTitle>
                        <CardDescription>
                            Criado em {new Date(team.createdAt).toLocaleDateString('pt-BR')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Membros:</span>
                            <span className="font-medium">{team.memberCount || 0}</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}