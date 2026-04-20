"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Plus, Copy, Star, Eye } from "lucide-react";
import { toast } from "sonner";

interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    config: any;
    isPublic: boolean;
    usageCount: number;
}

export default function ReportTemplatesPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [templates, setTemplates] = useState<ReportTemplate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            // Simular carregamento de templates
            const mockTemplates: ReportTemplate[] = [
                {
                    id: "1",
                    name: "Relatório de Vendas",
                    description: "Template para análise de vendas mensais",
                    config: { charts: ["line", "bar"], metrics: ["revenue", "sales"] },
                    isPublic: true,
                    usageCount: 128
                },
                {
                    id: "2",
                    name: "Performance de Marketing",
                    description: "Análise de campanhas e ROI",
                    config: { charts: ["pie", "line"], metrics: ["conversion", "roi"] },
                    isPublic: true,
                    usageCount: 89
                },
                {
                    id: "3",
                    name: "Dashboard Executivo",
                    description: "Visão geral do negócio",
                    config: { charts: ["line", "bar", "pie"], metrics: ["all"] },
                    isPublic: false,
                    usageCount: 45
                }
            ];
            setTemplates(mockTemplates);
        } catch (error) {
            console.error("Erro ao carregar templates:", error);
            toast.error("Erro ao carregar templates");
        } finally {
            setLoading(false);
        }
    };

    const handleUseTemplate = (template: ReportTemplate) => {
        router.push(`/dashboard/reports/new?template=${template.id}`);
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
                    <h1 className="text-3xl font-bold tracking-tight">Templates de Relatórios</h1>
                    <p className="text-muted-foreground">
                        Utilize templates prontos para criar relatórios rapidamente
                    </p>
                </div>
                <Button onClick={() => router.push("/dashboard/reports/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Relatório
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                    <Card key={template.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        {template.name}
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        {template.description}
                                    </CardDescription>
                                </div>
                                {template.isPublic && (
                                    <Badge variant="secondary">Público</Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        {template.usageCount} usos
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3" />
                                        {template.config.charts.length} gráficos
                                    </div>
                                </div>
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => handleUseTemplate(template)}
                                >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Usar Template
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}