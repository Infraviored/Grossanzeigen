# IMPORTANT!!
After each step read the next step of the markdown file  and fulfill it until you are done.

## Agent 1 — Frontend Web App (Next.js / React / TypeScript)

### Stack (fixed)
- Next.js (App Router), React, TypeScript, Tailwind CSS, Radix UI
- State/data: React Query, Zod for schemas, Axios/Fetch for API, Socket.IO client
- Auth UI: next-auth compatible flows (email/password + OAuth)
- Images: next/image, S3 presigned upload integration

### Conventions
- Use functional components, server components where beneficial, client components for interactive parts
- Keep UI in `apps/web/src/app`, shared types in `packages/shared`
- Follow accessible, responsive, mobile-first design

---

### [x] Step 1 — Initialize Next.js app
- Create Next.js app with TypeScript and Tailwind enabled
- Configure absolute imports and ESLint/Prettier
- Add base layout with header, footer, and toasts area
- Acceptance: app builds locally and renders a starter page

### [x] Step 2 — Project structure
- Create directories: `app/(public)`, `app/(auth)`, `app/(account)`, `app/(sell)`, `app/(search)`, `app/(messages)`
- Add `components/` (UI primitives), `features/` (feature modules), `lib/` (utils), `hooks/`
- Acceptance: routing scaffolds compile with placeholder pages

### [ ] Step 3 — Design system & theming
- Install Tailwind + Radix; set color tokens, typography scale, spacing
- Build core components: Button, Input, Select, Checkbox, Modal, Sheet, Tabs, Toast
- Acceptance: Storybook or simple showcase page renders all primitives

### [ ] Step 4 — Authentication UI
- Pages: sign in, sign up, email verification, forgot/reset password
- Forms with zod validation; API calls to `/auth/*`
- Post-auth redirect logic; error and success states
- Acceptance: can sign up/sign in against stub or live backend

### [ ] Step 5 — Account & settings
- Pages: profile, addresses, notification preferences, saved payment methods (tokens only)
- Device sessions list with revoke; delete account flow (confirm + grace text)
- Acceptance: read/write via API, optimistic UI with React Query

### [ ] Step 6 — Listing model types
- Add shared types for Listing, Category, Attributes, Image, SellerProfile
- Create data fetch hooks for listings: `useListing(id)`, `useListings(params)`
- Acceptance: type-safe hooks with error/loading states

### [ ] Step 7 — Listing detail page
- Gallery with thumbnails, image zoom, condition, specs, price, location map snippet
- Seller card with rating placeholder; contact actions
- Related listings section
- Acceptance: renders real listing data; deep links work

### [ ] Step 8 — Search & browse
- Search page with query in URL; filters: category, price range, condition, distance, sort (date/price/distance)
- Faceted sidebar; infinite scroll; empty-state messaging
- Map pin view toggle (optional MVP: link to map site)
- Acceptance: changes reflect in URL; back/forward restore state

### [ ] Step 9 — Saved searches & favorites
- Save current search with name; list + delete; toggle notifications setting
- Favorite listings from cards/detail; favorites page
- Acceptance: persisted to backend; UI updates optimistic

### [ ] Step 10 — Listing create/edit wizard (seller)
- Multi-step: title, category, attributes, price, location, images, review
- Client-side validation; autosave draft; leave-without-saving guard
- Acceptance: draft persists; publish creates active listing

### [ ] Step 11 — Image upload (presigned URLs)
- Drag/drop uploader; reorder; progress; show transform status
- Accept only allowed types/sizes; thumbnail generation display
- Acceptance: images upload via presigned URLs; final URLs render in gallery

### [ ] Step 12 — Messaging UI
- Conversations list with last message and unread count; conversation view with typing/read receipts
- Real-time updates via WebSocket; input with attachments placeholder
- Acceptance: sending/receiving works across two browsers; unread badges accurate

### [ ] Step 13 — Notifications (in-app)
- Bell icon menu with latest notifications; mark-as-read; settings link
- Toasts for important events (message received, order updates)
- Acceptance: notifications fetched/pushed and state syncs

### [ ] Step 14 — Checkout UI
- Cart-less direct checkout from listing detail (quantity support optional)
- Stripe elements or redirect flow; show fees/taxes breakdown from API
- Post-payment order confirmation page
- Acceptance: completes payment successfully in test mode

### [ ] Step 15 — Orders & seller views
- Buyer: orders list/detail with status timeline
- Seller: orders list/detail with buyer contact and shipping info
- Acceptance: status updates render correctly; edge states handled

### [ ] Step 16 — Seller dashboard (MVP)
- Overview: views, messages, conversion placeholders
- Manage listings: active, sold, drafts; quick actions (edit, promote placeholder)
- Acceptance: tables paginate; searching/filtering works

### [ ] Step 17 — SEO & metadata
- Title/meta tags; OpenGraph; JSON-LD for product pages
- Sitemaps (index + listings, categories); robots.txt
- Acceptance: Lighthouse SEO pass; inspect elements show correct tags

### [ ] Step 18 — Accessibility & i18n
- Keyboard navigable components; aria attributes; focus rings
- i18n scaffolding with locale switch (strings file)
- Acceptance: axe audit clean for critical pages

### [ ] Step 19 — Error handling & empty states
- Global error boundary; not-found pages for missing listings
- Consistent empty/loading skeletons
- Acceptance: forced errors show user-friendly messages

### [ ] Step 20 — Performance budgets
- Use Next/image, code splitting, prefetching; avoid waterfalls
- Set Core Web Vitals budgets; measure with Web Vitals and Lighthouse CI
- Acceptance: p75 LCP < 2.5s on test data

### [ ] Step 21 — Minimal E2E flows (smoke)
- Sign up → create listing → view from anon → send message → checkout (test)
- Add Playwright scripts to run headless
- Acceptance: smoke suite green locally

### [ ] Step 22 — Feature flags
- Wire basic flag provider (env or simple config endpoint)
- Gate non-essential UI (promotions) behind flags
- Acceptance: toggling flag hides/shows features without errors

### [ ] Step 23 — Ready to integrate

---

### Immediate next steps (aligned with current repo)
- Implement a proper landing page at `/` in `apps/web/src/app/page.tsx` with:
  - Hero + primary CTA to `/sell` and secondary CTA to `/search`
  - Inline search box (submit to `/search?q=...`)
  - Category grid (fetch `GET /api/v1/categories` and link to `/search?categoryId=...`)
- Create `/search/page.tsx` (not under a route group index) with:
  - Query param state sync, filter panel stub, list of result cards from `GET /api/v1/listings`
- Ensure no new group-level `page.tsx` is added that resolves to `/`.
- Document required env vars and API base URL
- List endpoints consumed and events expected
- Acceptance: handoff doc present in repo `README-frontend.md`


