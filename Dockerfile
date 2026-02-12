# --- Base stage ---
FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# --- Build stage ---
FROM base AS build

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter movk-nuxt-docs build

# --- Runtime stage ---
FROM node:22-slim AS runtime

WORKDIR /app

COPY --from=build /app/docs/.output .output

ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
