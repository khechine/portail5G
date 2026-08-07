# ============================================================
#  Strapi CMS - Dockerfile (Node 20)
# ============================================================
FROM node:20-alpine AS builder

# Outils de build requis pour les dépendances natives (better-sqlite3)
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Production image ----
FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

# Outils de build pour la réinstallation native en production
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config
COPY --from=builder /app/database ./database
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/types ./types
COPY --from=builder /app/favicon.png ./favicon.png

EXPOSE 1337

CMD ["npm", "run", "start"]
