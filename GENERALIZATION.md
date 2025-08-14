# Cross-Agent Conventions and Canonical Paths

This document keeps all agents in sync while working in parallel. Avoid running dev/build if another agent is actively editing; coordinate and use reserved ports.

## Canonical Apps and Ownership
- Frontend (Agent 1): `apps/web` (Next 15, React 19, Tailwind 4)
- Backend API (Agent 2): `apps/api` (NestJS, `/api/v1` prefix)
- Payments Service (Agent 4): `services/payments` (NestJS)
- Shared Types (Agents 1–2): `packages/shared`

Canonical directories (only these exist; no legacy copies):
- `apps/web` — Next.js frontend
- `apps/api` — NestJS API
- `services/payments` — Payments service
- `packages/shared` — shared types

What changed (structural):
- Removed duplicate apps; repo is single-source-of-truth under `apps/*`, `services/*`, `packages/*`.
- Standardized API to ESM (NodeNext) with explicit `.js` import specifiers.
- Split TS configs for API (`src/**/*.ts`) and Prisma scripts (`tsconfig.prisma.json`).
- Added `@grossanzeigen/shared` workspace package and wired it as a dependency in API/Web.

## Reserved Dev Ports
- Web: 3000
- API: 3001
- Payments: 3002
- Postgres: 5432 (docker-compose)
- OpenSearch: 9200/9600 (docker-compose)
- Minio: 9000/9001 (docker-compose)

Services must read `PORT`; defaults should follow the above when unset.

## API Conventions
- Base path: `/api/v1`
- Errors: `{ error: { code, message, details? } }`
- IDs: UUIDv4; timestamps: ISO 8601 UTC
- Pagination: cursor-based; default 20, max 100

## Shared Types
- Provided under `packages/shared/src/models/*` for: `User`, `Profile`, `Category`, `Listing`, `Conversation`, `Message`, `Order`, `Payment`, `Notification`.
- Build via `tsc -p packages/shared/tsconfig.json` to generate `dist/` for consumer apps.

## Tooling Versions
- Node: `.nvmrc` → 20
- Frontend: Next 15, React 19, Tailwind 4
- Backend: Prefer a single NestJS major across services (align forward)

## Workspaces
- Root `package.json` uses workspaces: `apps/*`, `packages/*`, `services/*`.
- Place new services under these globs for consistent dependency resolution.
  - Note: Payments service is included but should be run independently by Agent 4 to avoid cross-agent dev server conflicts.
  - See also `APPS_AND_PORTS.md` for ownership and port mapping.

## How to launch (manual, coordinated)
1) Infrastructure
   - `docker compose up -d`
2) API (port 3001)
   - `npm install` (root, one agent at a time)
   - `npm run build -w apps/api && npm run start -w apps/api`
3) Web (port 3000)
   - `npm run dev -w apps/web`
4) Payments (port 3002)
   - `npm run build -w services/payments && npm run start -w services/payments`

Data & Search (Agent 2/3):
- Prisma: `npm run prisma:generate -w apps/api` and `npm run prisma:migrate -w apps/api`
- OpenSearch: `npm run search:init -w apps/api`

## Run/Build Coordination
- One agent per service should run dev/build at a time.
- Announce test runs and avoid port overlaps.

## Migration Notes
- Frontend: move any needed code from `frontend/` to `apps/web`.
- Backend: consolidate under `apps/api`; ensure `/api/v1` and Prisma.
- Payments: ensure `/api/v1` and default `PORT=3002`.

## Contract Changes
- Any API/event contract change must update `GLOBAL_AGENT_GOAL.md` and `packages/shared` simultaneously.
