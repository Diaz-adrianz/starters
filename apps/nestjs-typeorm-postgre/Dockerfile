# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist
COPY scripts/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

RUN mkdir -p logs

EXPOSE 5001

ENTRYPOINT ["./docker-entrypoint.sh"]