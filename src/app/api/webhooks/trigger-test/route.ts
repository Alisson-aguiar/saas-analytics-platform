import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/client";
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const { webhookId, event } = await request.json();

        if (!webhookId || !event) {
            return NextResponse.json({ error: "webhookId e event são obrigatórios" }, { status: 400 });
        }

        // Buscar o webhook
        const { data: webhook, error } = await supabaseAdmin
            .from('webhooks')
            .select('*')
            .eq('id', webhookId)
            .eq('user_id', session.user.id)
            .single();

        if (error || !webhook) {
            return NextResponse.json({ error: "Webhook não encontrado" }, { status: 404 });
        }

        if (!webhook.active) {
            return NextResponse.json({ error: "Webhook está desativado" }, { status: 400 });
        }

        // Criar payload de teste
        const testPayload = {
            event,
            timestamp: new Date().toISOString(),
            test: true,
            data: {
                message: "Este é um evento de teste",
                webhook_name: webhook.name,
                triggered_by: session.user.email,
                test_id: crypto.randomUUID()
            }
        };

        // Calcular assinatura
        const signature = crypto
            .createHmac('sha256', webhook.secret)
            .update(JSON.stringify(testPayload))
            .digest('hex');

        const startTime = Date.now();

        try {
            // Disparar webhook
            const response = await fetch(webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Webhook-Event': event,
                    'X-Webhook-Signature': signature,
                    'X-Webhook-Id': webhook.id,
                    'X-Test-Mode': 'true'
                },
                body: JSON.stringify(testPayload)
            });

            const durationMs = Date.now() - startTime;
            const responseText = await response.text();

            // Salvar log
            await supabaseAdmin
                .from('webhook_logs')
                .insert({
                    webhook_id: webhook.id,
                    event,
                    payload: testPayload,
                    response_status: response.status,
                    response_body: responseText,
                    duration_ms: durationMs
                });

            // Atualizar último disparo
            await supabaseAdmin
                .from('webhooks')
                .update({
                    last_triggered_at: new Date().toISOString(),
                    last_status: response.status,
                    last_error: null
                })
                .eq('id', webhook.id);

            return NextResponse.json({
                success: true,
                message: response.status === 200 ? "Webhook disparado com sucesso!" : "Webhook disparado, mas resposta inesperada",
                status: response.status,
                response: responseText,
                duration: durationMs
            });

        } catch (err: any) {
            const durationMs = Date.now() - startTime;

            // Salvar erro no log
            await supabaseAdmin
                .from('webhook_logs')
                .insert({
                    webhook_id: webhook.id,
                    event,
                    payload: testPayload,
                    error: err.message,
                    duration_ms: durationMs
                });

            await supabaseAdmin
                .from('webhooks')
                .update({
                    last_error: err.message
                })
                .eq('id', webhook.id);

            return NextResponse.json({
                success: false,
                error: err.message,
                duration: durationMs
            }, { status: 500 });
        }

    } catch (error) {
        console.error("Erro:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}