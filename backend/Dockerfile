# Lingo Keeper JP - Backend Dockerfile
# Target: Google Cloud Run
# Base: Node.js 20 LTS (Debian Slim)

# ===== Stage 1: Build =====
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL and other dependencies needed for Prisma
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY src ./src
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# ===== Stage 2: Production =====
FROM node:20-slim AS runner

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy Prisma schema (needed for Prisma Client at runtime)
COPY prisma ./prisma

# Generate Prisma Client in production image
RUN npx prisma generate

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Create non-root user for security
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose port (Cloud Run uses PORT env var, default 8080)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || '8080') + '/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
# Cloud Run sets PORT env var, fallback to 8080
CMD ["node", "dist/index.js"]
