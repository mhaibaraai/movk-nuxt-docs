FROM node:24-bookworm-slim AS runtime
WORKDIR /app
RUN groupadd -r app && useradd -r -g app app
COPY --chown=app:app docs/.output ./
USER app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
EXPOSE 3000
CMD ["node", "server/index.mjs"]
