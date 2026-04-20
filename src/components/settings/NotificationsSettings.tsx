"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Bell, Mail, Smartphone, Calendar, Save, Loader2 } from "lucide-react";
import { settingsService, NotificationPreferences } from "@/lib/services/settings.service";

interface NotificationsSettingsProps {
    userId: string;
}

export function NotificationsSettings({ userId }: NotificationsSettingsProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preferences, setPreferences] = useState<NotificationPreferences>({
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false,
        teamInvites: true,
        newReports: true,
        dataUpdates: true,
        weeklyDigest: false,
    });

    useEffect(() => {
        loadPreferences();
    }, [userId]);

    const loadPreferences = async () => {
        try {
            setLoading(true);
            const data = await settingsService.getNotificationPreferences(userId);
            setPreferences(data);
        } catch (error) {
            console.error("Erro ao carregar preferências:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const success = await settingsService.updateNotificationPreferences(userId, preferences);
            if (success) {
                toast.success("Preferências salvas", {
                    description: "Suas configurações de notificação foram atualizadas"
                });
            }
        } catch (error) {
            toast.error("Erro ao salvar preferências");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notificações
                </CardTitle>
                <CardDescription>
                    Configure como e quando você deseja ser notificado
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Canais de Notificação */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Canais de Notificação</h3>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <Label htmlFor="emailNotifications">Notificações por Email</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receba notificações importantes no seu email
                                </p>
                            </div>
                        </div>
                        <Switch
                            id="emailNotifications"
                            checked={preferences.emailNotifications}
                            onCheckedChange={(checked) =>
                                setPreferences({ ...preferences, emailNotifications: checked })
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <Label htmlFor="pushNotifications">Notificações Push</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receba notificações em tempo real no navegador
                                </p>
                            </div>
                        </div>
                        <Switch
                            id="pushNotifications"
                            checked={preferences.pushNotifications}
                            onCheckedChange={(checked) =>
                                setPreferences({ ...preferences, pushNotifications: checked })
                            }
                        />
                    </div>
                </div>

                <Separator />

                {/* Tipos de Notificação */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">O que você quer receber?</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="teamInvites">Convites para times</Label>
                            <Switch
                                id="teamInvites"
                                checked={preferences.teamInvites}
                                onCheckedChange={(checked) =>
                                    setPreferences({ ...preferences, teamInvites: checked })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="newReports">Novos relatórios</Label>
                            <Switch
                                id="newReports"
                                checked={preferences.newReports}
                                onCheckedChange={(checked) =>
                                    setPreferences({ ...preferences, newReports: checked })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="dataUpdates">Atualizações de dados</Label>
                            <Switch
                                id="dataUpdates"
                                checked={preferences.dataUpdates}
                                onCheckedChange={(checked) =>
                                    setPreferences({ ...preferences, dataUpdates: checked })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="weeklyDigest">Resumo semanal</Label>
                            <Switch
                                id="weeklyDigest"
                                checked={preferences.weeklyDigest}
                                onCheckedChange={(checked) =>
                                    setPreferences({ ...preferences, weeklyDigest: checked })
                                }
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Marketing */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Comunicações de Marketing</h3>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="marketingEmails">Emails de marketing</Label>
                            <p className="text-sm text-muted-foreground">
                                Receba novidades, dicas e promoções
                            </p>
                        </div>
                        <Switch
                            id="marketingEmails"
                            checked={preferences.marketingEmails}
                            onCheckedChange={(checked) =>
                                setPreferences({ ...preferences, marketingEmails: checked })
                            }
                        />
                    </div>

                    <Alert>
                        <AlertDescription>
                            Você pode cancelar a inscrição a qualquer momento. Seus dados nunca serão compartilhados com terceiros.
                        </AlertDescription>
                    </Alert>
                </div>

                {/* Botão Salvar */}
                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={saving} size="lg">
                        {saving ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Salvar Preferências
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}