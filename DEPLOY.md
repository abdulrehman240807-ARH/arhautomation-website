# Deploy runbook — ARH Automation

## Prereqs (VPS)
Ubuntu 22.04+ with Docker ≥ 24 and Docker Compose v2 installed. Ports 80 and 443 open. DNS A record for `arhautomation.com` + `www` pointing to the VPS IP.

## Deploy
```bash
git clone https://github.com/<org>/arhautomation-website.git && cd arhautomation-website
chmod +x deploy.sh
./deploy.sh
```

## DNS (Cloudflare)
Set A records for `@` and `www` → VPS IP. **Proxy status: DNS only** (grey cloud) so Caddy handles Let's Encrypt directly. If using Cloudflare proxy, set SSL mode to "Full (strict)".

## Rollback
```bash
docker compose down
git checkout <previous-tag-or-commit>
./deploy.sh
```
