"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import { formatCurrency } from "@/lib/utils";

interface ReportPreviewProps {
    title: string;
    description: string;
    charts: string[];
    metrics: string[];
    dateRange: { from: Date; to: Date };
    data: any;
}

export default function ReportPreview({
    title,
    description,
    charts,
    metrics,
    dateRange,
    data
}: ReportPreviewProps) {
    return (
        <div className="space-y-6 p-6 bg-white rounded-lg border" data-report="true">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">{title || "Relatório sem título"}</h1>
                {description && (
                    <p className="text-gray-500 mt-2">{description}</p>
                )}
                <div className="flex gap-4 mt-4 text-sm text-gray-500">
                    <span>Período: {dateRange.from.toLocaleDateString('pt-BR')} - {dateRange.to.toLocaleDateString('pt-BR')}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>Gerado em: {new Date().toLocaleDateString('pt-BR')}</span>
                </div>
            </div>

            <Separator />

            {/* Métricas */}
            {metrics.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {metrics.includes('totalAnalytics') && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total de Análises</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data?.stats?.totalAnalytics || 0}</div>
                            </CardContent>
                        </Card>
                    )}
                    {metrics.includes('activeUsers') && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data?.stats?.activeUsers || 0}</div>
                            </CardContent>
                        </Card>
                    )}
                    {metrics.includes('filesUploaded') && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Arquivos Enviados</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data?.stats?.filesUploaded || 0}</div>
                            </CardContent>
                        </Card>
                    )}
                    {metrics.includes('revenue') && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Receita Estimada</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(data?.stats?.revenue || 0)}</div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Gráficos */}
            {charts.length > 0 && (
                <div className="grid gap-6">
                    {charts.includes('line') && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Tráfego de Análises</CardTitle>
                                <CardDescription>Últimos 6 meses</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <LineChart
                                    data={data?.trafficData || []}
                                    dataKey="value"
                                    color="#3b82f6"
                                />
                            </CardContent>
                        </Card>
                    )}

                    {charts.includes('bar') && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribuição por Categoria</CardTitle>
                                <CardDescription>Análise comparativa</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <BarChart
                                    data={[
                                        { name: "Marketing", value: 450 },
                                        { name: "Vendas", value: 380 },
                                        { name: "Produtos", value: 520 },
                                        { name: "Clientes", value: 680 },
                                    ]}
                                    fill="#10b981"
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Rodapé */}
            <div className="text-center text-sm text-gray-400 pt-4 border-t">
                <p>Relatório gerado automaticamente pelo AnalyticsPro</p>
            </div>
        </div>
    );
}