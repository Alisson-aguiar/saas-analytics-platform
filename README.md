# 📊 AnalyticsPro - Plataforma SaaS de Análise de Dados

![AnalyticsPro Banner](/public/images/tela_dashboard.jpg)

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.39-3ecf8e?logo=supabase)](https://supabase.com/)
[![Jest](https://img.shields.io/badge/Jest-30.3-C21325?logo=jest)](https://jestjs.io/)
[![Coverage](https://img.shields.io/badge/Coverage-70%25-brightgreen)](https://jestjs.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 📋 Sobre o Projeto

**AnalyticsPro** é uma plataforma SaaS completa de análise de dados desenvolvida para demonstrar habilidades avançadas em desenvolvimento web full-stack. O projeto oferece uma experiência completa de análise de dados, com dashboard interativo, upload de arquivos, relatórios personalizáveis, sistema de times, integrações e muito mais.

### 🎯 Objetivo

Este projeto foi desenvolvido como portfólio para demonstrar competências em:
- Arquitetura de software moderna
- Desenvolvimento full-stack com Next.js
- Integração com serviços cloud (Supabase)
- UI/UX com Tailwind CSS e shadcn/ui
- Implementação de funcionalidades complexas (webhooks, notificações em tempo real)
- Testes automatizados com Jest e React Testing Library

---

## 📸 Capturas de Tela

### Dashboard Principal
![Dashboard](/public/images/tela_dashboard.jpg)

*Dashboard com métricas em tempo real, gráficos interativos e atividades recentes.*

### Análises de Dados
![Análises](/public/images/tela_analises.jpg)

*Gráficos interativos, filtros por período e visualizações detalhadas.*

### Upload de Dados
![Upload de Dados](/public/images/tela_enviar_dados.jpg)

*Upload de arquivos CSV/Excel com preview instantâneo e análise estatística.*

### Relatórios Personalizados
![Relatórios](/public/images/tela_relatorios.jpg)

*Criação, edição e exportação de relatórios em PDF/PNG.*

### Gestão de Equipe
![Equipe](/public/images/tela_equipe.jpg)

*Convites, papéis e permissões para colaboração em equipe.*

### Configurações
![Configurações](/public/images/tela_configuracoes.jpg)

*Perfil, aparência, notificações, segurança e API Keys.*

### Integrações
![Integrações](/public/images/tela_integracoes.jpg)

*Webhooks, Google Sheets e integrações com serviços externos.*

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Login com email/senha
- Login com Google OAuth
- Login com GitHub OAuth
- Registro de novos usuários
- Verificação de email
- Recuperação de senha
- Proteção de rotas com NextAuth.js

### 📊 Dashboard
- Métricas em tempo real (total de análises, usuários ativos, arquivos, receita)
- Gráficos interativos com Recharts
- Atividades recentes
- Filtros por período
- Cards de estatísticas dinâmicos

### 📁 Upload de Dados
- Upload de arquivos CSV e Excel
- Parsing automático de dados
- Preview dos dados em tabela
- Análise estatística básica
- Seleção de colunas
- Exportação de preview

### 📝 Relatórios
- CRUD completo de relatórios
- Builder de relatórios com gráficos e métricas
- Preview em tempo real
- Exportação para PDF
- Exportação para PNG
- Impressão de relatórios
- Relatórios públicos/compartilháveis
- Templates de relatórios

### 👥 Times e Colaboração
- Criação e gerenciamento de times
- Convites por email
- Papéis e permissões (owner, admin, member)
- Gerenciamento de membros
- Histórico de atividades do time
- Configurações do time
- Sair/deletar time

### ⚙️ Configurações
- **Perfil do usuário**: Informações pessoais, avatar, cargo, empresa
- **Aparência**: Tema claro/escuro/sistema, cores primárias, tamanho da fonte, modo compacto
- **Notificações**: Configuração de canais e tipos de notificação
- **Segurança**: Alteração de senha, 2FA, sessões ativas
- **API Keys**: Geração e gerenciamento de chaves de API

### 🔔 Notificações
- Sistema de notificações em tempo real (Supabase Realtime)
- Sino com badge de não lidas
- Popover com lista de notificações
- Marcar como lida individualmente
- Marcar todas como lidas
- Remover notificações
- Toast popup para novas notificações
- Tipos de notificação com cores diferentes

### 🔌 Webhooks e Integrações
- CRUD de webhooks
- Disparo de eventos
- Logs de execução
- Secret de validação (HMAC SHA256)
- Ativar/desativar webhooks
- Teste de webhooks
- Eventos disponíveis: criação/atualização/deleção de relatórios, upload de dados, membros de time, login/logout

### 📈 Google Sheets Integration
- Autenticação OAuth com Google
- Conexão com múltiplas planilhas
- Exportação de dados (análises, relatórios, usuários, time)
- Histórico de exportações
- Exportação agendada (diária, semanal, mensal)
- Visualização de prévia antes de exportar
- Gerenciamento de conexões

---

## 🧪 Testes Automatizados

### Cobertura de Testes

| Tipo de Teste | Cobertura | Testes | Aprovados |
|---------------|-----------|--------|-----------|
| **Testes Unitários** | 70% | 16 | 11 |
| **Testes de Componentes** | 65% | 8 | 7 |
| **Testes de Integração** | 60% | 5 | 4 |
| **Testes E2E** | 50% | 3 | 3 |

### Tecnologias de Teste
- **Jest** - Framework de testes
- **React Testing Library** - Testes de componentes React
- **User Event** - Simulação de eventos do usuário
- **Jest DOM** - Matchers específicos para DOM

### O que é testado?
- ✅ Serviços de autenticação (login, registro, logout)
- ✅ Dashboard service (métricas, gráficos, atividades)
- ✅ Report service (CRUD de relatórios)
- ✅ Componentes React (NotificationBell, Login, Register)
- ✅ Hooks customizados (useNotifications, useDashboardData)
- ✅ Fluxos de integração (autenticação, criação de relatórios)
- ✅ Utilitários e helpers

### Por que testes são importantes?
- 🔍 **Detecção precoce de bugs** - Identificação de problemas antes da produção
- 🛡️ **Código mais seguro** - Validação de edge cases e segurança
- 🚀 **Refatoração confiante** - Mudanças seguras sem quebrar funcionalidades
- 📈 **Documentação viva** - Testes como documentação executável

---

## 🛠️ Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | Descrição |
|------------|--------|-------------|
| Next.js | 16.1.6 | Framework React com SSR e App Router |
| TypeScript | 5.0 | Tipagem estática |
| Tailwind CSS | 3.4 | Estilização utilitária |
| shadcn/ui | Latest | Componentes acessíveis |
| Recharts | 2.12 | Gráficos e visualizações |
| Framer Motion | 11.0 | Animações |
| Lucide React | 0.460 | Ícones |

### Backend
| Tecnologia | Versão | Descrição |
|------------|--------|-------------|
| Next.js API Routes | 16.1.6 | API serverless |
| NextAuth.js | 4.24 | Autenticação |
| Supabase | 2.39 | Banco de dados e Auth |
| PostgreSQL | 15 | Banco relacional |
| TimescaleDB | Latest | Time-series data |

### Testes
| Tecnologia | Versão | Descrição |
|------------|--------|-------------|
| Jest | 30.3 | Framework de testes |
| React Testing Library | 16.3 | Testes de componentes |
| User Event | 14.6 | Simulação de eventos |
| Jest DOM | 6.9 | Matchers DOM |

### Bibliotecas Adicionais
- `date-fns` - Manipulação de datas
- `react-dropzone` - Upload de arquivos
- `html2canvas` + `jspdf` - Exportação PDF
- `googleapis` - Integração Google Sheets
- `uuid` - Geração de tokens
- `bcryptjs` - Criptografia de senhas

---

## 🏗️ Arquitetura do Projeto
saas-analytics-platform/
├── src/
│ ├── app/ # App Router do Next.js
│ │ ├── api/ # API Routes
│ │ ├── auth/ # Páginas de autenticação
│ │ ├── dashboard/ # Dashboard e páginas protegidas
│ │ └── layout.tsx # Layout principal
│ ├── components/ # Componentes React
│ │ ├── analytics/ # Componentes de análise
│ │ ├── charts/ # Gráficos
│ │ ├── dashboard/ # Componentes do dashboard
│ │ ├── navbar/ # Barra de navegação
│ │ ├── notifications/ # Sistema de notificações
│ │ ├── reports/ # Sistema de relatórios
│ │ ├── sidebar/ # Menu lateral
│ │ ├── team/ # Componentes de time
│ │ └── ui/ # Componentes shadcn/ui
│ ├── lib/ # Utilitários e serviços
│ │ ├── auth/ # Configuração NextAuth
│ │ ├── services/ # Serviços de API
│ │ └── supabase/ # Cliente Supabase
│ ├── hooks/ # React Hooks customizados
│ ├── providers/ # Context Providers
│ ├── types/ # Definições TypeScript
│ └── tests/ # Testes unitários e de integração
├── public/ # Arquivos estáticos
└── package.json # Dependências

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [Google Cloud Console](https://console.cloud.google.com) (para OAuth)
- Conta no [GitHub](https://github.com) (para OAuth)

### Passo 1: Clone o repositório

git clone https://github.com/Alisson-aguiar/analyticspro.git
cd analyticspro

### Passo 2: Instale as dependências
npm install
 ou
yarn install

