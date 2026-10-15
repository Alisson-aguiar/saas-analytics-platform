# ============================================
# DOCKERFILE DEV - Desenvolvimento com Hot Reload
# ============================================
# - Base Alpine (leve)
# - Ferramentas de debug instaladas (curl, wget, etc.)
# - npm ci para instalação reprodutível
# - Cache de camadas otimizado
# ============================================

FROM node:20-alpine

# ============================================
# 1. METADADOS
# ============================================
LABEL maintainer="Alisson Aguiar <alissonaguiars2k10@gmail.com>"
LABEL description="AnalyticsPro - Ambiente de desenvolvimento"

# ============================================
# 2. FERRAMENTAS DE SISTEMA
# ============================================
# libc6-compat  → compatibilidade com glibc (Next.js precisa)
# bash          → shell mais completo que sh
# git           → para operações git no container
# curl + wget    → para debug/testes HTTP
# tini          → init correto para sinais (evita zumbis)
# dumb-init      → alternativa ao tini
RUN apk add --no-cache \
    libc6-compat \
    bash \
    git \
    curl \
    wget \
    tini \
    && rm -rf /var/cache/apk/*

# ============================================
# 3. DIRETÓRIO DE TRABALHO
# ============================================
WORKDIR /app

# ============================================
# 4. VARIÁVEIS DE AMBIENTE
# ============================================
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true

# ============================================
# 5. INSTALAÇÃO DE DEPENDÊNCIAS (cache otimizado)
# ============================================
# Copia apenas os manifestos primeiro
COPY package.json package-lock.json* ./

# npm ci → instala do package-lock (reprodutível e mais rápido)
# --include=dev → garante que devDependencies são instaladas
RUN npm ci --include=dev

# ============================================
# 6. COPIA DO CÓDIGO-FONTE
# ============================================
COPY . .

# ============================================
# 7. PORTA
# ============================================
EXPOSE 3000

# ============================================
# 8. HEALTHCHECK
# ============================================
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# ============================================
# 9. ENTRYPOINT + CMD
# ============================================
# tini como PID 1 → gerencia sinais corretamente
# (evita container travar no Ctrl+C)
ENTRYPOINT ["/sbin/tini", "--"]

# Comando padrão: dev server com hot reload
CMD ["npm", "run", "dev"]