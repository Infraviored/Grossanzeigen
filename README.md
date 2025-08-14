# Grossanzeigen (Development)

Monorepo for an eBay-like marketplace. Optimized for development with multiple agents.

## Structure
- apps/web: Next.js 15, React 19, Tailwind 4
- apps/api: NestJS (ESM, NodeNext), base path `/api/v1`
- services/payments: NestJS (ESM), base path `/api/v1`
- packages/shared: Shared domain types for frontend/backend

## Prerequisites
- Node 20 (`.nvmrc`)
- Docker (for Postgres, OpenSearch, Minio)

## Quick start (manual)
1) Install deps (root)
```bash
npm install
```
2) Start infra (Docker)
```bash
docker compose up -d
```
3) Start API (port 3001)
```bash
npm run build:api && npm run start:api
```
4) Start Web (port 3000)
```bash
npm run dev -w apps/web
```
5) Start Payments (port 3002)
```bash
npm run build -w services/payments && npm run start -w services/payments
```

## Helper scripts (optional)
From repo root (make executable: `chmod +x scripts/*.sh`):
```bash
./scripts/dev-infra.sh        # docker compose up -d
./scripts/dev-api.sh          # build + start API on 3001
./scripts/dev-web.sh          # start Web on 3000
./scripts/dev-payments.sh     # build + start Payments on 3002
```
Run them in separate terminals.

## Data & Search (optional)
```bash
npm run prisma:generate -w apps/api
npm run prisma:migrate -w apps/api
npm run search:init -w apps/api
```

## Contracts & Conventions
- See `GLOBAL_AGENT_GOAL.md` (contracts)
- See `GENERALIZATION.md` (structure, ports, coordination)
