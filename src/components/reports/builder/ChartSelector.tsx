"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { BarChart3, LineChart, PieChart, Table } from "lucide-react";

interface ChartSelectorProps {
    selected: string[];
    onChange: (selected: string[]) => void;
}

const chartTypes = [
    { id: "line", name: "Gráfico de Linha", icon: LineChart, description: "Tendências ao longo do tempo" },
    { id: "bar", name: "Gráfico de Barras", icon: BarChart3, description: "Comparação entre categorias" },
    { id: "pie", name: "Gráfico de Pizza", icon: PieChart, description: "Distribuição percentual" },
    { id: "table", name: "Tabela", icon: Table, description: "Visualização em tabela" },
];

export default function ChartSelector({ selected, onChange }: ChartSelectorProps) {
    const handleToggle = (chartId: string) => {
        if (selected.includes(chartId)) {
            onChange(selected.filter(id => id !== chartId));
        } else {
            onChange([...selected, chartId]);
        }
    };

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {chartTypes.map((chart) => {
                const Icon = chart.icon;
                const isSelected = selected.includes(chart.id);

                return (
                    <Card
                        key={chart.id}
                        className={`cursor-pointer transition-colors hover:bg-accent ${isSelected ? "border-primary bg-primary/5" : ""
                            }`}
                        onClick={() => handleToggle(chart.id)}
                    >
                        <CardHeader className="flex flex-row items-start space-y-0 gap-3">
                            <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => handleToggle(chart.id)}
                                className="mt-1"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <Icon className="h-5 w-5 text-muted-foreground" />
                                    <CardTitle className="text-base">{chart.name}</CardTitle>
                                </div>
                                <CardDescription className="mt-1">
                                    {chart.description}
                                </CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                );
            })}
        </div>
    );
}