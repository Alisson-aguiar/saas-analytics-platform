"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Send, X, RefreshCw, Check, Clock } from "lucide-react";
import { invitationService } from "@/lib/services/team/invitation.service";
import { teamService } from "@/lib/services/team/team.service";
import { Invitation, Team } from "@/types/team";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function InvitesPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<string>("");
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<"admin" | "member">("member");

    useEffect(() => {
        loadTeams();
    }, [session?.user?.id]);

    useEffect(() => {
        if (selectedTeamId) {
            loadInvitations(selectedTeamId);
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

    const loadInvitations = async (teamId: string) => {
        try {
            setLoading(true);
            const data = await invitationService.getTeamInvitations(teamId);
            setInvitations(data);
        } catch (error) {
            console.error("Erro ao carregar convites:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendInvite = async () => {
        if (!selectedTeamId || !email) return;

        setSending(true);
        try {
            const invitation = await invitationService.createInvitation(selectedTeamId, email, role);

            if (invitation) {
                const team = teams.find(t => t.id === selectedTeamId);
                await invitationService.sendInvitationEmail(
                    invitation,
                    team?.name || "Time",
                    session?.user?.name || "Um administrador"
                );

                toast.success("Convite enviado!", {
                    description: `Um convite foi enviado para ${email}`
                });

                setEmail("");
                await loadInvitations(selectedTeamId);
            }
        } catch (error) {
            toast.error("Erro ao enviar convite");
        } finally {
            setSending(false);
        }
    };

    const handleCancelInvite = async (invitationId: string) => {
        try {
            const success = await invitationService.cancelInvitation(invitationId);
            if (success) {
                toast.success("Convite cancelado");
                await loadInvitations(selectedTeamId);
            }
        } catch (error) {
            toast.error("Erro ao cancelar convite");
        }
    };

    const handleResendInvite = async (invitation: Invitation) => {
        try {
            const success = await invitationService.resendInvitation(invitation.id);
            if (success) {
                toast.success("Convite reenviado");
            }
        } catch (error) {
            toast.error("Erro ao reenviar convite");
        }
    };

    const pendingInvites = invitations.filter(inv => inv.status === 'pending');
    const acceptedInvites = invitations.filter(inv => inv.status === 'accepted');
    const expiredInvites = invitations.filter(inv => inv.status === 'expired');

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
                        <Mail className="h-5 w-5" />
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
                                    {team.name} ({team.memberCount} membros)
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {selectedTeamId && (
                <>
                    {/* Formulário de Convite */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Enviar Novo Convite</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative mt-1">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="colaborador@email.com"
                                            className="pl-9"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-[200px]">
                                    <Label htmlFor="role">Papel</Label>
                                    <Select value={role} onValueChange={(value: "admin" | "member") => setRole(value)}>
                                        <SelectTrigger id="role" className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="member">Membro</SelectItem>
                                            <SelectItem value="admin">Administrador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        onClick={handleSendInvite}
                                        disabled={sending || !email}
                                        className="w-full md:w-auto"
                                    >
                                        {sending ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                            <Send className="h-4 w-4 mr-2" />
                                        )}
                                        Enviar Convite
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lista de Convites */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Convites</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => loadInvitations(selectedTeamId)}
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="pending">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="pending">
                                        Pendentes ({pendingInvites.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="accepted">
                                        Aceitos ({acceptedInvites.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="expired">
                                        Expirados ({expiredInvites.length})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="pending" className="space-y-4 mt-4">
                                    {loading ? (
                                        <div className="flex justify-center py-8">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        </div>
                                    ) : pendingInvites.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            Nenhum convite pendente
                                        </div>
                                    ) : (
                                        pendingInvites.map((invite) => (
                                            <div
                                                key={invite.id}
                                                className="flex items-center justify-between p-4 border rounded-lg"
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">{invite.email}</span>
                                                        <Badge variant="outline">
                                                            {invite.role === 'admin' ? 'Administrador' : 'Membro'}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        Expira em {formatDistanceToNow(invite.expiresAt, {
                                                            addSuffix: true,
                                                            locale: ptBR
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleResendInvite(invite)}
                                                        title="Reenviar"
                                                    >
                                                        <RefreshCw className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleCancelInvite(invite.id)}
                                                        title="Cancelar"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </TabsContent>

                                <TabsContent value="accepted" className="space-y-4 mt-4">
                                    {acceptedInvites.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            Nenhum convite aceito
                                        </div>
                                    ) : (
                                        acceptedInvites.map((invite) => (
                                            <div
                                                key={invite.id}
                                                className="flex items-center justify-between p-4 border rounded-lg bg-green-50"
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <Check className="h-4 w-4 text-green-600" />
                                                        <span className="font-medium">{invite.email}</span>
                                                        <Badge variant="outline" className="bg-green-100">
                                                            Aceito
                                                        </Badge>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground mt-1">
                                                        {formatDistanceToNow(invite.createdAt, {
                                                            addSuffix: true,
                                                            locale: ptBR
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </TabsContent>

                                <TabsContent value="expired" className="space-y-4 mt-4">
                                    {expiredInvites.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            Nenhum convite expirado
                                        </div>
                                    ) : (
                                        expiredInvites.map((invite) => (
                                            <div
                                                key={invite.id}
                                                className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <X className="h-4 w-4 text-gray-600" />
                                                        <span className="font-medium text-gray-600">{invite.email}</span>
                                                        <Badge variant="outline" className="bg-gray-100">
                                                            Expirado
                                                        </Badge>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground mt-1">
                                                        Expirou {formatDistanceToNow(invite.expiresAt, {
                                                            addSuffix: true,
                                                            locale: ptBR
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}