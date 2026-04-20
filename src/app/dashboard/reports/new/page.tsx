"use client";

import ReportBuilder from "@/components/reports/ReportBuilder";

export default function NewReportPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Novo Relatório</h1>
                <p className="text-muted-foreground">
                    Crie um relatório personalizado com gráficos e métricas
                </p>
            </div>

            <ReportBuilder />
        </div>
    );
}