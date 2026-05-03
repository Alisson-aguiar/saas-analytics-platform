"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Upload,
  FileText,
  Bell,
  Zap,
  Shield,
  Database,
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  CheckCircle,
  Star,
  Code,
  Rocket,
  Target,
  Award,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  GitBranch,
  Terminal,
  Cpu,
  Cloud,
  Lock,
  TrendingUp,
  LayoutDashboard,
  Webhook,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  TestTube,
  Bug,
  CheckSquare,
  Activity,
  LineChart,
  FileSpreadsheet,
  Key,
  Settings
} from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PortfolioPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  // Módulos do sistema com descrições e benefícios
  const modules = [
    {
      name: "🔐 Autenticação",
      icon: Shield,
      description: "Sistema completo de login com email/senha, Google e GitHub OAuth.",
      benefits: [
        "Segurança com NextAuth.js e Supabase",
        "Proteção de rotas com middleware",
        "Recuperação de senha com Resend",
        "Sessão persistente JWT"
      ],
      tech: ["NextAuth.js", "Supabase Auth", "OAuth 2.0", "JWT"]
    },
    {
      name: "📊 Dashboard",
      icon: LayoutDashboard,
      description: "Painel administrativo com métricas em tempo real e gráficos interativos.",
      benefits: [
        "Métricas dinâmicas do banco de dados",
        "Gráficos com Recharts",
        "Atividades recentes",
        "Filtros por período"
      ],
      tech: ["Recharts", "Tailwind CSS", "Server Components"]
    },
    {
      name: "📁 Upload de Dados",
      icon: Upload,
      description: "Upload e processamento de arquivos CSV/Excel com preview instantâneo.",
      benefits: [
        "Parsing automático de dados",
        "Preview em tabela",
        "Análise estatística básica",
        "Suporte a múltiplos formatos"
      ],
      tech: ["Papaparse", "React Dropzone", "CSV/Excel"]
    },
    {
      name: "📝 Relatórios",
      icon: FileText,
      description: "Criação, edição e exportação de relatórios personalizados.",
      benefits: [
        "Builder de relatórios intuitivo",
        "Exportação PDF/PNG",
        "Relatórios públicos/compartilháveis",
        "Templates reutilizáveis"
      ],
      tech: ["html2canvas", "jsPDF", "CRUD completo"]
    },
    {
      name: "👥 Times",
      icon: Users,
      description: "Gestão completa de equipes com convites e permissões.",
      benefits: [
        "Convites por email",
        "Papéis (owner/admin/member)",
        "Histórico de atividades",
        "Permissões granulares"
      ],
      tech: ["Supabase Realtime", "Row Level Security", "Team Management"]
    },
    {
      name: "🔔 Notificações",
      icon: Bell,
      description: "Sistema de notificações em tempo real com Supabase Realtime.",
      benefits: [
        "Notificações push no navegador",
        "Badge de não lidas",
        "Marcar como lida/remover",
        "Toast popup automático"
      ],
      tech: ["Supabase Realtime", "WebSockets", "Toast notifications"]
    },
    {
      name: "🔌 Webhooks",
      icon: Webhook,
      description: "Integrações com webhooks para eventos do sistema.",
      benefits: [
        "Disparo de eventos automático",
        "Logs de execução",
        "Validação com HMAC SHA256",
        "Teste de webhooks"
      ],
      tech: ["Webhooks", "Event-driven", "API Integrations"]
    },
    {
      name: "📈 Google Sheets",
      icon: Database,
      description: "Integração com Google Sheets para exportação de dados.",
      benefits: [
        "Autenticação OAuth",
        "Exportação agendada",
        "Histórico de exportações",
        "Múltiplas planilhas"
      ],
      tech: ["Google APIs", "OAuth 2.0", "Spreadsheet API"]
    }
  ];

  // Testes implementados
  const tests = [
    {
      name: "Testes Unitários",
      icon: Code,
      description: "Testes isolados de funções e serviços",
      coverage: "70%",
      count: 16,
      passed: 11,
      details: [
        "Serviços de autenticação",
        "Dashboard service",
        "Report service",
        "Utils e helpers"
      ]
    },
    {
      name: "Testes de Componentes",
      icon: LayoutDashboard,
      description: "Testes de componentes React com RTL",
      coverage: "65%",
      count: 8,
      passed: 7,
      details: [
        "NotificationBell",
        "Login/Register forms",
        "Sidebar e Navbar",
        "Cards e modais"
      ]
    },
    {
      name: "Testes de Integração",
      icon: Activity,
      description: "Testes de fluxos completos",
      coverage: "60%",
      count: 5,
      passed: 4,
      details: [
        "Fluxo de autenticação",
        "Criação de relatórios",
        "Upload de arquivos",
        "Notificações em tempo real"
      ]
    },
    {
      name: "Testes E2E",
      icon: TestTube,
      description: "Testes end-to-end com Cypress",
      coverage: "50%",
      count: 3,
      passed: 3,
      details: [
        "Login e registro",
        "Dashboard completo",
        "Exportação de relatórios"
      ]
    }
  ];

  const skills = {
    frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Shadcn/ui"],
    backend: ["Node.js", "Next.js API", "Supabase", "PostgreSQL"],
    tools: ["Git", "Docker", "VS Code", "Figma", "Turbopack"],
    concepts: ["SOLID", "Clean Code", "Design Patterns", "CI/CD", "TDD"]
  };

  const projects = [
    {
      name: "AnalyticsPro",
      description: "Plataforma SaaS completa de análise de dados com dashboard interativo, relatórios personalizáveis e integrações.",
      tech: ["Next.js", "TypeScript", "Supabase", "Tailwind", "Recharts"],
      features: [
        "Autenticação OAuth (Google/GitHub)",
        "Dashboard com métricas em tempo real",
        "Upload e processamento de CSV/Excel",
        "Sistema de relatórios com exportação PDF/PNG",
        "Times e convites",
        "Webhooks e integrações",
        "Google Sheets Integration",
        "Notificações em tempo real"
      ],
      link: "/dashboard",
      github: "https://github.com/Alisson-aguiar/analyticspro"
    }
  ];

  const experience = [
    {
      title: "Desenvolvedor Full Stack",
      company: "AnalyticsPro (Projeto Pessoal)",
      period: "2025 - Presente",
      description: "Desenvolvimento de uma plataforma SaaS completa de análise de dados, utilizando Next.js, Supabase e TypeScript. Implementação de funcionalidades como autenticação OAuth, dashboard interativo, sistema de relatórios, webhooks e integrações.",
      technologies: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Recharts"]
    },
    {
      title: "Estudos e Aprendizado Contínuo",
      company: "Formação Independente",
      period: "2023 - Presente",
      description: "Estudos focados em desenvolvimento web moderno, arquitetura de software, boas práticas e novas tecnologias. Participação em comunidades e projetos open source.",
      technologies: ["React", "Node.js", "TypeScript", "Prisma", "Docker"]
    }
  ];

  const certifications = [
    {
      name: "Next.js 14 - Do Zero ao Avançado",
      issuer: "Formação Independente",
      year: "2025"
    },
    {
      name: "TypeScript - Fundamentos e Avançado",
      issuer: "Formação Independente",
      year: "2025"
    },
    {
      name: "Tailwind CSS - Design Responsivo",
      issuer: "Formação Independente",
      year: "2025"
    },
    {
      name: "Supabase - Banco de Dados e Auth",
      issuer: "Formação Independente",
      year: "2025"
    }
  ];

  const futureRoadmap = [
    {
      feature: "Análise Preditiva com IA",
      description: "Implementar machine learning para previsões de tendências",
      status: "planejado",
      icon: Sparkles
    },
    {
      feature: "Integração com Slack/Discord",
      description: "Notificações e comandos via chat",
      status: "em desenvolvimento",
      icon: Zap
    },
    {
      feature: "PWA (Progressive Web App)",
      description: "Aplicação instalável e modo offline",
      status: "planejado",
      icon: Rocket
    },
    {
      feature: "2FA e Segurança Avançada",
      description: "Autenticação de dois fatores",
      status: "planejado",
      icon: Lock
    },
    {
      feature: "Dashboard Personalizável",
      description: "Widgets arrastáveis e layouts customizados",
      status: "planejado",
      icon: LayoutDashboard
    },
    {
      feature: "API Pública com Swagger",
      description: "Documentação completa da API",
      status: "planejado",
      icon: Webhook
    }
  ];

  const techStack = [
    { name: "Next.js 16", icon: "▲", color: "bg-black text-white" },
    { name: "TypeScript", icon: "TS", color: "bg-blue-600 text-white" },
    { name: "Supabase", icon: "SB", color: "bg-emerald-600 text-white" },
    { name: "Tailwind", icon: "TW", color: "bg-cyan-600 text-white" },
    { name: "Recharts", icon: "📊", color: "bg-rose-600 text-white" },
    { name: "NextAuth", icon: "🔐", color: "bg-purple-600 text-white" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header/Navbar */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Alisson Aguiar
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#about" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Sobre
              </Link>
              <Link href="#skills" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Habilidades
              </Link>
              <Link href="#modules" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Módulos
              </Link>
              <Link href="#tests" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Testes
              </Link>
              <Link href="#projects" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Projetos
              </Link>
              <Link href="#roadmap" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Roadmap
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => signIn()}
                className="hidden sm:flex"
              >
                Acessar Demo
              </Button>
              <Button
                onClick={() => router.push('/auth/register')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                Ver Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 shadow-lg border-t dark:border-slate-800">
            <div className="flex flex-col p-4 gap-3">
              <Link href="#about" className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Sobre
              </Link>
              <Link href="#skills" className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Habilidades
              </Link>
              <Link href="#modules" className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Módulos
              </Link>
              <Link href="#tests" className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Testes
              </Link>
              <Link href="#projects" className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Projetos
              </Link>
              <Link href="#roadmap" className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Roadmap
              </Link>
              <div className="border-t dark:border-slate-800 pt-3 mt-2">
                <Button variant="ghost" onClick={() => signIn()} className="w-full justify-start">
                  Acessar Demo
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent" />
        <div className="container mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 border-0 px-4 py-2">
                🚀 Portfólio de Projetos
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Olá! Eu sou
                </span>
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Alisson Aguiar
                </span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                Desenvolvedor Full Stack apaixonado por criar soluções inovadoras e escaláveis.
                Especializado em Next.js, TypeScript e arquitetura de sistemas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => router.push('/auth/register')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg px-8 py-6"
                >
                  Ver Projeto em Ação
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.open('https://github.com/Alisson-aguiar', '_blank')}
                  className="text-lg px-8 py-6"
                >
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white dark:bg-slate-900/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Sobre Mim</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Desenvolvedor Full Stack
                <span className="text-blue-600 dark:text-blue-400"> em constante evolução</span>
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  Sou um desenvolvedor Full Stack com foco em criar aplicações web modernas,
                  escaláveis e com excelente experiência do usuário. Este projeto é um exemplo
                  completo das minhas habilidades técnicas e capacidade de entrega.
                </p>
                <p>
                  Tenho experiência em todo o ciclo de desenvolvimento, desde a concepção da
                  arquitetura até a implementação de funcionalidades complexas, sempre buscando
                  as melhores práticas e tecnologias atuais.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <span>Brasil</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span>+2 anos de estudos</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {techStack.map((tech, index) => (
                <div key={index} className={`${tech.color} rounded-xl p-4 text-center`}>
                  <div className="text-2xl font-bold mb-1">{tech.icon}</div>
                  <div className="text-sm font-medium">{tech.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Habilidades</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tecnologias e Ferramentas
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Stack principal que utilizo no desenvolvimento de aplicações web.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Frontend</h3>
              <div className="flex flex-wrap gap-2">
                {skills.frontend.map((skill, i) => (
                  <Badge key={i} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6">
              <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-4">
                <Terminal className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Backend</h3>
              <div className="flex flex-wrap gap-2">
                {skills.backend.map((skill, i) => (
                  <Badge key={i} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6">
              <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-4">
                <GitBranch className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Ferramentas</h3>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map((skill, i) => (
                  <Badge key={i} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6">
              <div className="h-12 w-12 rounded-xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mb-4">
                <Cpu className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Conceitos</h3>
              <div className="flex flex-wrap gap-2">
                {skills.concepts.map((skill, i) => (
                  <Badge key={i} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Módulos do Sistema */}
      <section id="modules" className="py-20 px-4 bg-white dark:bg-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Arquitetura do Sistema</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Módulos Implementados
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Cada módulo foi cuidadosamente projetado para oferecer a melhor experiência.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg">{module.name}</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    {module.description}
                  </p>
                  <div className="space-y-2 mb-3">
                    {module.benefits.slice(0, 2).map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {module.tech.map((tech, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{tech}</Badge>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testes e Qualidade */}
      <section id="tests" className="py-20 px-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">
              Qualidade e Confiabilidade
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Testes Automatizados
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Garantia de qualidade com suíte completa de testes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {tests.map((test, index) => {
              const Icon = test.icon;
              const passRate = (test.passed / test.count) * 100;
              return (
                <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold">{test.name}</h3>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cobertura</span>
                      <span className="font-medium">{test.coverage}</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: test.coverage }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span>Testes: {test.passed}/{test.count}</span>
                    <span className="text-green-600">{passRate.toFixed(0)}% aprovados</span>
                  </div>
                  <div className="space-y-1">
                    {test.details.map((detail, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Por que testes? */}
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-4">Por que investimos em testes?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800">
                <Bug className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Detecção precoce de bugs</p>
                <p className="text-xs text-slate-500">Identificação de problemas antes da produção</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800">
                <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Código mais seguro</p>
                <p className="text-xs text-slate-500">Validação de edge cases e segurança</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800">
                <Rocket className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Refatoração confiante</p>
                <p className="text-xs text-slate-500">Mudanças seguras sem quebrar funcionalidades</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Projetos em Destaque</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AnalyticsPro
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Plataforma SaaS completa de análise de dados - Meu principal projeto de portfólio
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-white text-sm ml-2">AnalyticsPro - Demo</span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                    Funcionalidades Implementadas
                  </h3>
                  <ul className="space-y-2">
                    {projects[0].features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {projects[0].tech.map((tech, i) => (
                      <Badge key={i} variant="outline">{tech}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-6">
                    <Button onClick={() => router.push('/dashboard')}>
                      Ver Demo
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={() => window.open(projects[0].github, '_blank')}>
                      <Github className="mr-2 h-4 w-4" />
                      Código
                    </Button>
                  </div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-3">
                        <div className="h-3 w-20 bg-slate-200 dark:bg-slate-600 rounded mb-2" />
                        <div className="h-6 w-16 bg-slate-300 dark:bg-slate-500 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="h-32 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-4 bg-white dark:bg-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Experiência</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Jornada de Desenvolvimento
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Minha trajetória de aprendizado e evolução como desenvolvedor.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="relative pl-8 border-l-2 border-blue-500">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-500" />
                <div className="mb-2">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {exp.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <span>{exp.company}</span>
                    <span>•</span>
                    <span>{exp.period}</span>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-3">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, i) => (
                    <Badge key={i} variant="outline">{tech}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Certificações</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Formação e Certificados
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Cursos e especializações que complementam minha jornada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-1">{cert.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{cert.issuer}</p>
                <p className="text-xs text-slate-400 mt-2">{cert.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400">
              Roadmap 2026
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Próximos Passos
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Funcionalidades e melhorias planejadas para o projeto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {futureRoadmap.map((item, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">{item.feature}</h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  {item.description}
                </p>
                <Badge variant="outline" className="text-xs">
                  {item.status === "em desenvolvimento" ? "🚧 Em desenvolvimento" : "📋 Planejado"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Interessado no meu trabalho?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Explore o projeto completo, veja o código ou entre em contato para conversarmos sobre oportunidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
             
              onClick={() => router.push('/auth/register')}
              className="bg-white text-white hover:bg-slate-100"
            >
              Ver Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              
              className="border-white text-white hover:bg-white/10"
              onClick={() => window.open('https://github.com/Alisson-aguiar', '_blank')}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button
              size="lg"
             
              className="border-white text-white hover:bg-white/10"
              onClick={() => window.location.href = 'mailto:alissonaguiars2k10@gmail.com'}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button
              size="lg"
              
              className="border-white text-white hover:bg-white/10"
              onClick={() => window.open('https://www.linkedin.com/in/alisson-aguiars2k/', '_blank')}
            >
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t dark:border-slate-800">
        <div className="container mx-auto text-center">
          <div className="flex justify-center gap-6 mb-6">
            <Link href="#about" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white">Sobre</Link>
            <Link href="#skills" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white">Habilidades</Link>
            <Link href="#modules" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white">Módulos</Link>
            <Link href="#tests" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white">Testes</Link>
            <Link href="#projects" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white">Projetos</Link>
            <Link href="#roadmap" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white">Roadmap</Link>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2026 Alisson Aguiar. Desenvolvedor Full Stack - Portfólio de Projetos
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            Projeto desenvolvido para demonstrar habilidades técnicas em Next.js, TypeScript e arquitetura SaaS
          </p>
        </div>
      </footer>
    </div>
  );
}