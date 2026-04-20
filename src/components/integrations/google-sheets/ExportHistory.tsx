"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Calendar, FileSpreadsheet, CheckCircle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ExportHistoryItem {
    id: string;
    connection_id: string;
    export_type: string;
    period: string;
    row_count: number;
    status: string;
    error_message?: string;
    details?: any;
    created_at: string;
}

interface ExportHistoryProps {
    connectionId: string;
}

export function ExportHistory({ connectionId }: ExportHistoryProps) {
    const [history, setHistory] = useState<ExportHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedExport, setSelectedExport] = useState<ExportHistoryItem | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        loadHistory();
    }, [connectionId]);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/integrations/google/export-history?connectionId=${connectionId}`);
            const data = await response.json();
            setHistory(data.history || []);
        } catch (error) {
            console.error("Erro ao carregar histórico:", error);
        } finally {
            setLoading(false);
        }
    };

    const getExportTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            analytics: "Análises",
            reports: "Relatórios",
            users: "Usuários",
            team: "Time",
            all: "Todos os dados"
        };
        return types[type] || type;
    };

    const getPeriodLabel = (period: string) => {
        const periods: Record<string, string> = {
            last7: "Últimos 7 dias",
            last30: "Últimos 30 dias",
            last90: "Últimos 90 dias",
            all: "Todo período"
        };
        return periods[period] || period;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma exportação realizada ainda</p>
                    <p className="text-sm">Exporte dados para começar a ver o histórico</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Histórico de Exportações
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Período</TableHead>
                                <TableHead>Linhas</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="whitespace-nowrap">
                                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ptBR })}
                                    </TableCell>
                                    <TableCell>{getExportTypeLabel(item.export_type)}</TableCell>
                                    <TableCell>{getPeriodLabel(item.period)}</TableCell>
                                    <TableCell>{item.row_count.toLocaleString()}</TableCell>
                                    <TableCell>
                                        {item.status === "success" ? (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Sucesso
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                                <XCircle className="h-3 w-3 mr-1" />
                                                Erro
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setSelectedExport(item);
                                                setDetailsOpen(true);
                                            }}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Dialog de detalhes */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detalhes da Exportação</DialogTitle>
                    </DialogHeader>
                    {selectedExport && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Data</p>
                                    <p>{new Date(selectedExport.created_at).toLocaleString('pt-BR')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Tipo</p>
                                    <p>{getExportTypeLabel(selectedExport.export_type)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Período</p>
                                    <p>{getPeriodLabel(selectedExport.period)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Linhas exportadas</p>
                                    <p>{selectedExport.row_count.toLocaleString()}</p>
                                </div>
                            </div>

                            {selectedExport.error_message && (
                                <div className="rounded-lg bg-red-50 p-3 text-red-700 text-sm">
                                    <strong>Erro:</strong> {selectedExport.error_message}
                                </div>
                            )}

                            {selectedExport.details?.headers && (
                                <div>
                                    <p className="text-sm font-medium mb-2">Cabeçalhos</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedExport.details.headers.map((header: string, i: number) => (
                                            <Badge key={i} variant="secondary">{header}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedExport.details?.sample && selectedExport.details.sample.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium mb-2">Amostra dos dados</p>
                                    <div className="border rounded-lg overflow-x-auto">
                                        <table className="text-sm">
                                            <thead className="bg-muted">
                                                <tr>
                                                    {selectedExport.details.sample[0].map((_: any, i: number) => (
                                                        <th key={i} className="p-2 text-left">Coluna {i + 1}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedExport.details.sample.map((row: any[], i: number) => (
                                                    <tr key={i} className="border-t">
                                                        {row.map((cell, j) => (
                                                            <td key={j} className="p-2 max-w-xs truncate">{String(cell)}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}