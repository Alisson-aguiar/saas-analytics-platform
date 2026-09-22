"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion, Variants } from "framer-motion";
import {
  BarChart3, Users, Upload, FileText, Bell, Zap, Shield, Database, Github, Linkedin,
  Mail, ArrowRight, CheckCircle, Code, Rocket, Award, Calendar, MapPin, GitBranch,
  Terminal, Cpu, Lock, LayoutDashboard, Webhook, Sparkles, Menu, X, ExternalLink,
  TestTube, Bug, Activity, Heart, Coffee, Send, MousePointerClick,
} from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* ---------------- Animação reutilizável ---------------- */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function PortfolioPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  /* ---------------- DADOS ---------------- */
  const modules = [
    {
      emoji: "🔐",
      name: "Autenticação",
      icon: Shield,
      description:
        "Login por e-mail/senha, Google e GitHub — com recuperação de senha e sessões seguras.",
      benefits: ["NextAuth.js + Supabase Auth", "Rotas protegidas por middleware"],
      tech: ["NextAuth", "OAuth 2.0", "JWT"],
    },
    {
      emoji: "📊",
      name: "Dashboard",
      icon: LayoutDashboard,
      description:
        "Um painel vivo: cada número vem do banco, atualizado em tempo real conforme você usa.",
      benefits: ["Métricas reais do banco", "Gráficos interativos com Recharts"],
      tech: ["Recharts", "Server Components"],
    },
    {
      emoji: "📁",
      name: "Upload de Dados",
      icon: Upload,
      description:
        "Arraste seu CSV ou Excel e veja os dados analisados em segundos — sem configuração.",
      benefits: ["Parsing automático", "Preview instantâneo em tabela"],
      tech: ["Papaparse", "React Dropzone"],
    },
    {
      emoji: "📝",
      name: "Relatórios",
      icon: FileText,
      description:
        "Monte relatórios com gráficos e métricas, exporte em PDF/PNG e compartilhe com seu time.",
      benefits: ["Exportação PDF/PNG", "Relatórios públicos"],
      tech: ["jsPDF", "html2canvas"],
    },
    {
      emoji: "👥",
      name: "Times",
      icon: Users,
      description:
        "Convide colegas por e-mail, defina papéis e acompanhe tudo o que acontece no time.",
      benefits: ["Papéis e permissões", "Histórico de atividades"],
      tech: ["Realtime", "RLS"],
    },
    {
      emoji: "🔔",
      name: "Notificações",
      icon: Bell,
      description:
        "Nada importante passa em branco: alertas chegam em tempo real, direto no navegador.",
      benefits: ["Push em tempo real", "Marcar como lida/remover"],
      tech: ["Supabase Realtime", "WebSockets"],
    },
    {
      emoji: "🔌",
      name: "Webhooks",
      icon: Webhook,
      description:
        "Integre com qualquer serviço: eventos do sistema são disparados com assinatura HMAC.",
      benefits: ["Logs de execução", "Assinatura HMAC SHA256"],
      tech: ["Event-driven", "Integrações"],
    },
    {
      emoji: "📈",
      name: "Google Sheets",
      icon: Database,
      description:
        "Conecte suas planilhas com um clique e sincronize dados automaticamente.",
      benefits: ["Exportação agendada", "Histórico de sync"],
      tech: ["Google APIs", "OAuth 2.0"],
    },
  ];

  const tests = [
    { name: "Unitários", icon: Code, coverage: "70%", count: 16, passed: 11, description: "Serviços, utils e regras de negócio" },
    { name: "Componentes", icon: LayoutDashboard, coverage: "65%", count: 8, passed: 7, description: "React Testing Library" },
    { name: "Integração", icon: Activity, coverage: "60%", count: 5, passed: 4, description: "Fluxos completos" },
    { name: "E2E", icon: TestTube, coverage: "50%", count: 3, passed: 3, description: "Cypress end-to-end" },
  ];

  const skills = {
    Frontend: { icon: Code, items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui"] },
    Backend: { icon: Terminal, items: ["Node.js", "Next.js API", "Supabase", "PostgreSQL"] },
    Ferramentas: { icon: GitBranch, items: ["Git", "Docker", "VS Code", "Figma", "Turbopack"] },
    Conceitos: { icon: Cpu, items: ["SOLID", "Clean Code", "Design Patterns", "CI/CD", "TDD"] },
  };

  const techStack = [
    { name: "Next.js", icon: "▲", color: "from-zinc-800 to-black" },
    { name: "TypeScript", icon: "TS", color: "from-blue-600 to-blue-800" },
    { name: "Supabase", icon: "SB", color: "from-emerald-500 to-emerald-700" },
    { name: "Tailwind", icon: "TW", color: "from-cyan-500 to-cyan-700" },
    { name: "Recharts", icon: "📊", color: "from-rose-500 to-rose-700" },
    { name: "NextAuth", icon: "🔐", color: "from-purple-600 to-purple-800" },
  ];

  const experience = [
    {
      title: "Desenvolvedor Full Stack",
      company: "AnalyticsPro · Projeto próprio",
      period: "2025 — Presente",
      description:
        "Construí uma plataforma SaaS completa, do banco de dados até a interface. Cuidei da arquitetura, autenticação, dashboards, relatórios, integrações e deploy — aprendendo na prática o que um produto real exige.",
      technologies: ["Next.js", "TypeScript", "Supabase", "Tailwind", "Recharts"],
    },
    {
      title: "Estudante e Aprendiz Contínuo",
      company: "Formação independente",
      period: "2023 — Presente",
      description:
        "Estudo desenvolvimento web moderno, arquitetura de software e boas práticas. Participo de comunidades e contribuo em projetos open source sempre que possível.",
      technologies: ["React", "Node.js", "TypeScript", "Docker"],
    },
  ];

  const certifications = [
    { name: "Next.js 14 — Do Zero ao Avançado", year: "2025" },
    { name: "TypeScript — Fundamentos e Avançado", year: "2025" },
    { name: "Tailwind CSS — Design Responsivo", year: "2025" },
    { name: "Supabase — Banco de Dados e Auth", year: "2025" },
  ];

  const roadmap = [
    { feature: "Análise Preditiva com IA", description: "Previsões de tendências com machine learning.", icon: Sparkles, status: "Planejado" },
    { feature: "Integração Slack/Discord", description: "Notificações e comandos via chat.", icon: Zap, status: "Em desenvolvimento" },
    { feature: "PWA + Modo Offline", description: "App instalável e disponível sem internet.", icon: Rocket, status: "Planejado" },
    { feature: "2FA Avançado", description: "Autenticação de dois fatores com biometria.", icon: Lock, status: "Planejado" },
    { feature: "Dashboard Personalizável", description: "Widgets arrastáveis e layouts customizados.", icon: LayoutDashboard, status: "Planejado" },
    { feature: "API Pública Documentada", description: "Swagger, OpenAPI e SDK.", icon: Webhook, status: "Planejado" },
  ];

  /* ---------------- NAV ---------------- */
  const navLinks = [
    { href: "#sobre", label: "Sobre" },
    { href: "#skills", label: "Habilidades" },
    { href: "#modulos", label: "Módulos" },
    { href: "#testes", label: "Testes" },
    { href: "#projeto", label: "Projeto" },
    { href: "#roadmap", label: "Roadmap" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 scroll-smooth">
      {/* Barra de progresso no topo */}
      <ScrollProgress />

      {/* NAV */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled
            ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60 dark:border-slate-800/60"
            : "bg-transparent"
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Alisson Aguiar
              </span>
            </motion.div>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="relative px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors group"
                >
                  {l.label}
                  <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => signIn()}
                className="hidden sm:flex cursor-pointer"
              >
                Ver Demo
              </Button>
              <Button
                onClick={() => router.push("/auth/register")}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white cursor-pointer shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all"
              >
                Criar Conta
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Abrir menu"
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 shadow-lg border-t dark:border-slate-800"
          >
            <div className="flex flex-col p-4 gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={() => signIn()}
                className="mt-2 w-full px-4 py-2.5 text-left text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Ver Demo
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
              <Badge className="mb-6 bg-white/60 dark:bg-slate-800/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 px-4 py-1.5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                Disponível para oportunidades
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="text-5xl md:text-7xl font-bold mb-6 leading-[1.05] tracking-tight"
            >
              <span className="block text-slate-900 dark:text-white">Oi, eu sou</span>
              <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
                Alisson Aguiar
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Desenvolvedor Full Stack apaixonado por transformar ideias em produtos reais.
              Especializado em <strong className="text-slate-900 dark:text-white">Next.js</strong>,{" "}
              <strong className="text-slate-900 dark:text-white">TypeScript</strong> e{" "}
              <strong className="text-slate-900 dark:text-white">Supabase</strong>.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center"
            >
              <Button
                size="lg"
                onClick={() => router.push("/auth/register")}
                className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-base px-7 py-6 cursor-pointer shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-all"
              >
                Experimentar o AnalyticsPro
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open("https://github.com/Alisson-aguiar", "_blank")}
                className="text-base px-7 py-6 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Github className="mr-2 h-5 w-5" />
                Ver no GitHub
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400"
            >
              <MousePointerClick className="h-4 w-4" />
              <span>Explore cada seção — tem muita coisa legal aqui embaixo</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <Section id="sobre" badge="Sobre mim" title="Um dev curioso que ama construir" subtitle="Aprendo na prática, entregando projetos reais.">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                Sou <strong className="text-slate-900 dark:text-white">Desenvolvedor Full Stack</strong> focado em criar
                aplicações web que as pessoas realmente gostam de usar — bonitas, rápidas e bem feitas por dentro.
              </p>
              <p>
                O AnalyticsPro é o meu jeito de mostrar na prática tudo o que aprendi: autenticação, banco de dados,
                UX, integrações, testes, deploy. Cada linha foi escrita com intenção.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span>Brasil</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>+2 anos de estudos</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Coffee className="h-4 w-4 text-blue-500" />
                  <span>Movido a café e curiosidade</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                custom={i}
                viewport={{ once: true }}
                whileHover={reduceMotion ? undefined : { y: -4, scale: 1.03 }}
                className={`bg-gradient-to-br ${tech.color} rounded-2xl p-4 text-center text-white shadow-lg cursor-default transition-shadow hover:shadow-2xl`}
              >
                <div className="text-2xl font-bold mb-1">{tech.icon}</div>
                <div className="text-xs font-medium opacity-90">{tech.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* SKILLS */}
      <Section
        id="skills"
        badge="Habilidades"
        title="Com o que eu trabalho"
        subtitle="A stack que uso no dia a dia para construir aplicações completas."
        tone="muted"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {Object.entries(skills).map(([title, data], idx) => {
            const Icon = data.icon;
            return (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                custom={idx}
                viewport={{ once: true }}
                whileHover={reduceMotion ? undefined : { y: -6 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-400 dark:hover:border-blue-500 transition-colors shadow-sm hover:shadow-xl"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {data.items.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* MÓDULOS */}
      <Section
        id="modulos"
        badge="Arquitetura"
        title="O que tem por dentro"
        subtitle="Oito módulos que juntos formam uma plataforma SaaS completa."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                custom={i * 0.5}
                viewport={{ once: true }}
                whileHover={reduceMotion ? undefined : { y: -6 }}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-xl overflow-hidden"
              >
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-base">
                    <span className="mr-1">{m.emoji}</span>
                    {m.name}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                  {m.description}
                </p>
                <ul className="space-y-1.5 mb-4">
                  {m.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1">
                  {m.tech.map((t) => (
                    <Badge key={t} variant="outline" className="text-[10px] font-normal">
                      {t}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* TESTES */}
      <Section
        id="testes"
        badge="Qualidade"
        title="Testes, porque pressa não combina com produção"
        subtitle="Uma suíte que cresce junto com o projeto e me dá confiança para refatorar."
        tone="muted"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {tests.map((t, i) => {
            const Icon = t.icon;
            const passRate = (t.passed / t.count) * 100;
            return (
              <motion.div
                key={t.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                custom={i}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold">{t.name}</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{t.description}</p>
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Cobertura</span>
                    <span className="font-semibold">{t.coverage}</span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: t.coverage }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">
                    {t.passed}/{t.count} testes
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {passRate.toFixed(0)}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold mb-6 text-center">Por que eu invisto tanto nisso?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Bug, title: "Descubro bugs cedo", desc: "Antes de chegar ao usuário — que é onde dói.", color: "text-red-500" },
              { icon: Shield, title: "Código mais seguro", desc: "Edge cases tratados, mudanças previsíveis.", color: "text-blue-500" },
              { icon: Rocket, title: "Refatoro sem medo", desc: "Melhoro o código sem quebrar funcionalidades.", color: "text-green-500" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                custom={i}
                viewport={{ once: true }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg transition-shadow text-center"
              >
                <item.icon className={`h-8 w-8 ${item.color} mx-auto mb-3`} />
                <p className="text-sm font-semibold mb-1">{item.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* PROJETO */}
      <Section
        id="projeto"
        badge="Projeto em destaque"
        title="AnalyticsPro, do zero ao deploy"
        subtitle="Uma plataforma SaaS de análise de dados construída para ser usada de verdade."
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/60 dark:border-slate-700/60"
        >
          {/* Barra de navegador fake */}
          <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
            <div className="ml-4 flex-1 bg-white dark:bg-slate-800 rounded-md px-3 py-1 text-xs text-slate-400 border border-slate-200 dark:border-slate-700">
              saas-analytics-platform-six.vercel.app/dashboard
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                  Tudo o que está funcionando hoje
                </h3>
                <ul className="space-y-2.5">
                  {[
                    "Autenticação OAuth (Google e GitHub)",
                    "Dashboard com métricas em tempo real",
                    "Upload de CSV/Excel com preview",
                    "Relatórios com exportação PDF/PNG",
                    "Times, convites e permissões",
                    "Webhooks com assinatura HMAC",
                    "Integração com Google Sheets",
                    "Notificações em tempo real",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 mt-6">
                  {["Next.js", "TypeScript", "Supabase", "Tailwind", "Recharts", "NextAuth"].map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mt-8">
                  <Button
                    onClick={() => router.push("/auth/register")}
                    className="cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                  >
                    Experimentar agora
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open("https://github.com/Alisson-aguiar/saas-analytics-platform", "_blank")}
                    className="cursor-pointer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Ver o código
                  </Button>
                </div>
              </div>

              {/* Mock visual */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Análises", value: "1.240" },
                    { label: "Usuários ativos", value: "573" },
                    { label: "Relatórios", value: "89" },
                    { label: "Receita", value: "R$ 12,4k" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</div>
                    </div>
                  ))}
                </div>
                <div className="relative h-40 rounded-xl overflow-hidden bg-gradient-to-t from-blue-500/10 to-cyan-500/5">
                  <svg viewBox="0 0 300 160" className="w-full h-full">
                    <defs>
                      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.6, ease: "easeOut" }}
                      d="M0 130 Q 40 90, 80 100 T 160 70 T 240 40 T 300 60"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                    />
                    <path
                      d="M0 130 Q 40 90, 80 100 T 160 70 T 240 40 T 300 60 L 300 160 L 0 160 Z"
                      fill="url(#g)"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* EXPERIÊNCIA */}
      <Section id="experiencia" badge="Jornada" title="Como cheguei até aqui" subtitle="Um caminho construído na prática, um projeto por vez." tone="muted">
        <div className="max-w-3xl mx-auto space-y-8">
          {experience.map((exp, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              custom={i}
              viewport={{ once: true }}
              className="relative pl-8 border-l-2 border-blue-500/30"
            >
              <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 ring-4 ring-blue-500/10" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{exp.title}</h3>
              <div className="flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">
                <span className="font-medium text-blue-600 dark:text-blue-400">{exp.company}</span>
                <span>•</span>
                <span>{exp.period}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">{exp.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {exp.technologies.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CERTIFICAÇÕES */}
      <Section id="certificacoes" badge="Formação" title="O que venho estudando" subtitle="Cursos e certificações que complementam a prática.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {certifications.map((c, i) => (
            <motion.div
              key={c.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              custom={i}
              viewport={{ once: true }}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg transition-all"
            >
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-1 text-sm leading-snug">{c.name}</h3>
              <p className="text-xs text-slate-400 mt-2">{c.year}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ROADMAP */}
      <Section
        id="roadmap"
        badge="Próximos passos"
        title="O que vem por aí"
        subtitle="Roadmap honesto — o que já está em movimento e o que ainda está sendo planejado."
        tone="muted"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {roadmap.map((item, i) => {
            const Icon = item.icon;
            const inProgress = item.status === "Em desenvolvimento";
            return (
              <motion.div
                key={item.feature}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                custom={i}
                viewport={{ once: true }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className={`relative bg-white dark:bg-slate-800 rounded-2xl p-6 border transition-all hover:shadow-lg ${inProgress
                    ? "border-yellow-300 dark:border-yellow-700 shadow-yellow-500/5"
                    : "border-slate-200/60 dark:border-slate-700/60"
                  }`}
              >
                {inProgress && (
                  <span className="absolute -top-2 left-6 bg-yellow-400 text-yellow-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    EM ANDAMENTO
                  </span>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-sm">{item.feature}</h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 dark:from-black dark:via-blue-950/40 dark:to-black relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="container mx-auto text-center max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm mb-6 backdrop-blur">
            <Heart className="h-4 w-4 text-pink-400" />
            <span>Feito com muito carinho e algumas noites em claro</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Vamos conversar sobre o próximo projeto?
          </h2>
          <p className="text-lg text-white/80 mb-10 leading-relaxed">
            Estou em busca de oportunidades júnior/pleno. Se este projeto te interessou,
            ficaria feliz em trocar uma ideia.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <Button
              size="lg"
              onClick={() => router.push("/auth/register")}
              className="cursor-pointer bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-lg"
            >
              Ver o projeto funcionando
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all"
              onClick={() => window.open("https://github.com/Alisson-aguiar", "_blank")}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all"
              onClick={() => (window.location.href = "mailto:alissonaguiars2k10@gmail.com")}
            >
              <Send className="mr-2 h-4 w-4" />
              E-mail
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all"
              onClick={() => window.open("https://www.linkedin.com/in/alisson-aguiars2k/", "_blank")}
            >
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </Button>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Alisson Aguiar — Desenvolvedor Full Stack
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Feito com Next.js, TypeScript, Tailwind CSS e muita curiosidade.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function Section({
  id, badge, title, subtitle, tone = "default", children,
}: {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  tone?: "default" | "muted";
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`py-20 md:py-24 px-4 scroll-mt-20 ${tone === "muted" ? "bg-slate-50/60 dark:bg-slate-900/30" : ""
        }`}
    >
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <Badge variant="secondary" className="mb-4">
            {badge}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{title}</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {subtitle}
          </p>
        </motion.div>
        {children}
      </div>
    </section>
  );
}

/* Barra fina de progresso no topo */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setProgress(scrolled);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 bg-transparent z-[60]">
      <div
        className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}