"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, RefreshCw, Database, CheckCircle, Calendar, Clock, FileSpreadsheet, Link as LinkIcon, Settings, Zap, Eye } from "lucide-react";
import { ExportHistory } from "@/components/integrations/google-sheets/ExportHistory";

interface GoogleSheetsConnection {
    id: string;
    name: string;
    spreadsheet_id: string;
    sheet_name: string;
    active: boolean;
    last_sync_at?: string;
    next_sync_at?: string;
    sync_frequency?: string;
    created_at: string;
}

interface PreviewData {
    headers: string[];
    rows: any[][];
    totalRows: number;
}

export default function GoogleSheetsPage() {
    const { data: session } = useSession();
    const [connections, setConnections] = useState<GoogleSheetsConnection[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedConnection, setSelectedConnection] = useState<GoogleSheetsConnection | null>(null);
    const [editingConnection, setEditingConnection] = useState<GoogleSheetsConnection | null>(null);
    const [exportType, setExportType] = useState("analytics");
    const [exportPeriod, setExportPeriod] = useState("last30");
    const [previewData, setPreviewData] = useState<PreviewData | null>(null);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [editForm, setEditForm] = useState({
        name: "",
        sheet_name: "",
        sync_frequency: ""
    });
    const [newConnection, setNewConnection] = useState({
        name: "",
        spreadsheet_id: "",
        sheet_name: "Sheet1",
        sync_frequency: "manual"
    });

    useEffect(() => {
        if (session?.user?.id) {
            loadConnections();
        }
    }, [session?.user?.id]);

    const loadConnections = async () => {
        if (!session?.user?.id) return;

        try {
            setLoading(true);
            const response = await fetch('/api/integrations/google/connections');
            const data = await response.json();
            setConnections(data.connections || []);
        } catch (error) {
            console.error("Erro ao carregar conexões:", error);
            toast.error("Erro ao carregar conexões");
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = () => {
        window.location.href = '/api/integrations/google/auth';
    };

    const handleCreateConnection = async () => {
        if (!newConnection.name || !newConnection.spreadsheet_id) {
            toast.error("Preencha todos os campos");
            return;
        }

        setSaving(true);
        try {
            const response = await fetch('/api/integrations/google/connections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newConnection.name,
                    spreadsheetId: newConnection.spreadsheet_id,
                    sheetName: newConnection.sheet_name,
                    syncFrequency: newConnection.sync_frequency
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Conexão criada com sucesso!");
                setDialogOpen(false);
                setNewConnection({ name: "", spreadsheet_id: "", sheet_name: "Sheet1", sync_frequency: "manual" });
                await loadConnections();
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            toast.error("Erro ao criar conexão");
        } finally {
            setSaving(false);
        }
    };

    const loadPreview = async () => {
        if (!selectedConnection) return;

        setLoadingPreview(true);
        try {
            const response = await fetch('/api/integrations/google/export-preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    connectionId: selectedConnection.id,
                    exportType,
                    period: exportPeriod
                })
            });

            const data = await response.json();

            if (data.success) {
                setPreviewData({
                    headers: data.headers,
                    rows: data.data,
                    totalRows: data.rowCount
                });
            } else {
                setPreviewData(null);
            }
        } catch (error) {
            console.error("Erro ao carregar preview:", error);
            setPreviewData(null);
        } finally {
            setLoadingPreview(false);
        }
    };

    const handleExport = async () => {
        if (!selectedConnection) return;

        setExporting(true);
        try {
            const response = await fetch('/api/integrations/google/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    connectionId: selectedConnection.id,
                    exportType,
                    period: exportPeriod
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`Dados exportados com sucesso! ${data.rowCount} registros enviados.`);
                await loadConnections();
                setExportDialogOpen(false);
                setPreviewData(null);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            toast.error("Erro ao exportar dados");
        } finally {
            setExporting(false);
        }
    };

    const handleDeleteConnection = async (connectionId: string) => {
        if (!confirm("Tem certeza que deseja remover esta conexão?")) return;

        try {
            const response = await fetch(`/api/integrations/google/connections/${connectionId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Conexão removida");
                await loadConnections();
            }
        } catch (error) {
            toast.error("Erro ao remover conexão");
        }
    };

    const handleToggleConnection = async (connection: GoogleSheetsConnection) => {
        try {
            const response = await fetch(`/api/integrations/google/connections/${connection.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !connection.active })
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`Conexão ${connection.active ? 'desativada' : 'ativada'}`);
                await loadConnections();
            }
        } catch (error) {
            toast.error("Erro ao alterar status");
        }
    };

    const openExportDialog = async (connection: GoogleSheetsConnection) => {
        setSelectedConnection(connection);
        setExportDialogOpen(true);
        setPreviewData(null);
        setExportType("analytics");
        setExportPeriod("last30");
    };

    const openEditDialog = (connection: GoogleSheetsConnection) => {
        setEditingConnection(connection);
        setEditForm({
            name: connection.name,
            sheet_name: connection.sheet_name,
            sync_frequency: connection.sync_frequency || "manual"
        });
        setEditDialogOpen(true);
    };

    const handleEditConnection = async () => {
        if (!editingConnection) return;

        try {
            const response = await fetch(`/api/integrations/google/connections/${editingConnection.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editForm.name,
                    sheetName: editForm.sheet_name,
                    syncFrequency: editForm.sync_frequency
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Conexão atualizada!");
                setEditDialogOpen(false);
                await loadConnections();
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            toast.error("Erro ao atualizar conexão");
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Google Sheets</h1>
                    <p className="text-muted-foreground">
                        Conecte suas planilhas para exportar dados automaticamente
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleConnect} variant="outline">
                        <Database className="h-4 w-4 mr-2" />
                        Conectar Conta Google
                    </Button>
                    <Button onClick={() => setDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Planilha
                    </Button>
                </div>
            </div>

            {/* Status da integração */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Google Sheets Integrado</h3>
                                <p className="text-sm text-muted-foreground">
                                    {connections.length} planilha{connections.length !== 1 ? 's' : ''} conectada{connections.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                        <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Ativo
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de conexões */}
            {connections.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">Nenhuma planilha conectada</p>
                        <p className="text-sm text-muted-foreground mb-4">
                            Conecte sua conta do Google e adicione uma planilha para começar
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleConnect}>
                                Conectar Conta Google
                            </Button>
                            <Button onClick={() => setDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Adicionar Planilha
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {connections.map((connection) => (
                        <Card key={connection.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileSpreadsheet className="h-5 w-5 text-green-600" />
                                        <CardTitle>{connection.name}</CardTitle>
                                        <Badge variant={connection.active ? "default" : "secondary"}>
                                            {connection.active ? "Ativo" : "Inativo"}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openExportDialog(connection)}
                                            disabled={!connection.active}
                                        >
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Exportar
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openEditDialog(connection)}
                                            title="Editar conexão"
                                        >
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                        <Switch
                                            checked={connection.active}
                                            onCheckedChange={() => handleToggleConnection(connection)}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteConnection(connection.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid gap-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                        <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                                            {connection.spreadsheet_id ? connection.spreadsheet_id.substring(0, 30) : 'ID não disponível'}...
                                        </code>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2"
                                            onClick={() => {
                                                if (connection.spreadsheet_id) {
                                                    navigator.clipboard.writeText(connection.spreadsheet_id);
                                                    toast.success("ID copiado!");
                                                } else {
                                                    toast.error("ID não disponível");
                                                }
                                            }}
                                        >
                                            Copiar
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                                        <span>Aba: {connection.sheet_name || 'Sheet1'}</span>
                                    </div>
                                    {connection.last_sync_at && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                Última exportação: {new Date(connection.last_sync_at).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                    {connection.sync_frequency && connection.sync_frequency !== "manual" && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                Sincronização: {
                                                    connection.sync_frequency === "daily" ? "Diária" :
                                                        connection.sync_frequency === "weekly" ? "Semanal" :
                                                            connection.sync_frequency === "monthly" ? "Mensal" : "Manual"
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardContent className="pt-0">
                                <ExportHistory connectionId={connection.id} />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Dialog de criação */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[500px] bg-background border-border">
                    <DialogHeader>
                        <DialogTitle>Adicionar Planilha</DialogTitle>
                        <DialogDescription>
                            Conecte uma planilha do Google Sheets para exportar seus dados
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome da Conexão</Label>
                            <Input
                                id="name"
                                placeholder="Ex: Relatório de Vendas"
                                value={newConnection.name}
                                onChange={(e) => setNewConnection({ ...newConnection, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="spreadsheet_id">ID da Planilha</Label>
                            <Input
                                id="spreadsheet_id"
                                placeholder="SEU_ID_DA_PLANILHA"
                                value={newConnection.spreadsheet_id}
                                onChange={(e) => setNewConnection({ ...newConnection, spreadsheet_id: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">
                                O ID está na URL: https://docs.google.com/spreadsheets/d/{"[SEU_ID_AQUI]"}/edit
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sheet_name">Nome da Aba</Label>
                            <Input
                                id="sheet_name"
                                placeholder="Sheet1"
                                value={newConnection.sheet_name}
                                onChange={(e) => setNewConnection({ ...newConnection, sheet_name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sync_frequency">Frequência de Sincronização</Label>
                            <Select value={newConnection.sync_frequency} onValueChange={(value) => setNewConnection({ ...newConnection, sync_frequency: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                    <SelectItem value="manual">Manual</SelectItem>
                                    <SelectItem value="daily">Diária</SelectItem>
                                    <SelectItem value="weekly">Semanal</SelectItem>
                                    <SelectItem value="monthly">Mensal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleCreateConnection} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Adicionar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog de exportação com preview */}
            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                <DialogContent className="sm:max-w-[600px] bg-background border-border">
                    <DialogHeader>
                        <DialogTitle>Exportar Dados</DialogTitle>
                        <DialogDescription>
                            Selecione os dados que deseja exportar para {selectedConnection?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Tipo de Dados</Label>
                            <Select value={exportType} onValueChange={setExportType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                    <SelectItem value="analytics">Análises</SelectItem>
                                    <SelectItem value="reports">Relatórios</SelectItem>
                                    <SelectItem value="users">Usuários</SelectItem>
                                    <SelectItem value="team">Time</SelectItem>
                                    <SelectItem value="all">Todos os dados</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Período</Label>
                            <Select value={exportPeriod} onValueChange={setExportPeriod}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                    <SelectItem value="last7">Últimos 7 dias</SelectItem>
                                    <SelectItem value="last30">Últimos 30 dias</SelectItem>
                                    <SelectItem value="last90">Últimos 90 dias</SelectItem>
                                    <SelectItem value="all">Todo período</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={loadPreview}
                            disabled={loadingPreview}
                            className="w-full"
                        >
                            {loadingPreview ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Eye className="h-4 w-4 mr-2" />
                            )}
                            Visualizar Prévia
                        </Button>

                        {/* Prévia dos dados */}
                        {previewData && (
                            <div className="space-y-2">
                                <Label>Prévia dos dados ({previewData.totalRows} registros)</Label>
                                <div className="border rounded-lg overflow-x-auto max-h-64">
                                    <table className="text-xs w-full">
                                        <thead className="bg-muted sticky top-0">
                                            <tr>
                                                {previewData.headers.map((header, i) => (
                                                    <th key={i} className="p-2 text-left font-medium">{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewData.rows.slice(0, 10).map((row, i) => (
                                                <tr key={i} className="border-t">
                                                    {row.map((cell, j) => (
                                                        <td key={j} className="p-2 max-w-[200px] truncate">
                                                            {cell !== undefined && cell !== null ? String(cell) : '-'}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {previewData.totalRows > 10 && (
                                    <p className="text-xs text-muted-foreground text-center">
                                        + {previewData.totalRows - 10} registros adicionais
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="rounded-lg bg-muted p-3">
                            <p className="text-sm text-muted-foreground">
                                <strong>Destino:</strong> {selectedConnection?.sheet_name}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Os dados serão exportados para a planilha conectada.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleExport} disabled={exporting}>
                            {exporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                            Exportar Agora
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog de edição */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px] bg-background border-border">
                    <DialogHeader>
                        <DialogTitle>Editar Planilha</DialogTitle>
                        <DialogDescription>
                            Altere as configurações da sua conexão
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Nome da Conexão</Label>
                            <Input
                                id="edit-name"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-sheet_name">Nome da Aba</Label>
                            <Input
                                id="edit-sheet_name"
                                value={editForm.sheet_name}
                                onChange={(e) => setEditForm({ ...editForm, sheet_name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-sync_frequency">Frequência de Sincronização</Label>
                            <Select value={editForm.sync_frequency} onValueChange={(value) => setEditForm({ ...editForm, sync_frequency: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                    <SelectItem value="manual">Manual</SelectItem>
                                    <SelectItem value="daily">Diária</SelectItem>
                                    <SelectItem value="weekly">Semanal</SelectItem>
                                    <SelectItem value="monthly">Mensal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleEditConnection}>
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}