"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, Users, Eye, Edit, Trash2, Download, Upload, Lock } from "lucide-react";
import { teamService } from "@/lib/services/team/team.service";
import { Team, TeamMember } from "@/types/team";
import { toast } from "sonner";

export default function PermissionsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<string>("");
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTeams();
    }, [session?.user?.id]);

    useEffect(() => {
        if (selectedTeamId) {
            loadMembers(selectedTeamId);
        }
    }, [selectedTeamId]);

    const loadTeams = async () => {
        if (!session?.user?.id) return;

        try {
            const userTeams = await teamService.getUserTeams(session.user.id);
            setTeams(userTeams);
            if (userTeams.length > 0) {
                setSelectedTeamId(userTeams[0].id);
            }
        } catch (error) {
            console.error("Erro ao carregar times:", error);
        }
    };

    const loadMembers = async (teamId: string) => {
        try {
            setLoading(true);
            const data = await teamService.getTeamMembers(teamId);
            setMembers(data);
        } catch (error) {
            console.error("Erro ao carregar membros:", error);
        } finally {
            setLoading(false);
        }
    };

    const currentUserRole = members.find(m => m.userId === session?.user?.id)?.role;
    const canManagePermissions = currentUserRole === 'owner' || currentUserRole === 'admin';

    const permissionSections = [
        {
            title: "Visibilidade de Dados",
            icon: Eye,
            permissions: [
                { id: "view_analytics", label: "Ver análises", default: true },
                { id: "view_reports", label: "Ver relatórios", default: true },
                { id: "view_members", label: "Ver membros", default: true },
            ]
        },
        {
            title: "Edição e Criação",
            icon: Edit,
            permissions: [
                { id: "create_reports", label: "Criar relatórios", default: true },
                { id: "edit_reports", label: "Editar relatórios", default: false },
                { id: "create_analytics", label: "Criar análises", default: true },
            ]
        },
        {
            title: "Gerenciamento de Arquivos",
            icon: Upload,
            permissions: [
                { id: "upload_files", label: "Enviar arquivos", default: true },
                { id: "download_files", label: "Baixar arquivos", default: true },
                { id: "delete_files", label: "Deletar arquivos", default: false },
            ]
        },
        {
            title: "Administração",
            icon: Shield,
            permissions: [
                { id: "manage_members", label: "Gerenciar membros", default: false },
                { id: "manage_invites", label: "Gerenciar convites", default: false },
                { id: "manage_permissions", label: "Gerenciar permissões", default: false },
                { id: "delete_team", label: "Deletar time", default: false },
            ]
        },
    ];

    if (!session) {
        router.push("/auth/login");
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Seletor de Time */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Shield className="h-5 w-5" />
                        Selecionar Time
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                        <SelectTrigger className="w-full md:w-[300px]">
                            <SelectValue placeholder="Selecione um time" />
                        </SelectTrigger>
                        <SelectContent>
                            {teams.map((team) => (
                                <SelectItem key={team.id} value={team.id}>
                                    {team.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {selectedTeamId && (
                <>
                    {/* Aviso de permissão */}
                    {!canManagePermissions && (
                        <Alert>
                            <Lock className="h-4 w-4" />
                            <AlertDescription>
                                Apenas proprietários e administradores podem gerenciar permissões.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Tabs por papel */}
                    <Tabs defaultValue="member" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="member">Membro</TabsTrigger>
                            <TabsTrigger value="admin">Administrador</TabsTrigger>
                            <TabsTrigger value="owner">Proprietário</TabsTrigger>
                        </TabsList>

                        {['member', 'admin', 'owner'].map((role) => (
                            <TabsContent key={role} value={role} className="space-y-4">
                                {permissionSections.map((section) => (
                                    <Card key={section.title}>
                                        <CardHeader>
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <section.icon className="h-4 w-4" />
                                                {section.title} - {role === 'member' ? 'Membro' : role === 'admin' ? 'Administrador' : 'Proprietário'}
                                            </CardTitle>
                                            <CardDescription>
                                                {role === 'owner'
                                                    ? "Proprietários têm todas as permissões"
                                                    : `Configure as permissões para ${role === 'admin' ? 'administradores' : 'membros'}`
                                                }
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {section.permissions.map((perm) => (
                                                <div key={perm.id} className="flex items-center justify-between">
                                                    <Label htmlFor={`${role}-${perm.id}`} className="flex-1">
                                                        {perm.label}
                                                    </Label>
                                                    <Switch
                                                        id={`${role}-${perm.id}`}
                                                        defaultChecked={role === 'owner' ? true : perm.default}
                                                        disabled={!canManagePermissions || role === 'owner'}
                                                    />
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>
                        ))}
                    </Tabs>

                    {/* Botão Salvar */}
                    {canManagePermissions && (
                        <div className="flex justify-end">
                            <Button size="lg">
                                Salvar Permissões
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}