# Apps, Ownership, and Ports

This repository is developed by multiple agents working in parallel. To prevent conflicts, adhere to these ownership and port allocations.

## Canonical Apps and Owners
- apps/web (Agent 1 — Frontend)
  - Next.js 15, React 19, Tailwind 4
  - Port: 3000
- apps/api (Agent 2 — Backend API)
  - NestJS, base path `/api/v1`
  - Port: 3001
- services/payments (Agent 4 — Payments & Orders)
  - NestJS, Stripe + Connect integration, base path `/api/v1`
  - Port: 3002

Deprecated (do not add new code; migrate as needed):
- frontend/ (older Next 14 app) → migrate to `apps/web`
- backend/ (standalone Nest app) → migrate to `apps/api`

## Infra (docker-compose)
- Postgres: 5432
- OpenSearch: 9200/9600
- Minio: 9000/9001

## Run/Build Coordination
- Only one agent should run a given service at a time.
- Announce when starting/stopping a service to avoid port conflicts.
- Services must read `PORT` from env. When unset, default to the ports above.
- Do not start all apps at once unless explicitly coordinated.

## API Conventions (baseline)
- Base path: `/api/v1`
- Errors: `{ error: { code, message, details? } }`
- IDs: UUIDv4; timestamps: ISO 8601 UTC

## Notes
- Shared types will live in `packages/shared` (owned by Agents 1–2).
- Contract changes must be reflected in `GLOBAL_AGENT_GOAL.md` and any affected app docs.
