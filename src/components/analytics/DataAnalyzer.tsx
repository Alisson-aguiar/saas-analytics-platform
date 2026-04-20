"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BarChart3,
    PieChart,
    LineChart as LineChartIcon,
    TrendingUp,
    Filter,
    Download,
    Calculator,
    AlertCircle,
    CheckCircle,
    FileText,
    Printer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import { Progress } from "@/components/ui/progress";
import { exportToJSON, exportToCSV, exportToPDF } from "@/lib/export";

interface DataAnalyzerProps {
    data: any[];
    columns: string[];
}

export default function DataAnalyzer({ data, columns }: DataAnalyzerProps) {
    const [activeAnalysis, setActiveAnalysis] = useState<string>("basic");
    const [analysisResults, setAnalysisResults] = useState<any>(null);
    const [analyzing, setAnalyzing] = useState(false);

    const performAnalysis = (type: string) => {
        setAnalyzing(true);
        setActiveAnalysis(type);

        // Simular processamento de análise
        setTimeout(() => {
            let results: any = {};

            switch (type) {
                case "basic":
                    results = performBasicAnalysis(data, columns);
                    break;
                case "visualization":
                    results = performVisualizationAnalysis(data, columns);
                    break;
                case "correlation":
                    results = performCorrelationAnalysis(data, columns);
                    break;
                case "trend":
                    results = performTrendAnalysis(data, columns);
                    break;
                case "cleaning":
                    results = performCleaningAnalysis(data, columns);
                    break;
                default:
                    results = { error: "Tipo de análise desconhecido" };
            }

            setAnalysisResults(results);
            setAnalyzing(false);
        }, 1500);
    };

    const performBasicAnalysis = (data: any[], columns: string[]) => {
        const numericColumns = columns.filter(col =>
            data.some(row => !isNaN(parseFloat(row[col])) && row[col] !== "")
        );

        const stats: any = {};

        numericColumns.forEach(col => {
            const values = data
                .map(row => parseFloat(row[col]))
                .filter(val => !isNaN(val));

            if (values.length > 0) {
                const sorted = values.sort((a, b) => a - b);
                const sum = sorted.reduce((a, b) => a + b, 0);
                const mean = sum / values.length;
                const median = sorted[Math.floor(values.length / 2)];
                const min = Math.min(...values);
                const max = Math.max(...values);

                stats[col] = {
                    count: values.length,
                    mean: mean.toFixed(2),
                    median: median.toFixed(2),
                    min: min.toFixed(2),
                    max: max.toFixed(2),
                    sum: sum.toFixed(2),
                    missing: data.length - values.length
                };
            }
        });

        return {
            type: "basic",
            timestamp: new Date().toISOString(),
            totalRows: data.length,
            totalColumns: columns.length,
            numericColumns: numericColumns.length,
            stats,
            suggestions: numericColumns.length > 0
                ? ["Os dados parecem bons para análise numérica"]
                : ["Nenhuma coluna numérica encontrada para análise"]
        };
    };

    const performVisualizationAnalysis = (data: any[], columns: string[]) => {
        const numericColumns = columns.filter(col =>
            data.some(row => !isNaN(parseFloat(row[col])) && row[col] !== "")
        );

        const chartData = numericColumns.slice(0, 3).map(col => {
            const values = data
                .map(row => parseFloat(row[col]))
                .filter(val => !isNaN(val));

            return {
                column: col,
                data: values.slice(0, 20).map((value, index) => ({
                    index: index + 1,
                    value
                }))
            };
        });

        return {
            type: "visualization",
            chartData,
            suggestedCharts: [
                "Gráfico de Linhas para séries temporais",
                "Gráfico de Barras para comparações",
                "Gráfico de Pizza para proporções"
            ]
        };
    };

    const performCorrelationAnalysis = (data: any[], columns: string[]) => {
        const numericColumns = columns.filter(col =>
            data.some(row => !isNaN(parseFloat(row[col])) && row[col] !== "")
        );

        const correlations: any[] = [];

        for (let i = 0; i < numericColumns.length; i++) {
            for (let j = i + 1; j < numericColumns.length; j++) {
                const col1 = numericColumns[i];
                const col2 = numericColumns[j];

                const values1 = data.map(row => parseFloat(row[col1])).filter(v => !isNaN(v));
                const values2 = data.map(row => parseFloat(row[col2])).filter(v => !isNaN(v));

                if (values1.length > 0 && values2.length > 0) {
                    const correlation = calculateCorrelation(values1, values2);
                    correlations.push({
                        pair: `${col1} - ${col2}`,
                        correlation: correlation.toFixed(3),
                        strength: Math.abs(correlation) > 0.7 ? "Forte" :
                            Math.abs(correlation) > 0.3 ? "Moderada" : "Fraca"
                    });
                }
            }
        }

        return {
            type: "correlation",
            correlations: correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation)),
            topCorrelations: correlations.slice(0, 5)
        };
    };

    const calculateCorrelation = (x: number[], y: number[]) => {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

        return denominator === 0 ? 0 : numerator / denominator;
    };

    const performTrendAnalysis = (data: any[], columns: string[]) => {
        const trends: any[] = [];

        columns.forEach(col => {
            const values = data
                .map(row => parseFloat(row[col]))
                .filter(val => !isNaN(val));

            if (values.length > 1) {
                const first = values[0];
                const last = values[values.length - 1];
                const change = ((last - first) / first) * 100;

                trends.push({
                    column: col,
                    trend: change > 0 ? "Ascendente" : change < 0 ? "Descendente" : "Estável",
                    change: change.toFixed(2) + "%",
                    magnitude: Math.abs(change) > 20 ? "Significativa" :
                        Math.abs(change) > 5 ? "Moderada" : "Mínima"
                });
            }
        });

        return {
            type: "trend",
            trends,
            overallTrend: trends.length > 0 ?
                trends.filter(t => t.trend === "Ascendente").length > trends.filter(t => t.trend === "Descendente").length
                    ? "Geralmente Ascendente" : "Geralmente Descendente"
                : "Sem Tendência"
        };
    };

    const performCleaningAnalysis = (data: any[], columns: string[]) => {
        const issues: any[] = [];

        columns.forEach(col => {
            const total = data.length;
            const missing = data.filter(row => row[col] === "" || row[col] === null || row[col] === undefined).length;
            const numericValues = data.filter(row => !isNaN(parseFloat(row[col]))).length;
            const uniqueValues = new Set(data.map(row => row[col])).size;

            if (missing > 0) {
                issues.push({
                    column: col,
                    issue: "Valores Ausentes",
                    count: missing,
                    percentage: ((missing / total) * 100).toFixed(1) + "%",
                    suggestion: "Considere imputação ou remoção"
                });
            }

            if (uniqueValues === 1) {
                issues.push({
                    column: col,
                    issue: "Valores Constantes",
                    count: total,
                    percentage: "100%",
                    suggestion: "Considere remover esta coluna"
                });
            }

            if (uniqueValues === total && total > 10) {
                issues.push({
                    column: col,
                    issue: "Alta Cardinalidade",
                    count: uniqueValues,
                    percentage: ((uniqueValues / total) * 100).toFixed(1) + "%",
                    suggestion: "Considere agrupamento ou codificação"
                });
            }
        });

        return {
            type: "cleaning",
            totalRows: data.length,
            totalColumns: columns.length,
            issues,
            suggestions: issues.length === 0
                ? ["Os dados parecem limpos! Nenhum problema encontrado."]
                : ["Considere resolver os problemas acima antes da análise"]
        };
    };

    const analysisTypes = [
        {
            id: "basic",
            title: "Estatísticas Básicas",
            description: "Média, mediana, moda, mínimo, máximo, soma",
            icon: Calculator,
            color: "bg-blue-100 text-blue-700"
        },
        {
            id: "visualization",
            title: "Visualização de Dados",
            description: "Gráficos para obter insights",
            icon: BarChart3,
            color: "bg-green-100 text-green-700"
        },
        {
            id: "correlation",
            title: "Análise de Correlação",
            description: "Encontre relações entre variáveis",
            icon: TrendingUp,
            color: "bg-purple-100 text-purple-700"
        },
        {
            id: "trend",
            title: "Análise de Tendência",
            description: "Identifique padrões ao longo do tempo/índice",
            icon: LineChartIcon,
            color: "bg-orange-100 text-orange-700"
        },
        {
            id: "cleaning",
            title: "Limpeza de Dados",
            description: "Lide com valores ausentes e problemas",
            icon: Filter,
            color: "bg-red-100 text-red-700"
        }
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {analysisTypes.map((analysis) => (
                    <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium">{analysis.title}</CardTitle>
                                <analysis.icon className={`h-5 w-5 ${analysis.color.split(' ')[1]}`} />
                            </div>
                            <CardDescription>{analysis.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                className="w-full"
                                onClick={() => performAnalysis(analysis.id)}
                                disabled={analyzing}
                            >
                                {analyzing && activeAnalysis === analysis.id ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                        Analisando...
                                    </>
                                ) : (
                                    "Analisar"
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {analyzing && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Executando {analysisTypes.find(a => a.id === activeAnalysis)?.title}...</span>
                                <span className="text-sm text-gray-500">Aguarde</span>
                            </div>
                            <Progress value={66} className="h-2" />
                            <p className="text-sm text-gray-600">
                                Processando {data.length} linhas e {columns.length} colunas...
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {analysisResults && !analyzing && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Resultados da Análise</CardTitle>
                                <CardDescription>
                                    {analysisTypes.find(a => a.id === analysisResults.type)?.title}
                                </CardDescription>
                            </div>
                            <Badge variant="outline">
                                {new Date(analysisResults.timestamp).toLocaleTimeString()}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="results">
                            <TabsList>
                                <TabsTrigger value="results">Resultados</TabsTrigger>
                                <TabsTrigger value="insights">Insights</TabsTrigger>
                                <TabsTrigger value="export">Exportar</TabsTrigger>
                            </TabsList>

                            <TabsContent value="results" className="space-y-4">
                                {analysisResults.type === "basic" && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <Card>
                                                <CardContent className="pt-6">
                                                    <div className="text-2xl font-bold">{analysisResults.totalRows}</div>
                                                    <p className="text-sm text-gray-600">Total de Linhas</p>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardContent className="pt-6">
                                                    <div className="text-2xl font-bold">{analysisResults.totalColumns}</div>
                                                    <p className="text-sm text-gray-600">Total de Colunas</p>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardContent className="pt-6">
                                                    <div className="text-2xl font-bold">{analysisResults.numericColumns}</div>
                                                    <p className="text-sm text-gray-600">Colunas Numéricas</p>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-semibold">Resumo Estatístico</h4>
                                            {Object.entries(analysisResults.stats).map(([column, stats]: [string, any]) => (
                                                <Card key={column}>
                                                    <CardHeader className="pb-2">
                                                        <CardTitle className="text-sm font-medium">{column}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-sm">
                                                            <div>
                                                                <p className="font-medium">Média</p>
                                                                <p className="text-gray-600">{stats.mean}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">Mediana</p>
                                                                <p className="text-gray-600">{stats.median}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">Mínimo</p>
                                                                <p className="text-gray-600">{stats.min}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">Máximo</p>
                                                                <p className="text-gray-600">{stats.max}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">Soma</p>
                                                                <p className="text-gray-600">{stats.sum}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">Faltantes</p>
                                                                <p className="text-gray-600">{stats.missing}</p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {analysisResults.type === "visualization" && (
                                    <div className="space-y-4">
                                        <div className="grid gap-4">
                                            {analysisResults.chartData.map((chart: any, index: number) => (
                                                <Card key={index}>
                                                    <CardHeader>
                                                        <CardTitle className="text-sm font-medium">
                                                            Valores de {chart.column}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="h-[200px]">
                                                            <LineChart
                                                                data={chart.data}
                                                                dataKey="value"
                                                            />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {analysisResults.type === "correlation" && (
                                    <div className="space-y-4">
                                        <Alert>
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                Encontradas {analysisResults.correlations.length} correlações
                                            </AlertDescription>
                                        </Alert>

                                        <div className="space-y-2">
                                            <h4 className="font-semibold">Principais Correlações</h4>
                                            <div className="grid gap-2">
                                                {analysisResults.topCorrelations.map((corr: any, index: number) => (
                                                    <Card key={index}>
                                                        <CardContent className="pt-4">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-medium">{corr.pair}</span>
                                                                <Badge variant={
                                                                    corr.strength === "Forte" ? "default" :
                                                                        corr.strength === "Moderada" ? "secondary" : "outline"
                                                                }>
                                                                    {corr.correlation} ({corr.strength})
                                                                </Badge>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {analysisResults.type === "trend" && (
                                    <div className="space-y-4">
                                        <Alert>
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                Tendência geral: {analysisResults.overallTrend}
                                            </AlertDescription>
                                        </Alert>

                                        <div className="space-y-2">
                                            <h4 className="font-semibold">Tendências por Coluna</h4>
                                            <div className="grid gap-2">
                                                {analysisResults.trends.map((trend: any, index: number) => (
                                                    <Card key={index}>
                                                        <CardContent className="pt-4">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-medium">{trend.column}</span>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant={
                                                                        trend.trend === "Ascendente" ? "default" :
                                                                            trend.trend === "Descendente" ? "destructive" : "secondary"
                                                                    }>
                                                                        {trend.trend}
                                                                    </Badge>
                                                                    <span className="text-sm">{trend.change}</span>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Mudança {trend.magnitude.toLowerCase()}
                                                            </p>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {analysisResults.type === "cleaning" && (
                                    <div className="space-y-4">
                                        <Alert variant={analysisResults.issues.length === 0 ? "default" : "destructive"}>
                                            {analysisResults.issues.length === 0 ? (
                                                <CheckCircle className="h-4 w-4" />
                                            ) : (
                                                <AlertCircle className="h-4 w-4" />
                                            )}
                                            <AlertDescription>
                                                {analysisResults.issues.length === 0
                                                    ? "Nenhum problema de qualidade dos dados encontrado!"
                                                    : `Encontrados ${analysisResults.issues.length} problemas de qualidade dos dados`}
                                            </AlertDescription>
                                        </Alert>

                                        {analysisResults.issues.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="font-semibold">Problemas Encontrados</h4>
                                                <div className="grid gap-2">
                                                    {analysisResults.issues.map((issue: any, index: number) => (
                                                        <Card key={index}>
                                                            <CardContent className="pt-4">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="font-medium">{issue.column}</p>
                                                                        <p className="text-sm text-gray-600">{issue.issue}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="font-medium">{issue.count} linhas</p>
                                                                        <p className="text-sm text-gray-600">{issue.percentage}</p>
                                                                    </div>
                                                                </div>
                                                                <p className="text-sm text-blue-600 mt-2">
                                                                    Sugestão: {issue.suggestion}
                                                                </p>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="insights">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Insights e Recomendações</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <h4 className="font-semibold">Principais Descobertas</h4>
                                            <ul className="space-y-2">
                                                <li className="flex items-start gap-2">
                                                    <div className="h-2 w-2 mt-2 rounded-full bg-blue-500" />
                                                    <span>O conjunto de dados contém {data.length} linhas e {columns.length} colunas</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <div className="h-2 w-2 mt-2 rounded-full bg-blue-500" />
                                                    <span>Análise concluída às {new Date().toLocaleTimeString()}</span>
                                                </li>
                                                {analysisResults.suggestions?.map((suggestion: string, index: number) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <div className="h-2 w-2 mt-2 rounded-full bg-green-500" />
                                                        <span>{suggestion}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="font-semibold">Próximos Passos</h4>
                                            <ul className="space-y-2">
                                                <li className="flex items-start gap-2">
                                                    <div className="h-2 w-2 mt-2 rounded-full bg-purple-500" />
                                                    <span>Considere exportar os resultados para análise adicional</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <div className="h-2 w-2 mt-2 rounded-full bg-purple-500" />
                                                    <span>Experimente diferentes tipos de análise para insights abrangentes</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <div className="h-2 w-2 mt-2 rounded-full bg-purple-500" />
                                                    <span>Compartilhe os resultados com sua equipe para colaboração</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="export">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Exportar Resultados</CardTitle>
                                        <CardDescription>
                                            Baixe seus resultados de análise em vários formatos
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-3">
                                            <Card>
                                                <CardContent className="pt-6">
                                                    <div className="text-center space-y-4">
                                                        <Download className="mx-auto h-8 w-8 text-gray-400" />
                                                        <Button
                                                            className="w-full"
                                                            variant="outline"
                                                            onClick={() => exportToJSON(analysisResults, `analise_${analysisResults.type}`)}
                                                        >
                                                            Exportar como JSON
                                                        </Button>
                                                        <p className="text-sm text-gray-600">
                                                            Resultados completos da análise em formato JSON
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardContent className="pt-6">
                                                    <div className="text-center space-y-4">
                                                        <FileText className="mx-auto h-8 w-8 text-gray-400" />
                                                        <Button
                                                            className="w-full"
                                                            variant="outline"
                                                            onClick={() => {
                                                                // Converter resultados da análise para formato de array para CSV
                                                                const csvData = analysisResults.type === "basic" && analysisResults.stats
                                                                    ? Object.entries(analysisResults.stats).map(([column, stats]: [string, any]) => ({
                                                                        column,
                                                                        ...stats
                                                                    }))
                                                                    : [analysisResults];
                                                                exportToCSV(csvData, `analise_${analysisResults.type}`);
                                                            }}
                                                        >
                                                            Exportar como CSV
                                                        </Button>
                                                        <p className="text-sm text-gray-600">
                                                            Estatísticas resumidas em formato CSV
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardContent className="pt-6">
                                                    <div className="text-center space-y-4">
                                                        <Printer className="mx-auto h-8 w-8 text-gray-400" />
                                                        <Button
                                                            className="w-full"
                                                            variant="outline"
                                                            onClick={() => exportToPDF(
                                                                `Relatório de Análise - ${analysisResults.type}`,
                                                                analysisResults,
                                                                analysisResults
                                                            )}
                                                        >
                                                            Exportar como PDF
                                                        </Button>
                                                        <p className="text-sm text-gray-600">
                                                            Relatório imprimível em formato PDF
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}