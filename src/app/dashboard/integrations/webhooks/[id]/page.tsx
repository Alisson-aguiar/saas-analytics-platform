"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { webhookService, WebhookLog } from "@/lib/services/webhook.service";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

// Definir os eventos localmente
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

export default function WebhookDetailPage() {
    const params = useParams();
    const webhookId = params.id as string;
    const [logs, setLogs] = useState<WebhookLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLogs();
    }, [webhookId]);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const data = await webhookService.getWebhookLogs(webhookId);
            setLogs(data);
        } catch (error) {
            console.error("Erro ao carregar logs:", error);
        } finally {
            setLoading(false);
        }
    };

    const getEventLabel = (event: string) => {
        const eventOption = eventOptions.find((opt: { value: string; label: string }) => opt.value === event);
        return eventOption?.label || event;
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
                    <h1 className="text-3xl font-bold tracking-tight">Logs do Webhook</h1>
                    <p className="text-muted-foreground">
                        Histórico de tentativas de disparo
                    </p>
                </div>
                <Button variant="outline" onClick={loadLogs}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tentativas ({logs.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {logs.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Nenhum log encontrado
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Evento</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Duração</TableHead>
                                    <TableHead>Detalhes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {formatDistanceToNow(log.createdAt, { addSuffix: true, locale: ptBR })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{getEventLabel(log.event)}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {log.responseStatus === 200 ? (
                                                <span className="flex items-center gap-1 text-green-600">
                                                    <CheckCircle className="h-4 w-4" />
                                                    {log.responseStatus}
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-red-600">
                                                    <XCircle className="h-4 w-4" />
                                                    {log.responseStatus || 'Erro'}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>{log.durationMs}ms</TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {log.error || log.responseBody?.substring(0, 50) || '-'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}