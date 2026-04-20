"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WebhookIcon, Database, Zap, Globe, Shield, Bell } from "lucide-react";

const integrations = [
    {
        name: "Webhooks",
        description: "Configure webhooks para receber eventos em tempo real",
        icon: WebhookIcon,
        href: "/dashboard/integrations/webhooks",
        color: "bg-blue-500",
        available: true
    },
    {
        name: "Google Sheets",
        description: "Conecte com Google Sheets para exportar dados automaticamente",
        icon: Database,
        href: "/dashboard/integrations/google-sheets",
        color: "bg-green-500",
        available: true  // ← AGORA ESTÁ DISPONÍVEL
    },
    {
        name: "Slack",
        description: "Receba notificações no Slack sobre eventos importantes",
        icon: Zap,
        href: "/dashboard/integrations/slack",
        color: "bg-purple-500",
        available: false
    },
    {
        name: "Discord",
        description: "Integre com Discord para alertas da sua comunidade",
        icon: Globe,
        href: "/dashboard/integrations/discord",
        color: "bg-indigo-500",
        available: false
    },
    {
        name: "API Keys",
        description: "Gerencie suas chaves de API para integrações externas",
        icon: Shield,
        href: "/dashboard/settings/api",
        color: "bg-red-500",
        available: true
    },
    {
        name: "Notificações",
        description: "Configure notificações para eventos do sistema",
        icon: Bell,
        href: "/dashboard/settings/notifications",
        color: "bg-yellow-500",
        available: true
    }
];

export default function IntegrationsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Integrações</h1>
                <p className="text-muted-foreground">
                    Conecte o AnalyticsPro com outras ferramentas e serviços
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {integrations.map((integration) => {
                    const Icon = integration.icon;
                    return (
                        <Card key={integration.name} className="relative">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${integration.color}`}>
                                        <Icon className="h-5 w-5 text-white" />
                                    </div>
                                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                                </div>
                                <CardDescription>{integration.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {integration.available ? (
                                    <Button asChild variant="outline" className="w-full">
                                        <Link href={integration.href}>Configurar</Link>
                                    </Button>
                                ) : (
                                    <Button disabled variant="outline" className="w-full">
                                        Em breve
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}