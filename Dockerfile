FROM node:20-alpine AS base

FROM base AS builder

RUN npm i -g pnpm
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=pixel-profile-server --prod /prod/pixel-profile-server

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder /prod/pixel-profile-server /app/packages/pixel-profile-server
COPY --from=builder /app/packages/pixel-profile/fonts/ /app/packages/pixel-profile/fonts/

USER hono
ENV NODE_ENV=production
ENV PORT 3000
EXPOSE ${PORT}

CMD ["node", "--experimental-modules", "/app/packages/pixel-profile-server/dist/node.js"]
