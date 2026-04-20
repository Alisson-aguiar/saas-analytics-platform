"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import {
    Loader2,
    Plus,
    Trash2,
    RefreshCw,
    Copy,
    CheckCircle,
    XCircle,
    WebhookIcon,
    Zap,
    Eye
} from "lucide-react";
import { webhookService, Webhook } from "@/lib/services/webhook.service";

const eventOptions = [
    { value: "report.created", label: "📊 Relatório Criado" },
    { value: "report.updated", label: "✏️ Relatório Atualizado" },
    { value: "report.deleted", label: "🗑️ Relatório Deletado" },
    { value: "data.uploaded", label: "📁 Dados Enviados" },
    { value: "data.processed", label: "⚙️ Dados Processados" },
    { value: "team.member_added", label: "👥 Membro Adicionado" },
    { value: "team.member_removed", label: "👥 Membro Removido" },
    { value: "user.login", label: "🔐 Login Realizado" },
    { value: "user.logout", label: "🚪 Logout Realizado" },
];

export default function WebhooksPage() {
    const { data: session } = useSession();
    const [webhooks, setWebhooks] = useState<Webhook[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [testingId, setTestingId] = useState<string | null>(null);
    const [testResult, setTestResult] = useState<{ open: boolean; success: boolean; message: string; status?: number; duration?: number }>({
        open: false,
        success: false,
        message: ""
    });
    const [newWebhook, setNewWebhook] = useState({
        name: "",
        url: "",
        events: [] as string[]
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadWebhooks();
    }, [session?.user?.id]);

    const loadWebhooks = async () => {
        if (!session?.user?.id) return;

        try {
            setLoading(true);
            const data = await webhookService.getUserWebhooks(session.user.id);
            setWebhooks(data);
        } catch (error) {
            console.error("Erro ao carregar webhooks:", error);
            toast.error("Erro ao carregar webhooks");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateWebhook = async () => {
        if (!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0) {
            toast.error("Preencha todos os campos");
            return;
        }

        setSaving(true);
        try {
            const webhook = await webhookService.createWebhook(session!.user.id, newWebhook);
            if (webhook) {
                toast.success("Webhook criado com sucesso!");
                setDialogOpen(false);
                setNewWebhook({ name: "", url: "", events: [] });
                await loadWebhooks();
            }
        } catch (error) {
            toast.error("Erro ao criar webhook");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteWebhook = async (webhookId: string) => {
        if (!confirm("Tem certeza que deseja deletar este webhook?")) return;

        try {
            const success = await webhookService.deleteWebhook(webhookId);
            if (success) {
                toast.success("Webhook deletado");
                await loadWebhooks();
            }
        } catch (error) {
            toast.error("Erro ao deletar webhook");
        }
    };

    const handleToggleWebhook = async (webhook: Webhook) => {
        try {
            const success = await webhookService.updateWebhook(webhook.id, { active: !webhook.active });
            if (success) {
                toast.success(`Webhook ${webhook.active ? 'desativado' : 'ativado'}`);
                await loadWebhooks();
            }
        } catch (error) {
            toast.error("Erro ao alterar status");
        }
    };

    const copySecret = (secret: string) => {
        navigator.clipboard.writeText(secret);
        toast.success("Secret copiado para área de transferência");
    };

    const handleTestWebhook = async (webhook: Webhook) => {
        if (!webhook.active) {
            toast.error("Webhook está desativado. Ative-o primeiro para testar.");
            return;
        }

        if (webhook.events.length === 0) {
            toast.error("Webhook não tem eventos configurados");
            return;
        }

        setTestingId(webhook.id);
        try {
            const response = await fetch('/api/webhooks/trigger-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    webhookId: webhook.id,
                    event: webhook.events[0]
                })
            });

            const data = await response.json();

            setTestResult({
                open: true,
                success: data.success,
                message: data.message || (data.success ? "Webhook disparado com sucesso!" : data.error),
                status: data.status,
                duration: data.duration
            });

            await loadWebhooks(); // Recarregar para atualizar logs
        } catch (error) {
            setTestResult({
                open: true,
                success: false,
                message: "Erro ao testar webhook"
            });
        } finally {
            setTestingId(null);
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
                    <p className="text-muted-foreground">
                        Configure webhooks para receber eventos em tempo real
                    </p>
                </div>
                <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Webhook
                </Button>
            </div>

            {webhooks.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <WebhookIcon className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">Nenhum webhook configurado</p>
                        <p className="text-sm text-muted-foreground mb-4">
                            Crie seu primeiro webhook para começar a receber eventos
                        </p>
                        <Button onClick={() => setDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Criar Webhook
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {webhooks.map((webhook) => (
                        <Card key={webhook.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <WebhookIcon className="h-5 w-5 text-primary" />
                                        <CardTitle>{webhook.name}</CardTitle>
                                        <Badge variant={webhook.active ? "default" : "secondary"}>
                                            {webhook.active ? "Ativo" : "Inativo"}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleTestWebhook(webhook)}
                                            disabled={testingId === webhook.id || !webhook.active}
                                            className="gap-2"
                                        >
                                            {testingId === webhook.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Zap className="h-4 w-4" />
                                            )}
                                            Testar
                                        </Button>
                                        <Switch
                                            checked={webhook.active}
                                            onCheckedChange={() => handleToggleWebhook(webhook)}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteWebhook(webhook.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">URL</p>
                                    <code className="block text-sm bg-muted p-2 rounded break-all">
                                        {webhook.url}
                                    </code>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Secret</p>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 text-sm bg-muted p-2 rounded font-mono">
                                            {webhook.secret.substring(0, 20)}...
                                        </code>
                                        <Button variant="outline" size="sm" onClick={() => copySecret(webhook.secret)}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Eventos</p>
                                    <div className="flex flex-wrap gap-2">
                                        {webhook.events.map((event) => {
                                            const eventOption = eventOptions.find(e => e.value === event);
                                            return (
                                                <Badge key={event} variant="outline">
                                                    {eventOption?.label || event}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </div>
                                {webhook.lastTriggeredAt && (
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>Último disparo: {new Date(webhook.lastTriggeredAt).toLocaleString()}</span>
                                        {webhook.lastStatus && (
                                            <span className="flex items-center gap-1">
                                                {webhook.lastStatus === 200 ? (
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                )}
                                                Status: {webhook.lastStatus}
                                            </span>
                                        )}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/dashboard/integrations/webhooks/${webhook.id}`}>
                                            <Eye className="h-4 w-4 mr-2" />
                                            Ver logs
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Dialog de criação */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[500px] bg-background">
                    <DialogHeader>
                        <DialogTitle>Criar Webhook</DialogTitle>
                        <DialogDescription>
                            Configure um webhook para receber eventos quando algo acontecer.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                placeholder="Ex: Discord Notifications"
                                value={newWebhook.name}
                                onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="url">URL</Label>
                            <Input
                                id="url"
                                placeholder="https://seuservidor.com/webhook"
                                value={newWebhook.url}
                                onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Eventos</Label>
                            <div className="border rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
                                {eventOptions.map((event) => (
                                    <label key={event.value} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newWebhook.events.includes(event.value)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setNewWebhook({
                                                        ...newWebhook,
                                                        events: [...newWebhook.events, event.value]
                                                    });
                                                } else {
                                                    setNewWebhook({
                                                        ...newWebhook,
                                                        events: newWebhook.events.filter(ev => ev !== event.value)
                                                    });
                                                }
                                            }}
                                            className="rounded border-gray-300"
                                        />
                                        <span>{event.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleCreateWebhook} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Criar Webhook
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog de resultado do teste */}
            <AlertDialog open={testResult.open} onOpenChange={(open) => setTestResult(prev => ({ ...prev, open }))}>
                <AlertDialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className={testResult.success ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                            {testResult.success ? "✅ Teste bem-sucedido!" : "❌ Falha no teste"}
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                <p>{testResult.message}</p>
                                {testResult.status && (
                                    <p className="text-sm">
                                        Status HTTP: {testResult.status}
                                    </p>
                                )}
                                {testResult.duration && (
                                    <p className="text-sm">
                                        Duração: {testResult.duration}ms
                                    </p>
                                )}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600">
                            Fechar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}