"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  User,
  LogOut,
  ChevronDown,
  Settings,
  BarChart3,
  CreditCard,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { TestNotificationButton } from "@/components/notifications/TestNotificationButton";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);

  // Detectar tema escuro
  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  const userMenuItems = [
    { icon: User, label: "Perfil", href: "/dashboard/settings" },
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: Database, label: "API Keys", href: "/dashboard/settings/api" },
    { icon: CreditCard, label: "Faturamento", href: "/dashboard/settings/billing" },
    { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
  ];

  const headerBg = isDark ? '#020817' : '#ffffff';
  const headerBorder = isDark ? '#3f3f46' : '#e4e4e7';
  const dropdownBg = isDark ? '#1e1e2f' : '#ffffff';
  const dropdownBorder = isDark ? '#3f3f46' : '#e4e4e7';
  const dropdownText = isDark ? '#e4e4e7' : '#18181b';
  const separatorBg = isDark ? '#3f3f46' : '#e4e4e7';

  return (
    <header
      className="sticky top-0 z-40 flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: headerBg,
        borderBottom: `1px solid ${headerBorder}`
      }}
    >
      {/* Search */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquisar relatórios, análises ou dados... (Ctrl+K)"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Notifications & User */}
      <div className="flex items-center gap-4">
        <TestNotificationButton /> 
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium" style={{ color: isDark ? '#e4e4e7' : '#18181b' }}>
                  {session?.user?.name || "Usuário"}
                </p>
                <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
              </div>
              <ChevronDown className="h-4 w-4" style={{ color: isDark ? '#e4e4e7' : '#18181b' }} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56"
            style={{
              backgroundColor: dropdownBg,
              borderColor: dropdownBorder,
              color: dropdownText
            }}
          >
            <DropdownMenuLabel style={{ color: dropdownText }}>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator style={{ backgroundColor: separatorBg }} />
            {userMenuItems.map((item) => (
              <DropdownMenuItem key={item.label} asChild>
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" style={{ color: dropdownText }} />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator style={{ backgroundColor: separatorBg }} />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/auth/login" })}>
              <LogOut className="mr-2 h-4 w-4" style={{ color: dropdownText }} />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}