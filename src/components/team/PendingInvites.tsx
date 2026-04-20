"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, X, RefreshCw, Clock } from "lucide-react";
import { invitationService } from "@/lib/services/team/invitation.service";
import { Invitation } from "@/types/team";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PendingInvitesProps {
    teamId: string;
    onUpdate?: () => void;
}

export function PendingInvites({ teamId, onUpdate }: PendingInvitesProps) {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInvitations();
    }, [teamId]);

    const loadInvitations = async () => {
        try {
            setLoading(true);
            const data = await invitationService.getTeamInvitations(teamId);
            setInvitations(data.filter(inv => inv.status === 'pending'));
        } catch (error) {
            console.error("Erro ao carregar convites:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (invitationId: string) => {
        try {
            const success = await invitationService.cancelInvitation(invitationId);
            if (success) {
                toast.success("Convite cancelado");
                await loadInvitations();
                onUpdate?.();
            }
        } catch (error) {
            toast.error("Erro ao cancelar convite");
        }
    };

    const handleResend = async (invitation: Invitation) => {
        try {
            const success = await invitationService.resendInvitation(invitation.id);
            if (success) {
                toast.success("Convite reenviado");
            }
        } catch (error) {
            toast.error("Erro ao reenviar convite");
        }
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
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Mail className="h-5 w-5" />
                    Convites Pendentes
                    {invitations.length > 0 && (
                        <Badge variant="secondary">{invitations.length}</Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {invitations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        Nenhum convite pendente
                    </div>
                ) : (
                    <div className="space-y-3">
                        {invitations.map((invite) => (
                            <div
                                key={invite.id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{invite.email}</span>
                                        <Badge variant="outline" className="text-xs">
                                            {invite.role === 'admin' ? 'Administrador' : 'Membro'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
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
                                        onClick={() => handleResend(invite)}
                                        title="Reenviar convite"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleCancel(invite.id)}
                                        title="Cancelar convite"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}