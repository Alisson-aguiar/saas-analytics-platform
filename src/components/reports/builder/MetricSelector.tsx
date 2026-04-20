"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BarChart3, Users, Upload, DollarSign, TrendingUp, Target } from "lucide-react";

interface MetricSelectorProps {
    selected: string[];
    onChange: (selected: string[]) => void;
}

const metrics = [
    { id: "totalAnalytics", name: "Total de Análises", icon: BarChart3, description: "Número total de análises realizadas" },
    { id: "activeUsers", name: "Usuários Ativos", icon: Users, description: "Usuários que acessaram nos últimos 7 dias" },
    { id: "filesUploaded", name: "Arquivos Enviados", icon: Upload, description: "Total de arquivos processados" },
    { id: "revenue", name: "Receita Estimada", icon: DollarSign, description: "Receita baseada em análises" },
    { id: "growth", name: "Taxa de Crescimento", icon: TrendingUp, description: "Crescimento comparado ao mês anterior" },
    { id: "conversion", name: "Taxa de Conversão", icon: Target, description: "Conversão de análises em ações" },
];

export default function MetricSelector({ selected, onChange }: MetricSelectorProps) {
    const handleToggle = (metricId: string) => {
        if (selected.includes(metricId)) {
            onChange(selected.filter(id => id !== metricId));
        } else {
            onChange([...selected, metricId]);
        }
    };

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {metrics.map((metric) => {
                const Icon = metric.icon;
                const isSelected = selected.includes(metric.id);

                return (
                    <Card
                        key={metric.id}
                        className={`cursor-pointer transition-colors hover:bg-accent ${isSelected ? "border-primary bg-primary/5" : ""
                            }`}
                        onClick={() => handleToggle(metric.id)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => handleToggle(metric.id)}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                        <Label className="font-medium cursor-pointer">{metric.name}</Label>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {metric.description}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}