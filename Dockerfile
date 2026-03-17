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
ARG GITHUB_REPOSITORY_OWNER
ARG GITHUB_REPOSITORY
ARG GITHUB_SERVER_URL
ARG GITHUB_REF_NAME
ENV NODE_OPTIONS=--max-old-space-size=8192
COPY . .
RUN --mount=type=secret,id=NUXT_GITHUB_TOKEN \
    --mount=type=secret,id=AI_GATEWAY_API_KEY \
    { for f in /run/secrets/*; do echo "$(basename $f)=$(cat $f)"; done; \
      echo "GITHUB_REPOSITORY_OWNER=${GITHUB_REPOSITORY_OWNER}"; \
      echo "GITHUB_REPOSITORY=${GITHUB_REPOSITORY}"; \
      echo "GITHUB_SERVER_URL=${GITHUB_SERVER_URL}"; \
      echo "GITHUB_REF_NAME=${GITHUB_REF_NAME}"; \
    } > docs/.env && \
    pnpm dev:prepare && pnpm build && rm -f docs/.env

FROM node:24-alpine AS runtime
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/docs/.output ./
USER app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
EXPOSE 3000
CMD ["node", "server/index.mjs"]
