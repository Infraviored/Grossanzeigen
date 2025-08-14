## AI Agent Split — Build eBay in 5 Tasks (no phases, no timelines)

### Framework/Stack (decided)
- Frontend: Next.js (React, TypeScript, Tailwind)
- Backend API: NestJS (Node.js, TypeScript, REST + WebSocket)
- Database: PostgreSQL (Prisma ORM)
- Search: OpenSearch/Elasticsearch
- Storage/CDN: S3-compatible + CDN
- Payments: Stripe + Stripe Connect

---

## Agent 1 — Frontend Web App (Next.js / React)
- Build all user-facing pages and flows:
  - Home, search with filters/facets, listing detail, seller profile
  - Create/edit listing wizard with image upload (presigned URLs)
  - Messaging UI (real-time), favorites/saved searches
  - Checkout UI, orders view, account settings
- Implement SEO (SSR), responsive UI, basic accessibility
- Integrate with Backend API for all data
- Done when a buyer can search → view → message → buy, and a seller can list → manage orders

## Agent 2 — Backend API & Services (NestJS)
- Provide REST + WebSocket APIs for:
  - Auth (email/password + OAuth), users, profiles, sessions
  - Listings, categories, images (generate presigned S3 URLs)
  - Messaging (conversations, messages, read receipts)
  - Notifications (email + in-app hooks)
  - Orders endpoint stubs (hand off to Payments agent for payment actions)
- Emit events for Search indexing and Notifications
- Basic rate limiting and input validation
- Done when all frontend screens have working, documented endpoints

## Agent 3 — Database, Search & Media
- Design and migrate PostgreSQL schema:
  - Users, Profiles, Sessions
  - Listings, Categories, ListingAttributes, ListingImages
  - Conversations, Messages
  - Orders, OrderItems (for Payments), Favorites, SavedSearches
- Stand up OpenSearch with mappings and ingestion from DB/events
- Provide fast faceted search, geo distance, sort (price/date/distance)
- S3 buckets for media; image validation and simple async resize pipeline
- Done when typical searches return fast and listings/media persist correctly

## Agent 4 — Payments & Orders (Stripe)
- Integrate Stripe Checkout/Payment Intents and Stripe Connect for seller payouts
- Implement order lifecycle and webhooks:
  - created → paid → fulfilled → completed (with refund/dispute paths)
  - secure webhook handlers, idempotency, reconciliation
- Fees and receipts (basic invoicing); expose order/payment APIs to Backend
- Done when a buyer can pay successfully and the seller receives a payout

## Agent 5 — Trust, Safety & Moderation
- Basic guardrails:
  - Image/text moderation on listings (provider or OSS)
  - Report/takedown flow, audit trail
  - Rate limiting, simple spam/abuse heuristics
- Account controls: email verification, delete/export data (basic GDPR)
- Policy pages wired in the frontend
- Done when prohibited content is blocked/removed and abuse is throttled

---

### Integration Notes (minimal)
- Frontend talks only to Backend API; Backend uses DB/Search/Payments/Storage
- Events from Backend feed Search indexing; Payments emits order events back to Backend
- Use presigned URLs for media upload; WebSocket for messaging


