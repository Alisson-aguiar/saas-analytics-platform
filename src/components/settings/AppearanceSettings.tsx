"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Moon, Sun, Monitor, Palette, Save, Check, Loader2 } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

const colorOptions = [
    { id: 'blue', name: 'Azul', color: 'bg-blue-500' },
    { id: 'red', name: 'Vermelho', color: 'bg-red-500' },
    { id: 'green', name: 'Verde', color: 'bg-green-500' },
    { id: 'yellow', name: 'Amarelo', color: 'bg-yellow-500' },
    { id: 'orange', name: 'Laranja', color: 'bg-orange-500' },
    { id: 'purple', name: 'Roxo', color: 'bg-purple-500' },
    { id: 'pink', name: 'Rosa', color: 'bg-pink-500' },
];

export function AppearanceSettings() {
    const { data: session } = useSession();
    const {
        theme, setTheme,
        primaryColor, setPrimaryColor,
        fontSize, setFontSize,
        compactMode, setCompactMode,
        reducedMotion, setReducedMotion,
        highContrast, setHighContrast
    } = useTheme();

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!session?.user?.id) {
            toast.error("Usuário não autenticado");
            return;
        }

        setSaving(true);
        try {
            const { settingsService } = await import('@/lib/services/settings.service');
            const success = await settingsService.updateAppearancePreferences(session.user.id, {
                theme,
                primaryColor,
                fontSize,
                compactMode,
                reducedMotion,
                highContrast
            });

            if (success) {
                toast.success("Aparência atualizada", {
                    description: "Suas preferências visuais foram salvas"
                });
            } else {
                throw new Error("Falha ao salvar");
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
            toast.error("Erro ao salvar preferências");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Aparência
                </CardTitle>
                <CardDescription>
                    Personalize a aparência do sistema de acordo com suas preferências
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Tema */}
                <div className="space-y-4">
                    <Label className="text-base font-semibold">Tema</Label>
                    <RadioGroup
                        value={theme}
                        onValueChange={(value: any) => setTheme(value)}
                        className="grid grid-cols-3 gap-4"
                    >
                        <Label
                            className={`flex flex-col items-center justify-between rounded-lg border-2 p-4 hover:bg-accent cursor-pointer transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border'
                                }`}
                        >
                            <RadioGroupItem value="light" className="sr-only" />
                            <Sun className="h-8 w-8 mb-2" />
                            <span className="text-sm font-medium">Claro</span>
                        </Label>

                        <Label
                            className={`flex flex-col items-center justify-between rounded-lg border-2 p-4 hover:bg-accent cursor-pointer transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border'
                                }`}
                        >
                            <RadioGroupItem value="dark" className="sr-only" />
                            <Moon className="h-8 w-8 mb-2" />
                            <span className="text-sm font-medium">Escuro</span>
                        </Label>

                        <Label
                            className={`flex flex-col items-center justify-between rounded-lg border-2 p-4 hover:bg-accent cursor-pointer transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-border'
                                }`}
                        >
                            <RadioGroupItem value="system" className="sr-only" />
                            <Monitor className="h-8 w-8 mb-2" />
                            <span className="text-sm font-medium">Sistema</span>
                        </Label>
                    </RadioGroup>
                </div>

                <Separator />

                {/* Cor Primária */}
                <div className="space-y-4">
                    <Label className="text-base font-semibold">Cor Primária</Label>
                    <div className="flex flex-wrap gap-3">
                        {colorOptions.map((color) => (
                            <button
                                key={color.id}
                                onClick={() => setPrimaryColor(color.id)}
                                className={`w-10 h-10 rounded-full ${color.color} relative flex items-center justify-center transition-all hover:scale-110 ${primaryColor === color.id ? 'ring-2 ring-offset-2 ring-primary shadow-lg' : ''
                                    }`}
                                title={color.name}
                            >
                                {primaryColor === color.id && (
                                    <Check className="h-5 w-5 text-white drop-shadow-sm" />
                                )}
                            </button>
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        A cor primária é aplicada em botões, links, bordas e elementos de destaque.
                    </p>
                </div>

                <Separator />

                {/* Tamanho da Fonte */}
                <div className="space-y-4">
                    <Label className="text-base font-semibold">Tamanho da Fonte</Label>
                    <RadioGroup
                        value={fontSize}
                        onValueChange={(value: any) => setFontSize(value)}
                        className="flex gap-4"
                    >
                        <Label
                            className={`flex-1 text-center py-2 px-4 border rounded-lg cursor-pointer transition-all ${fontSize === 'small' ? 'border-primary bg-primary/5' : 'border-border'
                                }`}
                        >
                            <RadioGroupItem value="small" className="sr-only" />
                            <span className="text-sm">Pequeno</span>
                        </Label>
                        <Label
                            className={`flex-1 text-center py-2 px-4 border rounded-lg cursor-pointer transition-all ${fontSize === 'medium' ? 'border-primary bg-primary/5' : 'border-border'
                                }`}
                        >
                            <RadioGroupItem value="medium" className="sr-only" />
                            <span className="text-base">Médio</span>
                        </Label>
                        <Label
                            className={`flex-1 text-center py-2 px-4 border rounded-lg cursor-pointer transition-all ${fontSize === 'large' ? 'border-primary bg-primary/5' : 'border-border'
                                }`}
                        >
                            <RadioGroupItem value="large" className="sr-only" />
                            <span className="text-lg">Grande</span>
                        </Label>
                    </RadioGroup>
                </div>

                <Separator />

                {/* Preferências Visuais */}
                <div className="space-y-4">
                    <Label className="text-base font-semibold">Preferências Visuais</Label>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="compact" className="text-sm">Modo compacto</Label>
                            <p className="text-xs text-muted-foreground">
                                Reduz o espaçamento entre elementos
                            </p>
                        </div>
                        <Switch
                            id="compact"
                            checked={compactMode}
                            onCheckedChange={setCompactMode}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="motion" className="text-sm">Reduzir animações</Label>
                            <p className="text-xs text-muted-foreground">
                                Minimiza movimentos e transições
                            </p>
                        </div>
                        <Switch
                            id="motion"
                            checked={reducedMotion}
                            onCheckedChange={setReducedMotion}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="contrast" className="text-sm">Alto contraste</Label>
                            <p className="text-xs text-muted-foreground">
                                Melhora a visibilidade dos elementos
                            </p>
                        </div>
                        <Switch
                            id="contrast"
                            checked={highContrast}
                            onCheckedChange={setHighContrast}
                        />
                    </div>
                </div>

                <Separator />

                {/* Botão Salvar */}
                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
                        {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Salvar Preferências
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}