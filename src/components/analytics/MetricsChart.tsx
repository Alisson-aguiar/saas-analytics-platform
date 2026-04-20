"use client";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface MetricsChartProps {
    data: any[];
    type: "line" | "bar" | "pie";
    title: string;
    subtitle?: string;
    dataKey?: string;
    secondaryDataKey?: string;
    xAxisKey?: string;
    color?: string;
}

export default function MetricsChart({
    data,
    type,
    title,
    subtitle,
    dataKey = "value",
    secondaryDataKey,
    xAxisKey = "name",
    color = "#3b82f6"
}: MetricsChartProps) {

    const renderTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border rounded-lg shadow-lg">
                    <p className="font-medium mb-1">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name}: {entry.value.toLocaleString()}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const renderChart = () => {
        switch (type) {
            case "line":
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey={xAxisKey}
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={renderTooltip} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey={dataKey}
                                stroke={color}
                                strokeWidth={2}
                                dot={{ fill: color, strokeWidth: 2 }}
                                name="Atual"
                            />
                            {secondaryDataKey && (
                                <Line
                                    type="monotone"
                                    dataKey={secondaryDataKey}
                                    stroke="#9ca3af"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={{ fill: "#9ca3af", strokeWidth: 2 }}
                                    name="Anterior"
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                );

            case "bar":
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey={xAxisKey}
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={renderTooltip} />
                            <Legend />
                            <Bar
                                dataKey={dataKey}
                                fill={color}
                                radius={[4, 4, 0, 0]}
                                name="Atual"
                            />
                            {secondaryDataKey && (
                                <Bar
                                    dataKey={secondaryDataKey}
                                    fill="#9ca3af"
                                    radius={[4, 4, 0, 0]}
                                    name="Anterior"
                                />
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                );

            case "pie":
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => {
                                    // ✅ CORREÇÃO: Verificar se percent existe
                                    const percentage = percent ? (percent * 100).toFixed(0) : "0";
                                    return `${name}: ${percentage}%`;
                                }}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey={dataKey}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={renderTooltip} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                );

            default:
                return null;
        }
    };

    return (
        <Card className="h-[400px]">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">{title}</CardTitle>
                {subtitle && (
                    <CardDescription className="text-sm">{subtitle}</CardDescription>
                )}
            </CardHeader>
            <CardContent className="h-[320px]">
                {renderChart()}
            </CardContent>
        </Card>
    );
}