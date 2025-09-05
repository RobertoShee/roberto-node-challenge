# 🐳 Dockerfile para API de Gestión de Tareas
# Multi-stage build para optimizar el tamaño de la imagen

# Stage 1: Build
FROM node:22-alpine AS builder

# Metadata
LABEL maintainer="Task API Team"
LABEL description="API REST con WebSockets para gestión de tareas"
LABEL version="1.0.0"

# Configurar directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite

# Copiar archivos de configuración
COPY package.json yarn.lock tsconfig.json ./

# Instalar dependencias
RUN yarn install --frozen-lockfile --production=false

# Copiar código fuente
COPY src/ ./src/

# Ejecutar lint y type check
RUN yarn lint && yarn tsc --noEmit

# Compilar TypeScript
RUN yarn build

# Instalar solo dependencias de producción
RUN yarn install --frozen-lockfile --production=true && yarn cache clean

# Stage 2: Production
FROM node:22-alpine AS production

# Configurar usuario no root por seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Instalar SQLite para producción
RUN apk add --no-cache sqlite

# Configurar directorio de trabajo
WORKDIR /app

# Copiar archivos compilados desde builder
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# Copiar archivos públicos si existen
COPY --chown=nextjs:nodejs public/ ./public/

# Crear directorio para base de datos
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/app/data/database.sqlite

# Exponer puerto
EXPOSE 3000

# Cambiar a usuario no root
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Comando por defecto
CMD ["node", "dist/src/server.js"]
