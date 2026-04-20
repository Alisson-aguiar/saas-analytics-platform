"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Save,
    Download,
    Trash2,
    Eye,
    BarChart3,
    PieChart,
    LineChart,
    Table,
    DownloadCloud,
    Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import ChartSelector from "./builder/ChartSelector";
import MetricSelector from "./builder/MetricSelector";
import DateRangePicker from "./builder/DateRangePicker";
import ReportPreview from "./ReportPreview";
import { exportService } from "@/lib/services/reports/export.service";
import { useReport } from "@/hooks/reports/useReport";
import { dashboardService } from "@/lib/services/dashboard.service";

interface ReportBuilderProps {
    reportId?: string;
}

export default function ReportBuilder({ reportId }: ReportBuilderProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const { report, loading, saving, createReport, updateReport, deleteReport } = useReport(reportId);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
    const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
    const [previewData, setPreviewData] = useState<any>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Carregar dados do relatório existente
    useEffect(() => {
        if (report) {
            setTitle(report.title);
            setDescription(report.description);
            setIsPublic(report.isPublic);
            setSelectedCharts(report.config?.charts || []);
            setSelectedMetrics(report.config?.metrics || []);

            // ✅ CORREÇÃO: Converter strings de data para objetos Date
            if (report.config?.dateRange) {
                setDateRange({
                    from: new Date(report.config.dateRange.from),
                    to: new Date(report.config.dateRange.to)
                });
            } else {
                setDateRange({ from: new Date(), to: new Date() });
            }
        }
    }, [report]);

    // Gerar preview dos dados
    useEffect(() => {
        const loadPreviewData = async () => {
            if (!session?.user?.id) return;

            try {
                const [stats, trafficData] = await Promise.all([
                    dashboardService.getUserStats(session.user.id),
                    dashboardService.getTrafficData(session.user.id, 6)
                ]);

                setPreviewData({ stats, trafficData });
            } catch (error) {
                console.error("Erro ao carregar preview:", error);
            }
        };

        loadPreviewData();
    }, [session?.user?.id]);

    // ✅ Função ensurePreviewVisible (para exportação)
    const ensurePreviewVisible = async () => {
        if (!showPreview) {
            setShowPreview(true);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        const element = document.getElementById('report-preview');
        if (!element) {
            throw new Error("Elemento de preview não encontrado");
        }
        return element;
    };

    // ✅ Função handleSave
    const handleSave = async () => {
        if (!title.trim()) {
            toast.error("Título obrigatório", {
                description: "Por favor, dê um título ao relatório"
            });
            return;
        }

        try {
            const reportConfig = {
                charts: selectedCharts,
                metrics: selectedMetrics,
                dateRange: {
                    from: dateRange.from.toISOString(),
                    to: dateRange.to.toISOString()
                },
                createdAt: new Date().toISOString()
            };

            if (reportId) {
                const updateSuccess = await updateReport({
                    title,
                    description,
                    config: reportConfig,
                    isPublic
                });

                if (updateSuccess) {
                    toast.success("Relatório atualizado", {
                        description: "As alterações foram salvas com sucesso"
                    });
                } else {
                    throw new Error("Falha ao atualizar relatório");
                }
            } else {
                const newReport = await createReport({
                    title,
                    description,
                    config: reportConfig,
                    isPublic
                });

                if (newReport) {
                    toast.success("Relatório criado", {
                        description: "Seu novo relatório foi criado com sucesso"
                    });
                    router.push(`/dashboard/reports/${newReport.id}`);
                } else {
                    throw new Error("Falha ao criar relatório");
                }
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
            toast.error("Erro ao salvar", {
                description: "Não foi possível salvar o relatório. Tente novamente."
            });
        }
    };

    // ✅ Função handleExportPDF
    const handleExportPDF = async () => {
        setIsExporting(true);
        toast.info("Preparando PDF...", {
            description: "Aguarde enquanto geramos seu PDF"
        });

        try {
            await ensurePreviewVisible();
            const success = await exportService.exportToPDF('report-preview', {
                filename: title || 'relatorio',
                scale: 2,
                backgroundColor: '#ffffff'
            });

            if (success) {
                toast.success("PDF exportado", {
                    description: "O relatório foi exportado como PDF com sucesso"
                });
            } else {
                throw new Error("Falha na exportação");
            }
        } catch (error) {
            console.error("Erro ao exportar PDF:", error);
            toast.error("Erro ao exportar", {
                description: "Não foi possível exportar o PDF. Tente novamente."
            });
        } finally {
            setIsExporting(false);
        }
    };

    // ✅ Função handleExportPNG
    const handleExportPNG = async () => {
        setIsExporting(true);
        toast.info("Preparando imagem...", {
            description: "Aguarde enquanto geramos sua imagem"
        });

        try {
            await ensurePreviewVisible();
            const success = await exportService.exportToPNG('report-preview', {
                filename: title || 'relatorio',
                scale: 3,
                backgroundColor: '#ffffff'
            });

            if (success) {
                toast.success("PNG exportado", {
                    description: "O relatório foi exportado como imagem com sucesso"
                });
            } else {
                throw new Error("Falha na exportação");
            }
        } catch (error) {
            console.error("Erro ao exportar PNG:", error);
            toast.error("Erro ao exportar", {
                description: "Não foi possível exportar a imagem. Tente novamente."
            });
        } finally {
            setIsExporting(false);
        }
    };

    // ✅ Função handlePrint
    const handlePrint = async () => {
        setIsExporting(true);
        try {
            await ensurePreviewVisible();
            toast.info("Preparando impressão...", {
                description: "Abrindo janela de impressão"
            });

            const success = await exportService.printReport('report-preview');

            if (success) {
                toast.success("Impressão iniciada", {
                    description: "A janela de impressão foi aberta"
                });
            } else {
                throw new Error("Falha ao abrir impressão");
            }
        } catch (error) {
            console.error("Erro ao imprimir:", error);
            toast.error("Erro ao imprimir", {
                description: "Não foi possível abrir a janela de impressão. Verifique se os pop-ups estão permitidos."
            });
        } finally {
            setIsExporting(false);
        }
    };

    // ✅ Função handleDelete
    const handleDelete = async () => {
        try {
            const success = await deleteReport();
            if (success) {
                toast.success("Relatório deletado", {
                    description: "O relatório foi removido permanentemente"
                });
                router.push("/dashboard/reports");
            } else {
                throw new Error("Falha ao deletar");
            }
        } catch (error) {
            console.error("Erro ao deletar:", error);
            toast.error("Erro ao deletar", {
                description: "Não foi possível deletar o relatório. Tente novamente."
            });
        }
        setDeleteDialogOpen(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header com ações */}
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <Input
                        placeholder="Título do relatório"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-2xl font-bold border-none px-0 focus-visible:ring-0"
                        disabled={saving}
                    />
                    <Textarea
                        placeholder="Descrição (opcional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border-none px-0 focus-visible:ring-0 resize-none"
                        rows={2}
                        disabled={saving}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2 mr-4">
                        <Switch
                            id="public-mode"
                            checked={isPublic}
                            onCheckedChange={setIsPublic}
                            disabled={saving}
                        />
                        <Label htmlFor="public-mode">Público</Label>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => setShowPreview(!showPreview)}
                        disabled={saving}
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        {showPreview ? "Editar" : "Visualizar"}
                    </Button>

                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? "Salvando..." : "Salvar"}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" disabled={saving || isExporting}>
                                <DownloadCloud className="h-4 w-4 mr-2" />
                                {isExporting ? "Exportando..." : "Exportar"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Exportar como</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleExportPDF} disabled={isExporting}>
                                <Download className="h-4 w-4 mr-2" />
                                PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportPNG} disabled={isExporting}>
                                <Download className="h-4 w-4 mr-2" />
                                PNG
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handlePrint} disabled={isExporting}>
                                <Printer className="h-4 w-4 mr-2" />
                                Imprimir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {reportId && (
                        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive" size="icon" disabled={saving}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Deletar relatório</DialogTitle>
                                    <DialogDescription>
                                        Tem certeza que deseja deletar este relatório? Esta ação não pode ser desfeita.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button variant="destructive" onClick={handleDelete}>
                                        Deletar
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>

            <Separator />

            {showPreview ? (
                <div id="report-preview">
                    <ReportPreview
                        title={title}
                        description={description}
                        charts={selectedCharts}
                        metrics={selectedMetrics}
                        dateRange={dateRange}
                        data={previewData}
                    />
                </div>
            ) : (
                <Tabs defaultValue="charts" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="charts" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Gráficos
                        </TabsTrigger>
                        <TabsTrigger value="metrics" className="flex items-center gap-2">
                            <LineChart className="h-4 w-4" />
                            Métricas
                        </TabsTrigger>
                        <TabsTrigger value="filters" className="flex items-center gap-2">
                            <Table className="h-4 w-4" />
                            Filtros
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="charts" className="space-y-4">
                        <ChartSelector
                            selected={selectedCharts}
                            onChange={setSelectedCharts}
                        />
                    </TabsContent>

                    <TabsContent value="metrics" className="space-y-4">
                        <MetricSelector
                            selected={selectedMetrics}
                            onChange={setSelectedMetrics}
                        />
                    </TabsContent>

                    <TabsContent value="filters" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Período</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DateRangePicker
                                    value={dateRange}
                                    onChange={setDateRange}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            )}

            {/* Resumo das configurações */}
            {!showPreview && (
                <Card>
                    <CardHeader>
                        <CardTitle>Resumo do Relatório</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Gráficos</p>
                                <div className="flex gap-2 mt-1">
                                    {selectedCharts.length > 0 ? (
                                        selectedCharts.map(chart => (
                                            <Badge key={chart} variant="secondary">
                                                {chart === 'line' && 'Linha'}
                                                {chart === 'bar' && 'Barras'}
                                                {chart === 'pie' && 'Pizza'}
                                                {chart === 'table' && 'Tabela'}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-400">Nenhum selecionado</span>
                                    )}
                                </div>
                            </div>
                            <Separator orientation="vertical" className="h-10" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Métricas</p>
                                <div className="flex gap-2 mt-1">
                                    {selectedMetrics.length > 0 ? (
                                        selectedMetrics.map(metric => (
                                            <Badge key={metric} variant="outline">
                                                {metric === 'totalAnalytics' && 'Total Análises'}
                                                {metric === 'activeUsers' && 'Usuários Ativos'}
                                                {metric === 'filesUploaded' && 'Arquivos'}
                                                {metric === 'revenue' && 'Receita'}
                                                {metric === 'growth' && 'Crescimento'}
                                                {metric === 'conversion' && 'Conversão'}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-400">Nenhuma selecionada</span>
                                    )}
                                </div>
                            </div>
                            <Separator orientation="vertical" className="h-10" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Período</p>
                                <p className="text-sm mt-1">
                                    {dateRange.from instanceof Date && !isNaN(dateRange.from.getTime())
                                        ? dateRange.from.toLocaleDateString('pt-BR')
                                        : 'Data inválida'} - {dateRange.to instanceof Date && !isNaN(dateRange.to.getTime())
                                            ? dateRange.to.toLocaleDateString('pt-BR')
                                            : 'Data inválida'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}