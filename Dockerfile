# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Serve stage ----
FROM caddy:2-alpine
LABEL maintainer="ARH Automation <contact@arhautomation.com>"

# Copy built static output
COPY --from=build /app/dist /srv

# Copy Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# Non-root: Caddy alpine image runs as caddy user by default
# Ensure /data and /config dirs are writable
RUN mkdir -p /data /config && chown -R caddy:caddy /data /config /srv

VOLUME ["/data", "/config"]

EXPOSE 80 443

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/health || exit 1

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
