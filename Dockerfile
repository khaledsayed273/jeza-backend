# ── Builder ────────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ── Runner ─────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app
ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml drizzle.config.ts ./
COPY drizzle ./drizzle
COPY src/db/schema ./src/db/schema
RUN pnpm install --frozen-lockfile
RUN mkdir -p /app/uploads

COPY --from=builder /app/dist ./dist

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/api/system/health || exit 1

CMD ["node", "dist/index.js"]
