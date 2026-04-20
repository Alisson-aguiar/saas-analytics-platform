"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Users, FileText, DollarSign, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import MetricsChart from "./MetricsChart";
import DataTable from "./DataTable";
import { dashboardService } from "@/lib/services/dashboard.service";
import { formatCurrency } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AnalyticsDashboardProps {
    dateRange: { from: Date; to: Date };
}

export default function AnalyticsDashboard({ dateRange }: AnalyticsDashboardProps) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("todos");

    useEffect(() => {
        const loadData = async () => {
            if (!session?.user?.id) return;

            try {
                setLoading(true);
                const [stats, trafficData] = await Promise.all([
                    dashboardService.getUserStats(session.user.id),
                    dashboardService.getTrafficData(session.user.id, 12)
                ]);

                // Dados de exemplo para categorias
                const categoryData = [
                    { name: "Marketing", value: 450 },
                    { name: "Vendas", value: 380 },
                    { name: "Produtos", value: 520 },
                    { name: "Clientes", value: 680 },
                    { name: "Financeiro", value: 290 },
                ];

                // Dados de comparação anual
                const yearlyData = [
                    { mes: "Jan", atual: 4000, anterior: 3500 },
                    { mes: "Fev", atual: 4200, anterior: 3600 },
                    { mes: "Mar", atual: 4800, anterior: 4000 },
                    { mes: "Abr", atual: 5100, anterior: 4200 },
                    { mes: "Mai", atual: 4900, anterior: 4300 },
                    { mes: "Jun", atual: 5300, anterior: 4500 },
                ];

                setData({ stats, trafficData, categoryData, yearlyData });
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [session?.user?.id, dateRange]);

    const handleExportCSV = () => {
        // Função para exportar dados
        const csvContent = "dados,valor\n" +
            data?.trafficData.map((item: any) => `${item.month},${item.value}`).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Carregando análises...</p>
                </div>
            </div>
        );
    }

    const metrics = [
        {
            title: "Total de Análises",
            value: data?.stats?.totalAnalytics || 0,
            icon: TrendingUp,
            change: "+12.5%",
            description: "em relação ao mês anterior",
        },
        {
            title: "Usuários Ativos",
            value: data?.stats?.activeUsers || 0,
            icon: Users,
            change: "+8.2%",
            description: "nos últimos 7 dias",
        },
        {
            title: "Arquivos Processados",
            value: data?.stats?.filesUploaded || 0,
            icon: FileText,
            change: "+5.3%",
            description: "este mês",
        },
        {
            title: "Receita Estimada",
            value: formatCurrency(data?.stats?.revenue || 0),
            icon: DollarSign,
            change: "+15.7%",
            description: "projeção mensal",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Cabeçalho com ações */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Dashboard de Análises</h2>
                    <p className="text-muted-foreground">
                        Visualize e analise suas métricas em tempo real
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                Filtrar
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Categorias</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSelectedCategory("todos")}>
                                Todos
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedCategory("marketing")}>
                                Marketing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedCategory("vendas")}>
                                Vendas
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedCategory("produtos")}>
                                Produtos
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" onClick={handleExportCSV}>
                        <Download className="h-4 w-4 mr-2" />
                        Exportar Dados
                    </Button>
                </div>
            </div>

            {/* Cards de Métricas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {metric.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metric.value}</div>
                                <div className="flex items-center text-xs mt-1">
                                    <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700 mr-2">
                                        {metric.change}
                                    </span>
                                    <span className="text-muted-foreground">{metric.description}</span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Abas de Visualização */}
            <Tabs defaultValue="visao-geral" className="space-y-4">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
                    <TabsTrigger value="detalhado">Detalhado</TabsTrigger>
                    <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
                </TabsList>

                {/* Aba: Visão Geral */}
                <TabsContent value="visao-geral" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <MetricsChart
                            data={data?.trafficData || []}
                            type="line"
                            title="Tráfego de Análises"
                            subtitle="Evolução nos últimos meses"
                            dataKey="value"
                            xAxisKey="month"
                            color="#3b82f6"
                        />
                        <MetricsChart
                            data={data?.categoryData || []}
                            type="pie"
                            title="Distribuição por Categoria"
                            subtitle="Percentual de análises por área"
                            dataKey="value"
                            xAxisKey="name"
                        />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <MetricsChart
                            data={data?.categoryData || []}
                            type="bar"
                            title="Comparação por Categoria"
                            subtitle="Volume de análises por categoria"
                            dataKey="value"
                            xAxisKey="name"
                            color="#10b981"
                        />
                        <Card>
                            <CardHeader>
                                <CardTitle>Resumo do Período</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Período:</span>
                                        <span className="font-medium">
                                            {dateRange.from.toLocaleDateString('pt-BR')} - {dateRange.to.toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Total de dias:</span>
                                        <span className="font-medium">
                                            {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} dias
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Média diária:</span>
                                        <span className="font-medium">
                                            {Math.round((data?.stats?.totalAnalytics || 0) / 30)} análises/dia
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-muted-foreground">Pico de uso:</span>
                                        <span className="font-medium">
                                            {Math.max(...(data?.trafficData?.map((d: any) => d.value) || [0]))} análises
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Aba: Detalhado */}
                <TabsContent value="detalhado" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Média</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Math.round(data?.trafficData?.reduce((acc: number, item: any) => acc + item.value, 0) / data?.trafficData?.length || 1)}
                                </div>
                                <p className="text-xs text-muted-foreground">Valor médio por período</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Mínimo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Math.min(...(data?.trafficData?.map((d: any) => d.value) || [0]))}
                                </div>
                                <p className="text-xs text-muted-foreground">Menor valor registrado</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Máximo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Math.max(...(data?.trafficData?.map((d: any) => d.value) || [0]))}
                                </div>
                                <p className="text-xs text-muted-foreground">Maior valor registrado</p>
                            </CardContent>
                        </Card>
                    </div>

                    <DataTable
                        data={data?.trafficData || []}
                        columns={[
                            { key: "month", label: "Mês" },
                            { key: "value", label: "Quantidade", format: (v: any) => v.toLocaleString() },
                            {
                                key: "value",
                                label: "Variação",
                                format: (v: number, index?: number) => {
                                    if (index === undefined) return "-";
                                    const prev = data?.trafficData[index - 1]?.value;
                                    if (!prev) return "-";
                                    const change = ((v - prev) / prev * 100).toFixed(1);
                                    return change.startsWith('-')
                                        ? <span className="text-red-600">{change}%</span>
                                        : <span className="text-green-600">+{change}%</span>;
                                }
                            },
                        ]}
                        title="Dados Detalhados por Período"
                    />
                </TabsContent>

                {/* Aba: Comparativo */}
                <TabsContent value="comparativo" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <MetricsChart
                            data={data?.yearlyData || []}
                            type="bar"
                            title="Comparativo Anual"
                            subtitle="Ano atual vs Ano anterior"
                            dataKey="atual"
                            secondaryDataKey="anterior"
                            xAxisKey="mes"
                            color="#3b82f6"
                        />
                        <Card>
                            <CardHeader>
                                <CardTitle>Análise Comparativa</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-medium mb-3">Crescimento por Período</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span>Últimos 30 dias:</span>
                                                <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                                    +23.5%
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Últimos 60 dias:</span>
                                                <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                                    +18.2%
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Últimos 90 dias:</span>
                                                <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                                    +15.7%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium mb-3">Destaques</h4>
                                        <ul className="space-y-2">
                                            <li className="flex items-center gap-2 text-sm">
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                                <span>Melhor mês: {data?.trafficData?.reduce((max: any, item: any) =>
                                                    item.value > max.value ? item : max, { value: 0 }).month}</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                <span>Crescimento consistente nos últimos 3 meses</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <div className="w-2 h-2 rounded-full bg-purple-500" />
                                                <span>Categoria com melhor performance: Marketing</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}