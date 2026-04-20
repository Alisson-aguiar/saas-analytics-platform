"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Shield, Lock, Key, Smartphone, Mail, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { settingsService } from "@/lib/services/settings.service";

export function SecuritySettings() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState("30");
    const [showPassword, setShowPassword] = useState(false);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("As senhas não coincidem");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("A senha deve ter pelo menos 6 caracteres");
            return;
        }

        setLoading(true);
        try {
            const success = await settingsService.changePassword(currentPassword, newPassword);
            if (success) {
                toast.success("Senha alterada com sucesso!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                toast.error("Erro ao alterar senha. Verifique sua senha atual.");
            }
        } catch (error) {
            toast.error("Erro ao alterar senha");
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password: string) => {
        if (!password) return null;

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        return {
            level: strength,
            max: 4,
            text: strength === 0 ? 'Muito fraca' :
                strength === 1 ? 'Fraca' :
                    strength === 2 ? 'Média' :
                        strength === 3 ? 'Forte' : 'Muito forte',
            color: strength === 0 ? 'bg-red-500' :
                strength === 1 ? 'bg-orange-500' :
                    strength === 2 ? 'bg-yellow-500' :
                        strength === 3 ? 'bg-blue-500' : 'bg-green-500'
        };
    };

    const passwordStrength = getPasswordStrength(newPassword);

    return (
        <div className="space-y-6">
            {/* Alterar Senha */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Alterar Senha
                    </CardTitle>
                    <CardDescription>
                        Atualize sua senha regularmente para manter sua conta segura
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Senha atual</Label>
                        <Input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword">Nova senha</Label>
                        <Input
                            id="newPassword"
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                        {passwordStrength && (
                            <div className="mt-2 space-y-1">
                                <div className="flex gap-1">
                                    {[...Array(4)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full ${i < passwordStrength.level ? passwordStrength.color : 'bg-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className={`text-xs ${passwordStrength.level <= 1 ? 'text-red-600' :
                                        passwordStrength.level === 2 ? 'text-yellow-600' :
                                            'text-green-600'
                                    }`}>
                                    {passwordStrength.text}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                        <Input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                        {confirmPassword && (
                            <p className={`text-xs ${newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                                {newPassword === confirmPassword ? '✓ Senhas coincidem' : '✗ Senhas não coincidem'}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Switch
                            id="showPassword"
                            checked={showPassword}
                            onCheckedChange={setShowPassword}
                        />
                        <Label htmlFor="showPassword">Mostrar senhas</Label>
                    </div>

                    <Button
                        onClick={handleChangePassword}
                        disabled={loading || !currentPassword || !newPassword || newPassword !== confirmPassword}
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Alterar Senha
                    </Button>
                </CardContent>
            </Card>

            {/* Autenticação de Dois Fatores */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Autenticação de Dois Fatores (2FA)
                    </CardTitle>
                    <CardDescription>
                        Adicione uma camada extra de segurança à sua conta
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Status da 2FA</p>
                            <p className="text-sm text-muted-foreground">
                                {twoFactorEnabled ? 'Ativado' : 'Desativado'}
                            </p>
                        </div>
                        <Switch
                            checked={twoFactorEnabled}
                            onCheckedChange={setTwoFactorEnabled}
                        />
                    </div>

                    {twoFactorEnabled && (
                        <Alert>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <AlertDescription>
                                Sua conta está protegida com autenticação de dois fatores.
                            </AlertDescription>
                        </Alert>
                    )}

                    <Button variant="outline" disabled={!twoFactorEnabled}>
                        <Smartphone className="h-4 w-4 mr-2" />
                        Configurar 2FA
                    </Button>
                </CardContent>
            </Card>

            {/* Sessões Ativas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Sessões Ativas
                    </CardTitle>
                    <CardDescription>
                        Gerencie os dispositivos conectados à sua conta
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <p className="font-medium">Este dispositivo</p>
                                <p className="text-sm text-muted-foreground">
                                    Chrome • Windows • São Paulo
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Último acesso: agora mesmo
                                </p>
                            </div>
                            <Badge variant="success" className="bg-green-100 text-green-700">
                                Atual
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <p className="font-medium">iPhone 13</p>
                                <p className="text-sm text-muted-foreground">
                                    Safari • iOS • São Paulo
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Último acesso: 2 dias atrás
                                </p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-600">
                                <XCircle className="h-4 w-4 mr-1" />
                                Encerrar
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Label htmlFor="timeout">Tempo de inatividade para logout</Label>
                        <select
                            id="timeout"
                            value={sessionTimeout}
                            onChange={(e) => setSessionTimeout(e.target.value)}
                            className="ml-2 p-1 border rounded"
                        >
                            <option value="15">15 minutos</option>
                            <option value="30">30 minutos</option>
                            <option value="60">1 hora</option>
                            <option value="120">2 horas</option>
                            <option value="240">4 horas</option>
                        </select>
                    </div>

                    <Button variant="outline" className="w-full">
                        Encerrar todas as outras sessões
                    </Button>
                </CardContent>
            </Card>

            {/* Atividade Recente */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Histórico de Atividades
                    </CardTitle>
                    <CardDescription>
                        Últimas atividades na sua conta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span>Login realizado</span>
                            <span className="text-muted-foreground">há 2 minutos</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Senha alterada</span>
                            <span className="text-muted-foreground">há 5 dias</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Nova API key criada</span>
                            <span className="text-muted-foreground">há 7 dias</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Configurações alteradas</span>
                            <span className="text-muted-foreground">há 12 dias</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}