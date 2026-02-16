# ─────────────────────────────────────────
# etapa 1: Construcción de la aplicación SvelteKit
# ─────────────────────────────────────────
FROM node:24.12 AS builder

WORKDIR /app
COPY *package.json package-lock.json ./

RUN npm ci
COPY ./ ./
RUN npm run build
#RUN pnpm prune --production

# ------------------------------------------
# Etapa 2: Producción con Node
# ------------------------------------------

FROM node:24.12 AS prod
WORKDIR /app

COPY --from=builder /app/build ./build/
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/.svelte-kit ./.svelte-kit
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/static static/

EXPOSE 10002
CMD ["node", "build"]