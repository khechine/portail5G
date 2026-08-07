# ============================================================
#  Frontend Site (Express/EJS) - Dockerfile
# ============================================================
FROM node:18-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
