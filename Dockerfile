# ── Stage 1: dependency install ───────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ── Stage 2: build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# prisma generate does not connect to DB; build is safe without a real URL
RUN pnpm run build

# ── Stage 3: production runner ────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# standalone output (server.js + required node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static    ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public          ./public

# prisma schema + migrations needed for `prisma migrate deploy` in init container
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm \
     ./node_modules/.pnpm
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma \
     ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma \
     ./node_modules/prisma

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
