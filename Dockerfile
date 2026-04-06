# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build argument for MongoDB URI (required at build time for Next.js)
ARG MONGODB_URI
ENV MONGODB_URI=${MONGODB_URI}
ENV NODE_ENV=production

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=9002

# Run as non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package.json /app/package-lock.json ./

# Install production dependencies (needed for seed script)
RUN npm install --omit=dev --ignore-scripts

# Copy public files for favicon
COPY --from=builder /app/src/app/icon.svg ./src/app/icon.svg

USER nextjs
EXPOSE 9002

CMD ["node", "server.js"]
