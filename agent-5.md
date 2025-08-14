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
- [x] Add endpoints/content for: Terms of Service, Privacy Policy, Prohibited Items, Community Guidelines
- [x] Ensure links are available for the frontend
- [x] Acceptance: documents retrievable and render in web

### Step 2 — Account verification & integrity
- [x] Email verification endpoints after signup (issue/verify/resend token)
- [x] Device/session tracking (sessions list and revoke)
- [x] Unusual login notification (email)
- [x] Prevent unverified users from publishing listings (guard)
- [x] Acceptance: unverified users cannot publish listings (guard + service check)

### Step 3 — Rate limiting & throttles
- [x] Per-IP and per-account rate limit guard scaffolded (in-memory)
- [x] Apply to auth, listing create/publish, messaging endpoints
- [x] Burst and sustained limits; error responses consistent
- [ ] Acceptance: limits enforced under load test

### Step 4 — Content moderation: images
- [ ] Integrate an image moderation provider (or OSS model) for NSFW/violence/illegal content flags
- [x] Store moderation status/flag on uploaded images; block when flagged (placeholder)
- [x] Acceptance: flagged images prevent listing publish; admin override possible

### Step 5 — Content moderation: text
- [x] Heuristic filters for illegal items keywords (placeholder)
- [x] Flag message to reports when triggered (routes to audit/log queue)
- [ ] Acceptance: flagged text routes to review queue

### Step 8 — Fraud & spam heuristics (MVP)
- [ ] Signals and scoring service scaffold
- [ ] Apply throttles or manual review based on score
- [ ] Acceptance: obvious spam accounts are slowed or blocked

### Step 6 — Reporting & takedown
- [x] Endpoint for users to report listings/users/messages with reasons
- [x] Moderation queue: triage and resolve with actions (remove, warn, ban)
- [x] Acceptance: reports audit-logged

### Step 7 — User enforcement
- [x] Enforcement API scaffold (soft/hard/shadow-ban actions audit-logged)
- [x] Time-bound suspensions via `until` on enforcement
- [ ] Acceptance: enforcement states take effect immediately

### Step 8 — Fraud & spam heuristics (MVP)
- Signals: rapid-fire messages, repeated links, disposable emails, IP reputation (placeholder)
- Score and apply additional throttles or manual review
- Acceptance: obvious spam accounts are slowed or blocked

### Step 9 — Dispute hooks
- [x] Endpoint for dispute initiation (audit-logged)
- [ ] Track dispute states; notify relevant parties
- [x] Acceptance: basic dispute tickets can be created and viewed

### Step 10 — Privacy/GDPR basics
- [x] Endpoints to request data export and account deletion (audit-logged)
- [ ] Implement processing and anonymization flow
- [ ] Acceptance: requests tracked with status and processed

### Step 11 — Admin tooling
- [x] Admin APIs for moderation queue and enforcement actions (scaffold)
- [x] Role checks for admin; audit every admin action
- [x] Acceptance: admins can review/act on reports

### Step 12 — Logging & alerting
- [x] Structured logs for moderation events via `AuditLog`
- [ ] Alerts for spike in reports or flags (threshold-based)
- [ ] Dashboards: reports volume, resolution time, false positive rate (manual input)
- [ ] Acceptance: basic alerts fire on thresholds

### Step 13 — Integration contract
- [x] Provide status enums and UI text suggestions (in code)
- [ ] Document web hooks/streams for the frontend and backend to reflect moderation states
- [ ] Acceptance: `README-trust-safety.md` present

---

### Immediate next steps (aligned with current repo)
- Provide a simple in-memory threshold alert in `AlertsModule` and expose `/api/v1/admin/alerts/report-spike` for ops testing.
- Collaborate with Agent 1 to surface moderation states in UI (badge on listing detail if under review, toasts on actions).
- Document moderation state enums and recommended UI text in `GLOBAL_AGENT_GOAL.md` extras.


