"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { invitationService } from "@/lib/services/team/invitation.service";

interface InviteMemberProps {
    teamId: string;
    teamName: string;
    onInviteSent?: () => void;
}

export function InviteMember({ teamId, teamName, onInviteSent }: InviteMemberProps) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<"admin" | "member">("member");
    const [isLoading, setIsLoading] = useState(false);

    const handleInvite = async () => {
        if (!email || !email.includes('@')) {
            toast.error('Email inválido', {
                description: 'Por favor, insira um email válido'
            });
            return;
        }

        setIsLoading(true);
        try {
            const invitation = await invitationService.createInvitation(teamId, email, role);

            if (invitation) {
                await invitationService.sendInvitationEmail(
                    invitation,
                    teamName,
                    'Administrador' // Idealmente, pegar o nome do usuário logado
                );

                toast.success('Convite enviado!', {
                    description: `Um convite foi enviado para ${email}`
                });

                setEmail("");
                setRole("member");
                setOpen(false);
                onInviteSent?.();
            } else {
                throw new Error('Falha ao criar convite');
            }
        } catch (error) {
            toast.error('Erro ao enviar convite', {
                description: 'Não foi possível enviar o convite. Tente novamente.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Convidar Membro
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background border-border">
                <DialogHeader>
                    <DialogTitle>Convidar para {teamName}</DialogTitle>
                    <DialogDescription>
                        Envie um convite por email para adicionar um novo membro ao time.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                placeholder="colaborador@email.com"
                                className="pl-9"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Papel</Label>
                        <Select value={role} onValueChange={(value: "admin" | "member") => setRole(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um papel" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="member">Membro</SelectItem>
                                <SelectItem value="admin">Administrador</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            {role === 'admin'
                                ? 'Administradores podem gerenciar membros e configurações do time.'
                                : 'Membros podem visualizar e colaborar nos projetos.'}
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button onClick={handleInvite} disabled={isLoading}>
                        {isLoading ? 'Enviando...' : 'Enviar Convite'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}