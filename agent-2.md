# IMPORTANT!!
After each step read the next step of the markdown file  and fulfill it until you are done.

## Agent 2 — Backend API & Services (NestJS / TypeScript)

### Scope
Provide REST + WebSocket APIs for auth, users, listings, images, categories, messaging, notifications, and order stubs. Emit events for search and notifications. Generate presigned URLs for media.

### Foundations
- Monorepo friendly; app at `apps/api`
- Config via env vars; validation with zod/class-validator
- Prisma ORM for PostgreSQL; Socket.IO gateway for realtime

---

### Step 1 — Bootstrap API
- Create NestJS project structure with modules folder
- Set global validation pipe and exception filters
- Health check endpoint `/health` returning version and dependencies status

### Step 2 — Database integration
- Add Prisma schema and client; database connection pooling
- Run initial migration with base tables (Users, Sessions)
- Seed script for local dev

### Step 3 — Auth module
- Email/password sign up, login, logout, refresh; secure cookies (httpOnly)
- Password hashing with argon2; email verification tokens
- OAuth providers (Google/Apple) scaffolding endpoints
- Session management endpoints; device/session listing and revoke

### Step 4 — Users & profiles
- CRUD for profile fields (display name, bio, avatar)
- Address book endpoints; privacy preferences
- Rate limiting on sensitive actions

### Step 5 — Categories
- Hierarchical categories endpoints; return attribute schema per category
- Admin seed script to load default categories and attributes

### Step 6 — Listings module
- Listing lifecycle: draft, active, sold, expired; enforce invariants
- Endpoints: create, update, publish, unpublish, delete, get by id, list with filters
- Attribute validation against category schema

### Step 7 — Images & media
- Endpoint to request presigned S3 upload URLs; persist metadata (key, mime, size)
- Associate uploaded images to listing with order index
- Simple image processing job trigger hook (async)

### Step 8 — Messaging module
- Conversations: create on first message; participants constraints
- Messages: send, list, mark read; typing indicator via WS events
- WebSocket gateway auth and rooms by conversation id

### Step 9 — Notifications
- Persist notification records; types: message, order, generic
- REST: list, mark as read; WebSocket: push new
- Email sending hook (provider-agnostic interface)

### Step 10 — Search events
- Implement outbox table `search_events`
- Emit `listing.created|updated|deleted` with minimal payload
- Provide `/search/index/replay` admin endpoint to replay events

### Step 11 — Orders (stubs) and integration points
- Create Order model and endpoints: create, get, list
- Hand off payment creation to Payments service via internal client (HTTP)
- Webhook receiver endpoint for payment events; update order status accordingly

### Step 12 — Validation, errors, and logging
- DTOs validated with class-validator/zod; consistent error shapes
- Request logging with correlation ids; redact sensitive fields
- Rate limiting middleware on sensitive routes

### Step 13 — OpenAPI & SDK generation
- Auto-generate OpenAPI spec at `/docs/json` and Swagger UI at `/docs`
- Generate TypeScript client in `packages/shared` (openapi-typescript)

### Step 14 — Security hardening
- CORS config for web origin; helmet; CSRF for cookie flows where relevant
- RBAC roles (user, seller, admin) groundwork
- Audit log for admin actions

### Step 15 — WebSocket quality
- Heartbeats/pings; auto-rejoin rooms; backpressure safeguards
- Broadcast typing/read receipts and new messages

### Step 16 — Pagination & filtering
- Cursor-based pagination; enforce limits; indices in DB
- Consistent filter params for listings: category, price, distance, condition, text

### Step 17 — Admin utilities
- Soft-delete and restore listings/users; moderation flags
- Impersonation token endpoint for support (guarded)

### Step 18 — Observability
- Structured logs, request metrics, p95 latency histograms
- Health checks for DB, cache, S3, email provider

### Step 19 — Final acceptance
- All endpoints documented; example requests
- Postman/Insomnia collection or simple HTTP scripts committed
- Contract tests pass against API locally


