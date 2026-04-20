"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface ThemeContextType {
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
    fontSize: 'small' | 'medium' | 'large';
    setFontSize: (size: 'small' | 'medium' | 'large') => void;
    compactMode: boolean;
    setCompactMode: (compact: boolean) => void;
    reducedMotion: boolean;
    setReducedMotion: (reduced: boolean) => void;
    highContrast: boolean;
    setHighContrast: (contrast: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
    const [primaryColor, setPrimaryColor] = useState('blue');
    const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
    const [compactMode, setCompactMode] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [highContrast, setHighContrast] = useState(false);

    // Carregar do localStorage após montar
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
        const savedColor = localStorage.getItem('primaryColor');
        const savedFontSize = localStorage.getItem('fontSize') as 'small' | 'medium' | 'large' | null;
        const savedCompact = localStorage.getItem('compactMode') === 'true';
        const savedMotion = localStorage.getItem('reducedMotion') === 'true';
        const savedContrast = localStorage.getItem('highContrast') === 'true';

        if (savedTheme) setTheme(savedTheme);
        if (savedColor) setPrimaryColor(savedColor);
        if (savedFontSize) setFontSize(savedFontSize);
        setCompactMode(savedCompact);
        setReducedMotion(savedMotion);
        setHighContrast(savedContrast);

        setMounted(true);
    }, []);

    // Aplicar tema ao documento
    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;

        // Remover classes anteriores
        root.classList.remove('light', 'dark');

        // Aplicar tema
        if (theme === 'dark') {
            root.classList.add('dark');
        } else if (theme === 'light') {
            root.classList.remove('dark');
        } else {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (systemPrefersDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }

        // Aplicar cor primária
        root.setAttribute('data-primary', primaryColor);

        // Aplicar tamanho da fonte
        root.setAttribute('data-font-size', fontSize);

        // Aplicar modo compacto
        root.setAttribute('data-compact', String(compactMode));

        // Aplicar redução de movimento
        root.setAttribute('data-motion', reducedMotion ? 'reduced' : 'normal');

        // Aplicar alto contraste
        root.setAttribute('data-contrast', highContrast ? 'high' : 'normal');

        // Salvar no localStorage
        localStorage.setItem('theme', theme);
        localStorage.setItem('primaryColor', primaryColor);
        localStorage.setItem('fontSize', fontSize);
        localStorage.setItem('compactMode', String(compactMode));
        localStorage.setItem('reducedMotion', String(reducedMotion));
        localStorage.setItem('highContrast', String(highContrast));
    }, [theme, primaryColor, fontSize, compactMode, reducedMotion, highContrast, mounted]);

    // Ouvir mudanças do sistema
    useEffect(() => {
        if (!mounted) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                if (mediaQuery.matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme, mounted]);

    // Carregar preferências do servidor
    useEffect(() => {
        const loadServerPreferences = async () => {
            if (!session?.user?.id || !mounted) return;

            try {
                const { settingsService } = await import('@/lib/services/settings.service');
                const prefs = await settingsService.getAppearancePreferences(session.user.id);

                setTheme(prefs.theme);
                setPrimaryColor(prefs.primaryColor);
                setFontSize(prefs.fontSize);
                setCompactMode(prefs.compactMode);
                setReducedMotion(prefs.reducedMotion);
                setHighContrast(prefs.highContrast);
            } catch (error) {
                console.error("Erro ao carregar preferências do servidor:", error);
            }
        };

        loadServerPreferences();
    }, [session?.user?.id, mounted]);

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{
            theme, setTheme,
            primaryColor, setPrimaryColor,
            fontSize, setFontSize,
            compactMode, setCompactMode,
            reducedMotion, setReducedMotion,
            highContrast, setHighContrast
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};