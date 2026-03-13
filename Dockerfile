FROM node:24-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY docs/package.json ./docs/
COPY layer/package.json ./layer/
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    corepack install && pnpm install --frozen-lockfile --ignore-scripts

FROM deps AS build
WORKDIR /app
ENV NUXT_TELEMETRY_DISABLED=1
COPY . .
RUN pnpm dev:prepare && pnpm build

FROM node:24-alpine AS runtime
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/docs/.output ./
USER app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:3000/ || exit 1
CMD ["node", "server/index.mjs"]
