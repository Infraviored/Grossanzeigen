# IMPORTANT!!
After each step read the next step of the markdown file  and fulfill it until you are done.

## Agent 5 — Trust, Safety & Moderation

### Scope
Provide baseline protections for users and the platform: content moderation, abuse prevention, reporting/takedown, and basic privacy controls.

### Principles
- Prefer lightweight guardrails that block obvious abuse while enabling fast iteration
- Keep human-review hooks for edge cases

---

### Step 1 — Policy surfaces
- Add endpoints/content for: Terms of Service, Privacy Policy, Prohibited Items, Community Guidelines
- Ensure links are available for the frontend
- Acceptance: documents retrievable and render in web

### Step 2 — Account verification & integrity
- Email verification after signup; prevent unverified posting
- Device/session tracking; unusual login notification (email)
- Acceptance: unverified users cannot publish listings

### Step 3 — Rate limiting & throttles
- Per-IP and per-account rate limits for auth, listing create, messaging
- Burst and sustained limits; error responses consistent
- Acceptance: limits enforced under load test

### Step 4 — Content moderation: images
- Integrate an image moderation provider (or OSS model) for NSFW/violence/illegal content flags
- Store moderation status per image; block publishing when flagged
- Acceptance: flagged images prevent listing publish; admin override possible

### Step 5 — Content moderation: text
- Heuristic filters for slurs, illegal items keywords; language-aware where possible
- Mark listing/message as needs-review when triggered
- Acceptance: flagged text routes to review queue

### Step 6 — Reporting & takedown
- Endpoints for users to report listings/users/messages with reasons
- Moderation queue: triage, assign, resolve with actions (remove, warn, ban)
- Acceptance: reports flow through statuses; actions audit-logged

### Step 7 — User enforcement
- Soft-ban (cannot publish/message), hard-ban (login blocked), shadow-ban (content hidden to others)
- Time-bound suspensions; email notices for actions
- Acceptance: enforcement states take effect immediately

### Step 8 — Fraud & spam heuristics (MVP)
- Signals: rapid-fire messages, repeated links, disposable emails, IP reputation (placeholder)
- Score and apply additional throttles or manual review
- Acceptance: obvious spam accounts are slowed or blocked

### Step 9 — Dispute hooks
- Provide endpoints for dispute initiation (ties into Orders/Payments later)
- Track dispute states; notify relevant parties
- Acceptance: basic dispute tickets can be created and viewed

### Step 10 — Privacy/GDPR basics
- Export my data: compile user profile, listings, messages metadata (content optional for MVP)
- Delete my account: queue deletion with grace period; anonymize content where required
- Acceptance: requests tracked with status and processed

### Step 11 — Admin tooling
- Admin pages/APIs for moderation queue, user search, enforcement actions
- Role checks for admin; audit every admin action
- Acceptance: admins can review/act on reports

### Step 12 — Logging & alerting
- Structured logs for moderation events; alerts for spike in reports or flags
- Dashboards: reports volume, resolution time, false positive rate (manual input)
- Acceptance: basic alerts fire on thresholds

### Step 13 — Integration contract
- Document web hooks/streams for the frontend and backend to reflect moderation states
- Provide status enums and UI text suggestions
- Acceptance: `README-trust-safety.md` present


