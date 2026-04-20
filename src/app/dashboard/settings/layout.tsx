"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    User,
    Bell,
    Palette,
    CreditCard,
    Key,
    Shield,
    Globe,
    Loader2
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
        name: "Perfil",
        href: "/dashboard/settings",
        icon: User,
        description: "Gerencie suas informações pessoais"
    },
    {
        name: "Aparência",
        href: "/dashboard/settings/appearance",
        icon: Palette,
        description: "Personalize a aparência do sistema"
    },
    {
        name: "Notificações",
        href: "/dashboard/settings/notifications",
        icon: Bell,
        description: "Configure como deseja ser notificado"
    },
    {
        name: "Plano e Faturamento",
        href: "/dashboard/settings/billing",
        icon: CreditCard,
        description: "Gerencie seu plano e pagamentos"
    },
    {
        name: "API Keys",
        href: "/dashboard/settings/api",
        icon: Key,
        description: "Gerencie suas chaves de API"
    },
    // {
    //     name: "Segurança",
    //     href: "/dashboard/settings/security",
    //     icon: Shield,
    //     description: "Configure sua senha e autenticação"
    // },
];

export default function SettingsLayout({
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

    const breadcrumbs = [
        { name: "Dashboard", href: "/dashboard", key: "dashboard" },
        { name: "Configurações", href: "/dashboard/settings", key: "settings" },
    ];

    const activeTab = navigation.find(item =>
        pathname === item.href || pathname.startsWith(item.href + '/')
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            {/* Breadcrumbs */}
            <Breadcrumb>
                <BreadcrumbList>
                    {breadcrumbs.map((crumb, index) => (
                        <BreadcrumbItem key={crumb.key}>
                            {index === breadcrumbs.length - 1 && !activeTab ? (
                                <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                            ) : (
                                <>
                                    <BreadcrumbLink href={crumb.href}>{crumb.name}</BreadcrumbLink>
                                    <BreadcrumbSeparator />
                                </>
                            )}
                        </BreadcrumbItem>
                    ))}
                    {activeTab && (
                        <BreadcrumbItem>
                            <BreadcrumbPage>{activeTab.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    )}
                </BreadcrumbList>
            </Breadcrumb>

            {/* Cabeçalho */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                <p className="text-muted-foreground">
                    Gerencie suas preferências e configurações da conta
                </p>
            </div>

            {/* Navegação em cards */}
            <nav className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                    return (
                        <Link
                            key={item.href}
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
                        </Link>
                    );
                })}
            </nav>

            {/* Conteúdo da página */}
            <div className="mt-8">
                {children}
            </div>
        </div>
    );
}