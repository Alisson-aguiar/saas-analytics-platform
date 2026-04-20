"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    Users,
    Mail,
    Shield,
    Settings,
    Home,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const navigation = [
    {
        name: "Membros",
        href: "/dashboard/team",
        icon: Users,
        description: "Gerencie os membros da sua equipe",
        id: "nav-membros"
    },
    {
        name: "Convites",
        href: "/dashboard/team/invites",
        icon: Mail,
        description: "Veja e gerencie convites pendentes",
        id: "nav-convites"
    },
    {
        name: "Permissões",
        href: "/dashboard/team/permissions",
        icon: Shield,
        description: "Configure papéis e permissões",
        id: "nav-permissoes"
    },
    {
        name: "Configurações",
        href: "/dashboard/team/settings",
        icon: Settings,
        description: "Ajustes gerais do time",
        id: "nav-configuracoes"
    },
];

export default function TeamLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        } else if (status === "authenticated") {
            setIsLoading(false);
        }
    }, [status, router]);

    const teamId = pathname.match(/\/dashboard\/team\/([a-f0-9-]+)/)?.[1];

    const getActiveTab = () => {
        if (pathname === "/dashboard/team") return "Membros";
        if (pathname.includes("/invites")) return "Convites";
        if (pathname.includes("/permissions")) return "Permissões";
        if (pathname.includes("/settings")) return "Configurações";
        return "";
    };

    const activeTab = getActiveTab();

    // ✅ CORREÇÃO DEFINITIVA: Todas as chaves são únicas
    const breadcrumbs = [
        {
            name: "Dashboard",
            href: "/dashboard",
            key: "breadcrumb-dashboard"  // ← Chave única
        },
        {
            name: "Times",
            href: "/dashboard/team",
            key: "breadcrumb-teams"      // ← Chave única (NÃO é /dashboard/team)
        },
    ];

    if (teamId) {
        breadcrumbs.push({
            name: `Time ${teamId.substring(0, 6)}...`,
            href: `/dashboard/team/${teamId}`,
            key: `breadcrumb-team-${teamId}`  // ← Chave única baseada no UUID
        });
    }

    if (activeTab && activeTab !== "Membros") {
        breadcrumbs.push({
            name: activeTab,
            href: pathname,
            key: `breadcrumb-${activeTab.toLowerCase()}-${Date.now()}`  // ← Chave única com timestamp
        });
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            {/* Breadcrumbs - Versão definitiva */}
            <Breadcrumb>
                <BreadcrumbList>
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb.key}>  {/* ← Usando a key única */}
                            <BreadcrumbItem>
                                {index === breadcrumbs.length - 1 ? (
                                    <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={crumb.href}>
                                        {crumb.name}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {index < breadcrumbs.length - 1 && (
                                <BreadcrumbSeparator />
                            )}
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>

            {/* Cabeçalho */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Times e Colaboradores
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {session?.user?.name ? `Olá, ${session.user.name}! ` : ''}
                        Gerencie sua equipe, convide membros e configure permissões
                    </p>
                </div>

                {teamId && (
                    <div className="hidden md:block">
                        <div className="text-sm text-muted-foreground">
                            Time ID:
                        </div>
                        <div className="font-mono text-xs bg-muted px-2 py-1 rounded">
                            {teamId.substring(0, 8)}...
                        </div>
                    </div>
                )}
            </div>

            {/* Navegação em cards */}
            <nav className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href ||
                        (item.href !== "/dashboard/team" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.id}  // ← Usando id único em vez de href
                            href={item.href}
                            className={cn(
                                "group relative overflow-hidden rounded-lg border p-4 transition-all hover:shadow-md",
                                isActive
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                            )}
                        >
                            {isActive && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                            )}

                            <div className="flex items-start gap-3">
                                <div className={cn(
                                    "rounded-lg p-2 transition-colors",
                                    isActive
                                        ? "bg-primary text-white"
                                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                )}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </Link>
                    );
                })}
            </nav>

            {/* Separador com nome da aba atual */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        {teamId ? `Gerenciando time` : activeTab || 'Visão Geral'}
                    </span>
                </div>
            </div>

            {/* Conteúdo da página */}
            <div className="space-y-4">
                {children}
            </div>

            {/* Rodapé */}
            <div className="border-t pt-4 mt-8">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                            <Home className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <span>•</span>
                        <span>
                            {teamId ? 'Visualizando time específico' : 'Lista de times'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="bg-muted px-2 py-1 rounded text-xs">
                            {session?.user?.email}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}