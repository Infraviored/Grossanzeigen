# IMPORTANT!!
After each step read the next step of the markdown file  and fulfill it until you are done.

## Agent 1C — Account, Auth, Messaging, Notifications

### Scope
Own authenticated user surfaces: auth screens, account pages, device sessions, and user-to-user messaging UI with in-app notifications.

### Existing assets to leverage (do not duplicate)
- Account pages: `apps/web/src/app/(account)/*` (profile, addresses, notifications, payment-methods, favorites, saved-searches, verify-email)
- Auth pages: `apps/web/src/app/(auth)/*` (signin, signup, verify, reset-password)
- Messaging routes: `apps/web/src/app/(messages)/` and `apps/web/src/app/conversations/*` if present
- Notifications page: `apps/web/src/app/(account)/notifications/page.tsx` (system)
- UI primitives: `apps/web/src/components/ui/*`
- API helper: `apps/web/src/lib/api.ts`

### API contracts to consume
- Auth: `POST /api/v1/auth/signup|login|logout|verify|verify/resend`
- Me: `GET /api/v1/me`, `GET /api/v1/me/profile`, `PUT /api/v1/me/profile`, `PUT /api/v1/me/addresses`
- Sessions: `GET /api/v1/me/sessions`, `DELETE /api/v1/me/sessions/:token`
- Messaging: `POST /api/v1/conversations`, `GET /api/v1/conversations/:id/messages`, `POST /api/v1/conversations/:id/messages`
- Notifications: `GET /api/v1/notifications`, `POST /api/v1/notifications/read`

---

### Step 1 — Auth forms wiring
- Implement client forms (signin/signup/reset/verify) with zod validation and POST to auth endpoints
- On signin, rely on httpOnly cookie; redirect to `/account`
- Acceptance: You can sign up, receive a verification-required UX, and sign in.

### Step 2 — Account profile & addresses
- File: `apps/web/src/app/(account)/profile/page.tsx` and `.../addresses/page.tsx`
- Read/write using `GET/PUT` endpoints; optimistic updates via React Query (optional)
- Acceptance: Profile and addresses persist and reload correctly.

### Step 3 — Device sessions management
- File: `apps/web/src/app/(account)/page.tsx` or a subpage
- Render sessions from `GET /me/sessions`; allow revoke via `DELETE`
- Acceptance: Revoking a session removes it and UI updates.

### Step 4 — Verify email UX
- File: `apps/web/src/app/(account)/verify-email/page.tsx`
- If `GET /me` indicates unverified, show callout with button to resend verification (POST `/auth/verify/resend`)
- Acceptance: Resend flows and banners work.

### Step 5 — Messaging UI (MVP)
- Conversations list + message thread view; send message form (text only)
- Poll or use Socket.IO client for real-time updates (typing/read receipts optional)
- Acceptance: Two browsers can exchange messages and see updates.

### Step 6 — Notifications UX (in-app)
- Bell icon in header: fetch latest; mark-as-read action; badges
- Notifications page in `(account)` shows history
- Acceptance: New messages update the bell; marking read clears badge.

### Guardrails
- Do not create `/notifications` duplicate outside `(account)` (it caused conflicts before)
- Keep auth cookie handling server-safe; never store tokens in localStorage

### Handoff artifacts
- Document auth flows and expected server responses, including verification states and session UX


