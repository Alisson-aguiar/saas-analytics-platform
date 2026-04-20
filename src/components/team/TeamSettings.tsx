"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Team } from "@/types/team";
import { teamService } from "@/lib/services/team/team.service";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  Trash2,
  LogOut,
  AlertCircle,
  Users,
  Calendar,
  Hash,
  Shield,
  Mail,
  Lock
} from "lucide-react";

interface TeamSettingsProps {
  team: Team;
  onUpdate?: () => void;
}

export function TeamSettings({ team, onUpdate }: TeamSettingsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [teamName, setTeamName] = useState(team.name);
  const [defaultRole, setDefaultRole] = useState<"admin" | "member">("member");
  const [allowInvites, setAllowInvites] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = team.ownerId === session?.user?.id;
  const canManage = isOwner;

  const handleUpdateTeam = async () => {
    if (!teamName.trim() || teamName === team.name) return;

    setIsLoading(true);
    try {
      // Simular atualização (implementar depois)
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Time atualizado", {
        description: `O nome foi alterado para ${teamName}`
      });
      onUpdate?.();
    } catch (error) {
      toast.error("Erro ao atualizar time");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    if (!session?.user?.id) return;

    setIsLeaving(true);
    try {
      const success = await teamService.leaveTeam(team.id, session.user.id);
      if (success) {
        toast.success("Você saiu do time", {
          description: `Você não é mais membro de ${team.name}`
        });
        router.push("/dashboard/team");
      }
    } catch (error) {
      toast.error("Erro ao sair do time");
    } finally {
      setIsLeaving(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!session?.user?.id) return;

    setIsDeleting(true);
    try {
      const success = await teamService.deleteTeam(team.id, session.user.id);
      if (success) {
        toast.success("Time deletado", {
          description: `${team.name} foi removido permanentemente`
        });
        router.push("/dashboard/team");
      }
    } catch (error) {
      toast.error("Erro ao deletar time");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Informações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Informações do Time
          </CardTitle>
          <CardDescription>
            Gerencie as configurações básicas do seu time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Time</Label>
            <div className="flex gap-2">
              <Input
                id="name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                disabled={!canManage || isLoading}
                className="flex-1"
              />
              {canManage && teamName !== team.name && (
                <Button
                  onClick={handleUpdateTeam}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Salvar
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="h-4 w-4" />
                ID do Time
              </Label>
              <div className="p-2 bg-muted rounded-md font-mono text-sm">
                {team.id}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Data de Criação
              </Label>
              <div className="p-2 bg-muted rounded-md text-sm">
                {new Date(team.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              Total de Membros
            </Label>
            <div className="p-2 bg-muted rounded-md">
              {team.memberCount || 0} membros
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Membros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Configurações de Membros
          </CardTitle>
          <CardDescription>
            Configure permissões e políticas para novos membros
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="defaultRole">Papel padrão para novos membros</Label>
            <Select
              value={defaultRole}
              onValueChange={(value: "admin" | "member") => setDefaultRole(value)}
              disabled={!canManage}
            >
              <SelectTrigger id="defaultRole" className="w-full md:w-[200px]">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Membro</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Define qual papel será atribuído automaticamente quando novos membros entrarem no time
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allowInvites" className="text-base">
                Permitir convites
              </Label>
              <p className="text-sm text-muted-foreground">
                Membros podem enviar convites para novas pessoas
              </p>
            </div>
            <Switch
              id="allowInvites"
              checked={allowInvites}
              onCheckedChange={setAllowInvites}
              disabled={!canManage}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="publicTeam" className="text-base">
                Time público
              </Label>
              <p className="text-sm text-muted-foreground">
                Qualquer pessoa pode solicitar entrada no time
              </p>
            </div>
            <Switch
              id="publicTeam"
              checked={false}
              disabled={!canManage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Notificações
          </CardTitle>
          <CardDescription>
            Configure como você deseja ser notificado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications" className="text-base">
                Notificações por email
              </Label>
              <p className="text-sm text-muted-foreground">
                Receba emails sobre atividades do time
              </p>
            </div>
            <Switch id="emailNotifications" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="memberJoined" className="text-base">
                Novos membros
              </Label>
              <p className="text-sm text-muted-foreground">
                Seja notificado quando alguém entrar no time
              </p>
            </div>
            <Switch id="memberJoined" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="roleChanges" className="text-base">
                Mudanças de cargo
              </Label>
              <p className="text-sm text-muted-foreground">
                Seja notificado quando cargos forem alterados
              </p>
            </div>
            <Switch id="roleChanges" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Zona de Perigo */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Zona de Perigo
          </CardTitle>
          <CardDescription>
            Ações irreversíveis que afetam permanentemente o time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sair do Time (para não-owners) */}
          {!isOwner && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair deste time
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sair do time?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Você está prestes a sair do time <strong>{team.name}</strong>.
                    Você perderá acesso a todos os projetos e recursos compartilhados.
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isLeaving}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLeaveTeam}
                    disabled={isLeaving}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isLeaving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {isLeaving ? 'Saindo...' : 'Sair do time'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Deletar Time (apenas owner) */}
          {isOwner && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Deletar time permanentemente
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Você está prestes a deletar o time <strong>{team.name}</strong>.
                    <br />
                    <br />
                    Esta ação:
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Removerá permanentemente o time e todos os seus dados</li>
                      <li>Expulsará todos os membros do time</li>
                      <li>Deletará todos os relatórios e projetos associados</li>
                      <li>Não pode ser desfeita</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteTeam}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {isDeleting ? 'Deletando...' : 'Sim, deletar time'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardContent>
      </Card>

      {/* Aviso para não-owners */}
      {!canManage && (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            Apenas o proprietário do time pode alterar as configurações.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}