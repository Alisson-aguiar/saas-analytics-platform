import { supabase } from "@/lib/supabase/client";

export interface UserProfile {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    jobTitle?: string;
    company?: string;
    phone?: string;
    timezone?: string;
    language?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface NotificationPreferences {
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    teamInvites: boolean;
    newReports: boolean;
    dataUpdates: boolean;
    weeklyDigest: boolean;
}

export interface AppearancePreferences {
    theme: 'light' | 'dark' | 'system';
    primaryColor: string;
    fontSize: 'small' | 'medium' | 'large';
    compactMode: boolean;
    reducedMotion: boolean;
    highContrast: boolean;
}

export interface SecuritySettings {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    lastPasswordChange?: Date;
    recentActivities: ActivityLog[];
}

export interface ActivityLog {
    id: string;
    action: string;
    ip?: string;
    device?: string;
    location?: string;
    createdAt: Date;
}

export interface ApiKey {
    id: string;
    name: string;
    key: string;
    createdAt: Date;
    lastUsed?: Date;
    expiresAt?: Date;
}

export class SettingsService {
    // ============================================
    // PERFIL DO USUÁRIO
    // ============================================

    async getProfile(userId: string): Promise<UserProfile | null> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            return {
                id: data.id,
                email: data.email,
                fullName: data.full_name,
                avatarUrl: data.avatar_url,
                jobTitle: data.job_title,
                company: data.company,
                phone: data.phone,
                timezone: data.timezone || 'America/Sao_Paulo',
                language: data.language || 'pt-BR',
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at)
            };
        } catch (error) {
            console.error("Erro ao buscar perfil:", error);
            return null;
        }
    }

    async updateProfile(userId: string, profile: Partial<UserProfile>): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: profile.fullName,
                    avatar_url: profile.avatarUrl,
                    job_title: profile.jobTitle,
                    company: profile.company,
                    phone: profile.phone,
                    timezone: profile.timezone,
                    language: profile.language,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            return false;
        }
    }

    async updateAvatar(userId: string, file: File): Promise<string | null> {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/avatar.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            await this.updateProfile(userId, { avatarUrl: urlData.publicUrl });

            return urlData.publicUrl;
        } catch (error) {
            console.error("Erro ao atualizar avatar:", error);
            return null;
        }
    }

    // ============================================
    // PREFERÊNCIAS DE APARÊNCIA
    // ============================================

    async getAppearancePreferences(userId: string): Promise<AppearancePreferences> {
        try {
            const { data, error } = await supabase
                .from('user_preferences')
                .select('theme, primary_color, font_size, compact_mode, reduced_motion, high_contrast')
                .eq('user_id', userId)
                .single();

            if (error) throw error;

            return {
                theme: data?.theme || 'system',
                primaryColor: data?.primary_color || 'blue',
                fontSize: data?.font_size || 'medium',
                compactMode: data?.compact_mode || false,
                reducedMotion: data?.reduced_motion || false,
                highContrast: data?.high_contrast || false,
            };
        } catch (error) {
            return {
                theme: 'system',
                primaryColor: 'blue',
                fontSize: 'medium',
                compactMode: false,
                reducedMotion: false,
                highContrast: false,
            };
        }
    }

    async updateAppearancePreferences(userId: string, preferences: Partial<AppearancePreferences>): Promise<boolean> {
        try {
            console.log("📝 Salvando preferências para usuário:", userId);
            console.log("🎨 Preferências:", preferences);

            // Primeiro, verificar se o usuário existe
            const { data: user, error: userError } = await supabase
                .from('user_preferences')
                .select('user_id')
                .eq('user_id', userId)
                .maybeSingle();

            if (userError) {
                console.error("❌ Erro ao verificar usuário:", userError);
            }

            const { error } = await supabase
                .from('user_preferences')
                .upsert({
                    user_id: userId,
                    theme: preferences.theme,
                    primary_color: preferences.primaryColor,
                    font_size: preferences.fontSize,
                    compact_mode: preferences.compactMode,
                    reduced_motion: preferences.reducedMotion,
                    high_contrast: preferences.highContrast,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id'
                });

            if (error) {
                console.error("❌ Erro detalhado ao salvar:", {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
                throw error;
            }

            console.log("✅ Preferências salvas com sucesso!");
            return true;
        } catch (error) {
            console.error("❌ Erro ao atualizar preferências de aparência:", error);
            return false;
        }
    }

    // ============================================
    // PREFERÊNCIAS DE NOTIFICAÇÃO
    // ============================================

    async getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
        try {
            const { data, error } = await supabase
                .from('user_preferences')
                .select('notifications')
                .eq('user_id', userId)
                .single();

            if (error) throw error;

            return {
                emailNotifications: data?.notifications?.emailNotifications ?? true,
                pushNotifications: data?.notifications?.pushNotifications ?? true,
                marketingEmails: data?.notifications?.marketingEmails ?? false,
                teamInvites: data?.notifications?.teamInvites ?? true,
                newReports: data?.notifications?.newReports ?? true,
                dataUpdates: data?.notifications?.dataUpdates ?? true,
                weeklyDigest: data?.notifications?.weeklyDigest ?? false,
            };
        } catch (error) {
            return {
                emailNotifications: true,
                pushNotifications: true,
                marketingEmails: false,
                teamInvites: true,
                newReports: true,
                dataUpdates: true,
                weeklyDigest: false,
            };
        }
    }

    async updateNotificationPreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<boolean> {
        try {
            const { data: existing } = await supabase
                .from('user_preferences')
                .select('notifications')
                .eq('user_id', userId)
                .single();

            const updatedNotifications = {
                ...(existing?.notifications || {}),
                ...preferences
            };

            const { error } = await supabase
                .from('user_preferences')
                .upsert({
                    user_id: userId,
                    notifications: updatedNotifications,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Erro ao atualizar preferências de notificação:", error);
            return false;
        }
    }

    // ============================================
    // SEGURANÇA
    // ============================================

    async getSecuritySettings(userId: string): Promise<SecuritySettings> {
        try {
            const { data, error } = await supabase
                .from('user_preferences')
                .select('two_factor_enabled, session_timeout')
                .eq('user_id', userId)
                .single();

            if (error) throw error;

            // Buscar atividades recentes
            const { data: activities } = await supabase
                .from('user_activities')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(10);

            return {
                twoFactorEnabled: data?.two_factor_enabled || false,
                sessionTimeout: data?.session_timeout || 30,
                recentActivities: (activities || []).map(a => ({
                    id: a.id,
                    action: a.action,
                    ip: a.ip,
                    device: a.device,
                    location: a.location,
                    createdAt: new Date(a.created_at)
                }))
            };
        } catch (error) {
            return {
                twoFactorEnabled: false,
                sessionTimeout: 30,
                recentActivities: []
            };
        }
    }

    async updateSecuritySettings(userId: string, settings: Partial<SecuritySettings>): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('user_preferences')
                .upsert({
                    user_id: userId,
                    two_factor_enabled: settings.twoFactorEnabled,
                    session_timeout: settings.sessionTimeout,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Erro ao atualizar configurações de segurança:", error);
            return false;
        }
    }

    async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            // Registrar atividade
            await this.logActivity('password_changed');

            return true;
        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            return false;
        }
    }

    async logActivity(action: string, details?: any): Promise<void> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase
                .from('user_activities')
                .insert({
                    user_id: user.id,
                    action,
                    details,
                    ip: await this.getClientIP(),
                    device: navigator.userAgent,
                    created_at: new Date().toISOString()
                });
        } catch (error) {
            console.error("Erro ao registrar atividade:", error);
        }
    }

    private async getClientIP(): Promise<string | undefined> {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch {
            return undefined;
        }
    }

    // ============================================
    // API KEYS
    // ============================================

    async getApiKeys(userId: string): Promise<ApiKey[]> {
        try {
            const { data, error } = await supabase
                .from('api_keys')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return (data || []).map(key => ({
                id: key.id,
                name: key.name,
                key: key.key,
                createdAt: new Date(key.created_at),
                lastUsed: key.last_used ? new Date(key.last_used) : undefined,
                expiresAt: key.expires_at ? new Date(key.expires_at) : undefined
            }));
        } catch (error) {
            console.error("Erro ao buscar API keys:", error);
            return [];
        }
    }

    async createApiKey(userId: string, name: string): Promise<ApiKey | null> {
        try {
            const key = `ak_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

            const { data, error } = await supabase
                .from('api_keys')
                .insert({
                    user_id: userId,
                    name,
                    key,
                    expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
                })
                .select()
                .single();

            if (error) throw error;

            await this.logActivity('api_key_created', { name });

            return {
                id: data.id,
                name: data.name,
                key: data.key,
                createdAt: new Date(data.created_at),
                lastUsed: data.last_used ? new Date(data.last_used) : undefined,
                expiresAt: data.expires_at ? new Date(data.expires_at) : undefined
            };
        } catch (error) {
            console.error("Erro ao criar API key:", error);
            return null;
        }
    }

    async deleteApiKey(keyId: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('api_keys')
                .delete()
                .eq('id', keyId);

            if (error) throw error;

            await this.logActivity('api_key_deleted');
            return true;
        } catch (error) {
            console.error("Erro ao deletar API key:", error);
            return false;
        }
    }
}

export const settingsService = new SettingsService();