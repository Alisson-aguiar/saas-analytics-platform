"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import StatsCard from "@/components/dashboard/StatsCard";
import LineChart from "@/components/charts/LineChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Upload, DollarSign, Loader2, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando dados do dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta! Aqui está o resumo das suas análises.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Análises"
          value={data.totalAnalytics.toLocaleString()}
          description={`+${data.revenueGrowth}% em relação ao mês anterior`}
          icon={BarChart3}
          trend={data.revenueGrowth > 0 ? "up" : "down"}
        />
        <StatsCard
          title="Usuários Ativos"
          value={data.activeUsers.toLocaleString()}
          description={`+${data.userGrowth}% na última semana`}
          icon={Users}
          trend={data.userGrowth > 0 ? "up" : "down"}
        />
        <StatsCard
          title="Arquivos Enviados"
          value={data.filesUploaded.toString()}
          description={`${data.filesUploaded > 0 ? '+' : ''}${data.filesUploaded} no total`}
          icon={Upload}
          trend="neutral"
        />
        <StatsCard
          title="Receita Estimada"
          value={formatCurrency(data.revenue)}
          description={`+${data.revenueGrowth}% este mês`}
          icon={DollarSign}
          trend={data.revenueGrowth > 0 ? "up" : "down"}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tráfego de Análises</CardTitle>
            <CardDescription>
              Últimos {data.trafficData.length} meses de atividade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={data.trafficData}
              dataKey="value"
              color="#3b82f6"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crescimento de Receita</CardTitle>
            <CardDescription>
              Projeção baseada em análises mensais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={data.revenueData}
              dataKey="value"
              color="#10b981"
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Últimas ações no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div>
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-sm text-gray-500">
                    {activity.action} {activity.file}
                  </p>
                </div>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Sources Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Fontes de Dados</CardTitle>
          <CardDescription>Arquivos processados e disponíveis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-gray-600">Total de Arquivos</p>
              <p className="text-2xl font-bold">{data.filesUploaded}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-gray-600">Último Upload</p>
              <p className="text-2xl font-bold">Hoje</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-gray-600">Espaço Utilizado</p>
              <p className="text-2xl font-bold">245 MB</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}