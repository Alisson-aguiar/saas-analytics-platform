import { supabase, supabaseAdmin } from "@/lib/supabase/client";
import crypto from 'crypto';

export interface Webhook {
    id: string;
    userId: string;
    name: string;
    url: string;
    events: string[];
    secret: string;
    active: boolean;
    lastTriggeredAt?: Date;
    lastStatus?: number;
    lastError?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface WebhookLog {
    id: string;
    webhookId: string;
    event: string;
    payload: any;
    responseStatus?: number;
    responseBody?: string;
    durationMs?: number;
    error?: string;
    createdAt: Date;
}

export class WebhookService {
    // ============================================
    // WEBHOOKS CRUD
    // ============================================

    async getUserWebhooks(userId: string): Promise<Webhook[]> {
        try {
            const { data, error } = await supabase
                .from('webhooks')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return (data || []).map(w => ({
                id: w.id,
                userId: w.user_id,
                name: w.name,
                url: w.url,
                events: w.events,
                secret: w.secret,
                active: w.active,
                lastTriggeredAt: w.last_triggered_at ? new Date(w.last_triggered_at) : undefined,
                lastStatus: w.last_status,
                lastError: w.last_error,
                createdAt: new Date(w.created_at),
                updatedAt: new Date(w.updated_at)
            }));
        } catch (error) {
            console.error("Erro ao buscar webhooks:", error);
            return [];
        }
    }

    async createWebhook(userId: string, data: { name: string; url: string; events: string[] }): Promise<Webhook | null> {
        try {
            // Gerar secret aleatório
            const secret = crypto.randomBytes(32).toString('hex');

            const { data: webhook, error } = await supabaseAdmin
                .from('webhooks')
                .insert({
                    user_id: userId,
                    name: data.name,
                    url: data.url,
                    events: data.events,
                    secret
                })
                .select()
                .single();

            if (error) throw error;

            return {
                id: webhook.id,
                userId: webhook.user_id,
                name: webhook.name,
                url: webhook.url,
                events: webhook.events,
                secret: webhook.secret,
                active: webhook.active,
                createdAt: new Date(webhook.created_at),
                updatedAt: new Date(webhook.updated_at)
            };
        } catch (error) {
            console.error("Erro ao criar webhook:", error);
            return null;
        }
    }

    async updateWebhook(webhookId: string, data: Partial<Webhook>): Promise<boolean> {
        try {
            const { error } = await supabaseAdmin
                .from('webhooks')
                .update({
                    name: data.name,
                    url: data.url,
                    events: data.events,
                    active: data.active,
                    updated_at: new Date().toISOString()
                })
                .eq('id', webhookId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Erro ao atualizar webhook:", error);
            return false;
        }
    }

    async deleteWebhook(webhookId: string): Promise<boolean> {
        try {
            const { error } = await supabaseAdmin
                .from('webhooks')
                .delete()
                .eq('id', webhookId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Erro ao deletar webhook:", error);
            return false;
        }
    }

    async getWebhookLogs(webhookId: string, limit: number = 50): Promise<WebhookLog[]> {
        try {
            const { data, error } = await supabase
                .from('webhook_logs')
                .select('*')
                .eq('webhook_id', webhookId)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return (data || []).map(l => ({
                id: l.id,
                webhookId: l.webhook_id,
                event: l.event,
                payload: l.payload,
                responseStatus: l.response_status,
                responseBody: l.response_body,
                durationMs: l.duration_ms,
                error: l.error,
                createdAt: new Date(l.created_at)
            }));
        } catch (error) {
            console.error("Erro ao buscar logs:", error);
            return [];
        }
    }

    // ============================================
    // DISPARAR WEBHOOKS
    // ============================================

    async triggerWebhooks(event: string, payload: any, userId?: string): Promise<void> {
        try {
            // Buscar webhooks ativos para o evento
            let query = supabase
                .from('webhooks')
                .select('*')
                .eq('active', true)
                .contains('events', [event]);

            if (userId) {
                query = query.eq('user_id', userId);
            }

            const { data: webhooks, error } = await query;

            if (error) throw error;

            // Disparar cada webhook
            for (const webhook of webhooks || []) {
                this.dispatchWebhook(webhook, event, payload);
            }
        } catch (error) {
            console.error("Erro ao disparar webhooks:", error);
        }
    }

    private async dispatchWebhook(webhook: any, event: string, payload: any): Promise<void> {
        const startTime = Date.now();
        const signature = crypto
            .createHmac('sha256', webhook.secret)
            .update(JSON.stringify(payload))
            .digest('hex');

        try {
            const response = await fetch(webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Webhook-Event': event,
                    'X-Webhook-Signature': signature,
                    'X-Webhook-Id': webhook.id
                },
                body: JSON.stringify(payload)
            });

            const durationMs = Date.now() - startTime;

            // Salvar log
            await supabaseAdmin
                .from('webhook_logs')
                .insert({
                    webhook_id: webhook.id,
                    event,
                    payload,
                    response_status: response.status,
                    response_body: await response.text(),
                    duration_ms: durationMs
                });

            // Atualizar último disparo do webhook
            await supabaseAdmin
                .from('webhooks')
                .update({
                    last_triggered_at: new Date().toISOString(),
                    last_status: response.status
                })
                .eq('id', webhook.id);

        } catch (error: any) {
            // Salvar erro
            await supabaseAdmin
                .from('webhook_logs')
                .insert({
                    webhook_id: webhook.id,
                    event,
                    payload,
                    error: error.message,
                    duration_ms: Date.now() - startTime
                });

            await supabaseAdmin
                .from('webhooks')
                .update({
                    last_error: error.message
                })
                .eq('id', webhook.id);
        }
    }
}

export const webhookService = new WebhookService();