# IMPORTANT!!
All agents must read this file first, then follow your respective `agent-*.md` file. Do not change shared contracts without updating this file and notifying all agents.

## Global Goal — Recreate eBay (90% parity) fast with 5 AI agents

### Mission
- Build a production-ready marketplace where:
  - Buyers can discover listings, contact sellers, and purchase safely.
  - Sellers can create listings with images, manage inventory, and receive payouts.
  - Platform provides baseline trust/safety, moderation, and dispute hooks.
- Target 90% of eBay’s core workflows, prioritizing speed and coherence over completeness.

### Out-of-scope (initially)
- Auctions, advanced ads/placements, complex returns center, deep analytics, extensive internationalization, and multiple payment processors beyond Stripe.

---

## Shared Stack & Decisions
- Frontend: Next.js (React, TypeScript, Tailwind, React Query)
- Backend: NestJS (Node.js, TypeScript), REST + WebSocket (Socket.IO)
- Database: PostgreSQL (via Prisma)
- Search: OpenSearch/Elasticsearch (faceted + geo)
- Storage/CDN: S3-compatible with CDN; presigned uploads
- Payments: Stripe + Stripe Connect (buyers pay, sellers paid out)

### Development conventions
- TypeScript everywhere; shared types in `packages/shared`
- IDs are UUIDv4; timestamps are ISO 8601, UTC
- Amounts stored as integers in minor units; currency ISO 4217
- Pagination is cursor-based; limit defaults to 20, max 100
- Errors follow a common shape: `{ error: { code, message, details? } }`

---

## Canonical Domain Model (high-level)
- User: id, email, password_hash, roles, created_at
- Profile: user_id, display_name, avatar_url, bio, addresses
- Category: id, parent_id?, name, attribute_schema (JSON)
- Listing: id, seller_id, category_id, title, description, price, currency, status[draft|active|sold|expired], location{lat,lon,text}, created_at, updated_at
- ListingImage: id, listing_id, s3_key_original, variants{thumb,medium,large}
- ListingAttributes: listing_id, attributes JSON validated against category schema
- Conversation: id, participant_ids[], created_at
- Message: id, conversation_id, sender_id, text, created_at, read_at?
- Favorite: user_id, listing_id
- SavedSearch: user_id, params JSON, notify bool
- Order: id, buyer_id, seller_id, listing_id, amount_total, currency, state[created|paid|fulfilled|completed|canceled|refunded|disputed], timeline[]
- Payment: order_id, stripe_payment_intent_id, status, fees
- Notification: id, user_id, type, payload JSON, read_at
- ModerationFlag/Report: subject_type, subject_id, reason, status

---

## HTTP API Conventions (Backend -> Frontend)
- Base path: `/api/v1`
- Auth via httpOnly cookies; CSRF considered for cookie-auth flows
- Filtering via query params; complex filters as JSON-encoded param `filters`
- Standard endpoints (non-exhaustive):
  - POST /auth/signup|login|logout|verify
  - GET/PUT /me, GET /me/sessions, DELETE /me/sessions/:id
  - GET /categories, GET /categories/:id
  - POST/PUT/DELETE/GET /listings, GET /listings/:id
  - POST /images/presign -> returns upload URL + key
  - GET /search/listings with text, category, price, condition, geo, sort
  - GET /favorites, POST /favorites/:listingId
  - GET/POST /saved-searches
  - GET/POST /conversations, GET/POST /messages
  - POST /orders (creates order shell), GET /orders/:id
  - POST /payments/intent (delegates to Payments agent)
  - GET/POST /notifications
  - POST /reports (moderation)

### Error codes (examples)
- AUTH_INVALID_CREDENTIALS, AUTH_UNVERIFIED_EMAIL
- LISTING_NOT_FOUND, LISTING_INVALID_STATE
- PAYMENT_FAILED, PAYMENT_WEBHOOK_INVALID
- RATE_LIMITED, VALIDATION_ERROR, FORBIDDEN, NOT_FOUND

---

## WebSocket Contracts (Realtime)
- Namespace: /ws
- Auth: token/cookie on connection; join rooms by conversation:{id}
- Events:
  - Client -> Server: message:send, typing:start|stop, message:read
  - Server -> Client: conversation:new, message:new, message:read, typing

---

## Event Taxonomy (Cross-agent)
- Domain events emitted by Backend and Payments for Search/Notifications:
  - listing.created|updated|deleted
  - user.registered|verified
  - message.sent|read
  - order.created|paid|fulfilled|completed|canceled|refunded|disputed
  - image.processed

Event payload minimums include entity id, timestamps, and denormalized fields required by Search.

---

## Search Contract (OpenSearch)
- Index: listings
- Fields: id(keyword), title(text+ngram), description(text), category_id(keyword), price(long), currency(keyword), condition(keyword), location(geo_point), created_at(date), attributes(flattened)
- Query primitives supported by Search service:
  - Text multi-match on title/description with category boosts
  - Filters: category, price range, condition, geo distance
  - Sort: relevance|date_desc|price_asc|price_desc|distance
  - Facets: category, condition, price ranges

---

## Media Contract (S3 + CDN)
- Uploads via POST /images/presign -> { uploadUrl, key, maxSize, mimeTypes }
- Client uploads directly; then POST /listings/:id/images with the key and order index
- Processed variants written to a separate bucket/prefix; CDN URLs exposed in API

---

## Payments & Orders Contract (Stripe)
- Orders are created in platform DB; Payments creates/attaches Stripe PaymentIntent
- Webhooks drive order state transitions; idempotent processing is mandatory
- Fee model: marketplace fee + processing fee persisted on order

---

## Security Baselines (All agents)
- OWASP-oriented: input validation, output encoding, secure headers
- Auth: httpOnly cookies, session rotation, password hashing (argon2)
- RBAC groundwork: roles[user|seller|admin]
- Rate limits on auth, listing create, messaging
- PII in transit via TLS; secrets not committed

---

## Performance & SEO Budgets
- Web p75: LCP < 2.5s, INP < 200ms, CLS < 0.1 on test data
- API p95: < 200ms for typical reads, < 500ms for searches
- SEO: SSR for key pages, clean URLs, JSON-LD for product pages, sitemaps

---

## Minimal E2E Acceptance Flows
1) Sign up -> verify email -> sign in
2) Seller: create listing with images -> publish
3) Buyer: search -> open listing -> message seller
4) Buyer: purchase listing (test payment) -> order appears in buyer and seller views
5) Moderation: report listing -> admin resolves -> listing state updates

---

## Cross-Agent Coordination Rules
- Shared types live in `packages/shared`; regenerate when API changes
- Do not break API/event contracts; if change is required, update this file first
- Use consistent entity names and enums as defined above
- Keep mock/test data realistic and aligned across agents
- All agents respect pagination, error shape, and id formats

---

## File Map (for reference)
- AI_AGENT_SPLIT.md — high-level five-agent split
- agent-1.md — Frontend
- agent-2.md — Backend API & Services
- agent-3.md — Database, Search & Media
- agent-4.md — Payments & Orders
- agent-5.md — Trust, Safety & Moderation
- packages/shared — shared TypeScript models and SDK (to be created by agents 1–2)

---

## Final Reminder
Start by conforming to this shared goal and contracts. Then follow your agent’s step-by-step file. If conflicts arise, prefer the contracts here and coordinate by updating this file explicitly.


