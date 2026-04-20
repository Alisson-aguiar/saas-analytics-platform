"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BellPlus, Loader2 } from "lucide-react";

const notificationTemplates = [
    { title: "📊 Relatório Semanal", message: "Seu relatório semanal de vendas está pronto para download.", type: "report" },
    { title: "👥 Novo Membro", message: "João Silva entrou para o time de Marketing.", type: "team" },
    { title: "✅ Upload Concluído", message: "Seu arquivo 'dados_2025.csv' foi processado com sucesso.", type: "success" },
    { title: "⚠️ Limite Atingido", message: "Você atingiu 80% do limite de análises deste mês.", type: "warning" },
    { title: "🎉 Bem-vindo!", message: "Obrigado por usar o AnalyticsPro!", type: "success" },
    { title: "🔔 Nova Funcionalidade", message: "Novos gráficos interativos estão disponíveis!", type: "info" },
    { title: "📈 Tendência Detectada", message: "Identificamos um crescimento de 23% nas suas análises.", type: "success" },
    { title: "👋 Convite", message: "Você foi convidado para participar do time 'Projeto X'.", type: "team" },
    { title: "⚠️ Atenção", message: "Sua sessão expirará em 5 minutos.", type: "warning" },
    { title: "📅 Reunião Agendada", message: "Reunião de alinhamento do time amanhã às 14h.", type: "info" },
];

export function TestNotificationButton() {
    const [loading, setLoading] = useState(false);

    const createTestNotification = async () => {
        setLoading(true);

        // Escolher uma notificação aleatória
        const random = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];

        try {
            const response = await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: random.title,
                    message: random.message,
                    type: random.type
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Notificação criada!', {
                    description: `${random.title} - ${random.message.substring(0, 50)}...`
                });
            } else {
                throw new Error('Falha ao criar');
            }
        } catch (error) {
            toast.error('Erro ao criar notificação');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={createTestNotification}
            variant="outline"
            size="sm"
            disabled={loading}
            className="gap-2"
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <BellPlus className="h-4 w-4" />
            )}
            {loading ? "Criando..." : "Testar Notificação"}
        </Button>
    );
}