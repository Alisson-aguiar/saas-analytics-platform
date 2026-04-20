"use client";

import { useState } from "react";
import { TeamMember } from "@/types/team";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Shield, UserMinus, Crown, User } from "lucide-react";
import { RoleBadge } from "./RoleBadge";
import { toast } from "sonner";

interface MemberCardProps {
    member: TeamMember;
    currentUserId: string;
    canManage: boolean;
    onRoleChange?: (memberId: string, newRole: 'admin' | 'member') => Promise<void>;
    onRemove?: (memberId: string) => Promise<void>;
    onUpdate?: () => void;
}

export function MemberCard({
    member,
    currentUserId,
    canManage,
    onRoleChange,
    onRemove,
    onUpdate
}: MemberCardProps) {
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isCurrentUser = member.userId === currentUserId;
    const isOwner = member.role === 'owner';

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleRoleChange = async (newRole: 'admin' | 'member') => {
        if (!onRoleChange) return;

        setIsLoading(true);
        try {
            await onRoleChange(member.id, newRole);
            toast.success('Papel atualizado', {
                description: `O papel foi alterado para ${newRole === 'admin' ? 'Administrador' : 'Membro'}`
            });
            onUpdate?.();
        } catch (error) {
            toast.error('Erro ao atualizar papel');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async () => {
        if (!onRemove) return;

        setIsLoading(true);
        try {
            await onRemove(member.id);
            toast.success('Membro removido', {
                description: `${member.user.name} foi removido do time`
            });
            setIsRemoveDialogOpen(false);
            onUpdate?.();
        } catch (error) {
            toast.error('Erro ao remover membro');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={member.user.avatar} />
                                <AvatarFallback>{getInitials(member.user.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium">
                                        {member.user.name}
                                        {isCurrentUser && <span className="text-muted-foreground ml-1 text-sm">(você)</span>}
                                    </p>
                                    <RoleBadge role={member.role} />
                                </div>
                                <p className="text-sm text-muted-foreground">{member.user.email}</p>
                            </div>
                        </div>

                        {canManage && !isOwner && !isCurrentUser && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" disabled={isLoading}>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Gerenciar membro</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleRoleChange('admin')}>
                                        <Shield className="h-4 w-4 mr-2" />
                                        Tornar Administrador
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRoleChange('member')}>
                                        <User className="h-4 w-4 mr-2" />
                                        Tornar Membro
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => setIsRemoveDialogOpen(true)}
                                    >
                                        <UserMinus className="h-4 w-4 mr-2" />
                                        Remover do time
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {isOwner && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                <Crown className="h-3 w-3 mr-1" />
                                Proprietário
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover membro</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover {member.user.name} do time?
                            Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRemove}
                            disabled={isLoading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isLoading ? 'Removendo...' : 'Remover'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}