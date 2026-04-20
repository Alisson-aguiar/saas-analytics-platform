"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { TeamMember } from "@/types/team";
import { teamService } from "@/lib/services/team/team.service";
import { MemberCard } from "./MemberCard";
import { InviteMember } from "./InviteMember";
import { PendingInvites } from "./PendingInvites";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Shield, UserPlus, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface TeamMembersProps {
    teamId: string;
    teamName: string;
}

export function TeamMembers({ teamId, teamName }: TeamMembersProps) {
    const { data: session } = useSession();
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadMembers = async (showToast = false) => {
        try {
            if (showToast) setRefreshing(true);
            else setLoading(true);

            console.log("🔍 Carregando membros do time:", teamId);
            const data = await teamService.getTeamMembers(teamId);
            console.log("✅ Membros carregados:", data);
            setMembers(data);
        } catch (error) {
            console.error("❌ Erro ao carregar membros:", error);
            toast.error("Erro ao carregar membros");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (teamId) {
            loadMembers();
        }
    }, [teamId]);

    const handleRoleChange = async (memberId: string, newRole: 'admin' | 'member') => {
        try {
            const success = await teamService.updateMemberRole(memberId, newRole);
            if (success) {
                toast.success("Papel atualizado", {
                    description: `O papel do membro foi alterado para ${newRole === 'admin' ? 'Administrador' : 'Membro'}`
                });
                await loadMembers(true);
            }
        } catch (error) {
            toast.error("Erro ao atualizar papel");
        }
    };

    const handleRemove = async (memberId: string) => {
        try {
            const success = await teamService.removeMember(memberId);
            if (success) {
                toast.success("Membro removido", {
                    description: "O membro foi removido do time"
                });
                await loadMembers(true);
            }
        } catch (error) {
            toast.error("Erro ao remover membro");
        }
    };

    const canManage = members.some(
        m => m.userId === session?.user?.id && (m.role === 'owner' || m.role === 'admin')
    );

    const isOwner = members.some(
        m => m.userId === session?.user?.id && m.role === 'owner'
    );

    const owners = members.filter(m => m.role === 'owner');
    const admins = members.filter(m => m.role === 'admin');
    const regularMembers = members.filter(m => m.role === 'member');

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Carregando membros...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Cabeçalho com ações */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Membros do Time</h2>
                    <p className="text-muted-foreground">
                        {members.length} {members.length === 1 ? 'membro' : 'membros'} no total
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => loadMembers(true)}
                        disabled={refreshing}
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    </Button>
                    {canManage && (
                        <InviteMember teamId={teamId} teamName={teamName} onInviteSent={() => loadMembers(true)} />
                    )}
                </div>
            </div>

            {/* Estatísticas rápidas */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Shield className="h-4 w-4 text-amber-500" />
                            Proprietários
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{owners.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {owners.map(o => o.user.name).join(', ')}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-500" />
                            Administradores
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{admins.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {admins.map(a => a.user.name).join(', ')}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            Membros
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{regularMembers.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {regularMembers.map(m => m.user.name).join(', ')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs de visualização */}
            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">Todos ({members.length})</TabsTrigger>
                    <TabsTrigger value="admins">Administradores ({owners.length + admins.length})</TabsTrigger>
                    <TabsTrigger value="members">Membros ({regularMembers.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    {members.map((member) => (
                        <MemberCard
                            key={member.id}
                            member={member}
                            currentUserId={session?.user?.id || ''}
                            canManage={canManage}
                            
                            onRoleChange={handleRoleChange}
                            onRemove={handleRemove}
                            onUpdate={() => loadMembers(true)}
                        />
                    ))}
                </TabsContent>

                <TabsContent value="admins" className="space-y-4">
                    {[...owners, ...admins].map((member) => (
                        <MemberCard
                            key={member.id}
                            member={member}
                            currentUserId={session?.user?.id || ''}
                            canManage={canManage}
                            
                            onRoleChange={handleRoleChange}
                            onRemove={handleRemove}
                            onUpdate={() => loadMembers(true)}
                        />
                    ))}
                </TabsContent>

                <TabsContent value="members" className="space-y-4">
                    {regularMembers.map((member) => (
                        <MemberCard
                            key={member.id}
                            member={member}
                            currentUserId={session?.user?.id || ''}
                            canManage={canManage}
                            
                            onRoleChange={handleRoleChange}
                            onRemove={handleRemove}
                            onUpdate={() => loadMembers(true)}
                        />
                    ))}
                </TabsContent>
            </Tabs>

            {/* Seção de Convites - só para admins */}
            {canManage && (
                <div className="mt-8">
                    <PendingInvites teamId={teamId} onUpdate={() => loadMembers(true)} />
                </div>
            )}
        </div>
    );
}