# syntax=docker/dockerfile:1

# ============================================
# Stage 1: Install dependencies
# ============================================
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies with cache mount for faster rebuilds
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install

# ============================================
# Stage 2: Build the application
# ============================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy only files needed for build (order matters for caching)
COPY package.json package-lock.json ./
COPY next.config.ts tsconfig.json tailwind.config.ts postcss.config.mjs ./
COPY src ./src
COPY scripts ./scripts

# Build argument for MongoDB URI (required at build time for Next.js)
ARG MONGODB_URI
ENV MONGODB_URI=${MONGODB_URI}
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ============================================
# Stage 3: Production runner (minimal)
# ============================================
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=9002
ENV NEXT_TELEMETRY_DISABLED=1

# Run as non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Copy standalone build output (includes required node_modules)
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

# Copy public files for favicon
COPY --from=builder --chown=nextjs:nextjs /app/src/app/icon.svg ./src/app/icon.svg

USER nextjs
EXPOSE 9002

CMD ["node", "server.js"]
