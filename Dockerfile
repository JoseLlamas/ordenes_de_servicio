# ─────────────────────────────────────────
# etapa 1: Construcción de la aplicación SvelteKit
# ─────────────────────────────────────────
FROM node:24.12-slim AS builder

ENV CI=true

# Habilitar corepack para usar pnpm sin instalación extra
RUN corepack enable && corepack prepare pnpm@11.1.1 --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile
COPY ./ ./
RUN pnpm run build

# ─────────────────────────────────────────
# Etapa 2: Tools (migraciones y seeds)
# reutiliza el builder que ya tiene devDeps
# ─────────────────────────────────────────
FROM builder AS tools
# Las env vars vienen de docker-compose, no del .env
# así que el seed no puede usar --env-file=.env
CMD ["pnpm", "db:migrate"]

# ------------------------------------------
# Etapa 3: Producción con Node
# ------------------------------------------

FROM node:24.12-slim AS prod

ENV CI=true
RUN corepack enable && corepack prepare pnpm@11.1.1 --activate
WORKDIR /app

COPY --from=builder /app/build ./build/
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml


RUN pnpm install --frozen-lockfile --prod

RUN mkdir -p uploads/firmas uploads/avatares && \
  chown -R node:node /app

USER node

CMD ["node", "build"]
