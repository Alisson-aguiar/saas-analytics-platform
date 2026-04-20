"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Key, Plus, Copy, Trash2, AlertCircle, Clock, Loader2 } from "lucide-react";
import { settingsService, ApiKey } from "@/lib/services/settings.service";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface APISettingsProps {
    userId: string;
}

export function APISettings({ userId }: APISettingsProps) {
    const [loading, setLoading] = useState(true);
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [newKeyName, setNewKeyName] = useState("");
    const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        loadApiKeys();
    }, [userId]);

    const loadApiKeys = async () => {
        try {
            setLoading(true);
            const keys = await settingsService.getApiKeys(userId);
            setApiKeys(keys);
        } catch (error) {
            console.error("Erro ao carregar API keys:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateKey = async () => {
        if (!newKeyName.trim()) return;

        setCreating(true);
        try {
            const newKey = await settingsService.createApiKey(userId, newKeyName);
            if (newKey) {
                setNewKeyValue(newKey.key);
                await loadApiKeys();
                setNewKeyName("");
            }
        } catch (error) {
            toast.error("Erro ao criar chave de API");
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteKey = async (keyId: string) => {
        if (!confirm("Tem certeza que deseja remover esta chave? Esta ação não pode ser desfeita.")) {
            return;
        }

        try {
            const success = await settingsService.deleteApiKey(keyId);
            if (success) {
                toast.success("Chave removida com sucesso");
                await loadApiKeys();
            }
        } catch (error) {
            toast.error("Erro ao remover chave");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copiado para a área de transferência");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        API Keys
                    </CardTitle>
                    <CardDescription>
                        Gerencie suas chaves de API para integração com outros serviços
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Suas chaves de API são como senhas. Mantenha-as em segredo e não as compartilhe.
                        </AlertDescription>
                    </Alert>

                    {/* Botão Nova Chave */}
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Nova Chave de API
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Criar nova chave de API</DialogTitle>
                                <DialogDescription>
                                    Dê um nome para identificar esta chave. Você poderá usá-la para autenticar suas requisições.
                                </DialogDescription>
                            </DialogHeader>

                            {newKeyValue ? (
                                <div className="space-y-4">
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            <strong>Guarde esta chave em um local seguro!</strong> Ela não será mostrada novamente.
                                        </AlertDescription>
                                    </Alert>
                                    <div className="space-y-2">
                                        <Label>Sua nova chave de API</Label>
                                        <div className="flex gap-2">
                                            <Input value={newKeyValue} readOnly className="font-mono" />
                                            <Button variant="outline" onClick={() => copyToClipboard(newKeyValue)}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={() => {
                                            setNewKeyValue(null);
                                            setDialogOpen(false);
                                        }}>
                                            Concluído
                                        </Button>
                                    </DialogFooter>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="keyName">Nome da chave</Label>
                                            <Input
                                                id="keyName"
                                                placeholder="Ex: Desenvolvimento, Produção, Teste"
                                                value={newKeyName}
                                                onChange={(e) => setNewKeyName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                            Cancelar
                                        </Button>
                                        <Button onClick={handleCreateKey} disabled={creating}>
                                            {creating ? (
                                                <>
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                                    Criando...
                                                </>
                                            ) : (
                                                "Criar Chave"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* Lista de Chaves */}
                    {apiKeys.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Você ainda não tem nenhuma chave de API</p>
                            <p className="text-sm">Crie sua primeira chave para começar a integrar</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Chave</TableHead>
                                    <TableHead>Criada em</TableHead>
                                    <TableHead>Último uso</TableHead>
                                    <TableHead>Expira em</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {apiKeys.map((key) => (
                                    <TableRow key={key.id}>
                                        <TableCell className="font-medium">{key.name}</TableCell>
                                        <TableCell>
                                            <code className="text-xs bg-muted px-2 py-1 rounded">
                                                {key.key.substring(0, 8)}...
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            {formatDistanceToNow(key.createdAt, {
                                                addSuffix: true,
                                                locale: ptBR
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {key.lastUsed ? (
                                                formatDistanceToNow(key.lastUsed, {
                                                    addSuffix: true,
                                                    locale: ptBR
                                                })
                                            ) : (
                                                <span className="text-muted-foreground">Nunca usado</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {key.expiresAt && (
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {formatDistanceToNow(key.expiresAt, {
                                                            addSuffix: true,
                                                            locale: ptBR
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => copyToClipboard(key.key)}
                                                title="Copiar chave"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteKey(key.id)}
                                                title="Remover chave"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
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