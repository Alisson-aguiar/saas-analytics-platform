"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Loader2,
    User,
    Mail,
    Briefcase,
    Building,
    Phone,
    Globe,
    Camera,
    Save
} from "lucide-react";
import { settingsService, UserProfile } from "@/lib/services/settings.service";
import { toast } from "sonner";

interface ProfileSettingsProps {
    userId: string;
}

export function ProfileSettings({ userId }: ProfileSettingsProps) {
    const { data: session, update: updateSession } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        loadProfile();
    }, [userId]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await settingsService.getProfile(userId);
            setProfile(data);
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            toast.error("Erro ao carregar perfil");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!profile) return;

        setSaving(true);
        try {
            // Atualizar avatar se houver
            if (avatarFile) {
                const avatarUrl = await settingsService.updateAvatar(userId, avatarFile);
                if (avatarUrl) {
                    profile.avatarUrl = avatarUrl;
                }
            }

            // Atualizar perfil
            const success = await settingsService.updateProfile(userId, profile);
            if (success) {
                toast.success("Perfil atualizado com sucesso!");
                await updateSession();
                await loadProfile();
                setAvatarFile(null);
                setAvatarPreview(null);
            }
        } catch (error) {
            toast.error("Erro ao atualizar perfil");
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

    if (!profile) {
        return (
            <Alert>
                <AlertDescription>Perfil não encontrado</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            {/* Informações Básicas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Informações Básicas
                    </CardTitle>
                    <CardDescription>
                        Gerencie suas informações pessoais e como você aparece no sistema
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={avatarPreview || profile.avatarUrl} />
                                <AvatarFallback className="text-2xl">
                                    {profile.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <label
                                htmlFor="avatar-upload"
                                className="absolute bottom-0 right-0 p-1 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                            >
                                <Camera className="h-4 w-4" />
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </label>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium">{profile.fullName || 'Seu nome'}</h3>
                            <p className="text-sm text-muted-foreground">
                                Clique no ícone da câmera para alterar sua foto
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Formulário */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Nome completo</Label>
                            <Input
                                id="fullName"
                                value={profile.fullName || ''}
                                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                placeholder="Seu nome completo"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={profile.email || ''}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">
                                O email não pode ser alterado
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="jobTitle">Cargo</Label>
                            <Input
                                id="jobTitle"
                                value={profile.jobTitle || ''}
                                onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                                placeholder="Ex: Analista de Dados"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="company">Empresa</Label>
                            <Input
                                id="company"
                                value={profile.company || ''}
                                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                                placeholder="Nome da empresa"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                                id="phone"
                                value={profile.phone || ''}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                placeholder="(11) 99999-9999"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="timezone">Fuso horário</Label>
                            <select
                                id="timezone"
                                value={profile.timezone}
                                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                                <option value="America/Manaus">Manaus (GMT-4)</option>
                                <option value="America/Fortaleza">Fortaleza (GMT-3)</option>
                                <option value="America/Noronha">Fernando de Noronha (GMT-2)</option>
                                <option value="America/Belem">Belém (GMT-3)</option>
                                <option value="America/Cuiaba">Cuiabá (GMT-4)</option>
                                <option value="America/Campo_Grande">Campo Grande (GMT-4)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="language">Idioma</Label>
                            <select
                                id="language"
                                value={profile.language}
                                onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="pt-BR">Português (Brasil)</option>
                                <option value="en-US">English (US)</option>
                                <option value="es">Español</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Botão Salvar */}
            <div className="flex justify-end">
                <Button
                    size="lg"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    Salvar Alterações
                </Button>
            </div>
        </div>
    );
}