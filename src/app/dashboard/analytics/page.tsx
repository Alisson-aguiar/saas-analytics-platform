"use client";

import { useState } from "react";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import DateRangeSelector from "@/components/analytics/DateRangeSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState({
        from: new Date(new Date().setDate(new Date().getDate() - 30)),
        to: new Date()
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Análises</h1>
                    <p className="text-muted-foreground">
                        Visualize e analise seus dados em tempo real
                    </p>
                </div>
                <DateRangeSelector value={dateRange} onChange={setDateRange} />
            </div>

            <AnalyticsDashboard dateRange={dateRange} />
        </div>
    );
}