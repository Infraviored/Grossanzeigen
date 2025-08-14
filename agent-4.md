# IMPORTANT!!
After each step read the next step of the markdown file  and fulfill it until you are done.

## Agent 4 — Payments & Orders (Stripe / Stripe Connect)

### Scope
Enable buyers to pay securely and sellers to receive payouts. Implement order lifecycle, fees, receipts, and robust webhooks with idempotency.

### Principles
- Keep source of truth for payments in Stripe; mirror minimal state in DB
- Idempotency for all payment-affecting endpoints
- Full audit trail on order state changes

---

### Step 1 — Stripe setup
- [ ] Create API keys (test); configure env vars
- [x] Install Stripe SDK; set API version explicitly
- [ ] Acceptance: simple API call succeeds (balance fetch)

### Step 2 — Customer handling
- [x] Create/reuse Stripe Customer for buyer on first checkout (endpoint in Payments)
- [ ] Store `stripe_customer_id` on user (API/DB)
- [ ] Acceptance: customer created and linked

### Step 3 — Seller onboarding (Connect)
- [x] Create Connect accounts for sellers; onboarding link endpoint (Payments)
- [ ] Store `stripe_account_id`; track onboarding status (API/DB)
- [ ] Acceptance: seller can complete onboarding in test mode

### Step 4 — Payment intent / checkout
- [x] Endpoint to create PaymentIntent for an order with proper amounts, currency, capture strategy (Payments)
- [ ] Support Stripe Checkout as an alternative path
- [ ] Acceptance: client can confirm and succeed in test mode

### Step 5 — Fees & amounts
- [x] Calculate marketplace fee and processing fee (Payments)
- [x] Transparency endpoint to fetch fee breakdown for UI (Payments)
- [ ] Persist fees on order (API/DB)
- [ ] Acceptance: numbers match expectations across test orders

### Step 6 — Order model & states
- [ ] States: created → paid → fulfilled → completed; error paths: canceled, refunded, disputed
- [x] Extend Payment/User models with Stripe fields (API/DB + shared types)
- [ ] Persist transitions with timestamps and who/what triggered
- [ ] Acceptance: API can drive transitions and reflect state

### Step 7 — Webhooks (critical)
- [x] Implement signature verification (dev-friendly fallback)
- [x] Idempotent processing table (in-memory placeholder)
- [x] Handle events stubs: payment_intent.succeeded/failed, charge.refunded, charge.dispute.created/closed
- [ ] Acceptance: replaying webhook events updates order idempotently

### Step 8 — Payouts to sellers
- [ ] Transfer funds to seller's Connect account less fees; allow scheduled payouts
- [x] Endpoint to view upcoming and past payouts (read from Stripe)
- [ ] Acceptance: seller sees test payouts in dashboard

### Step 9 — Refunds & partial refunds
- [x] Endpoint to create refunds (full/partial) with reason (Payments)
- [ ] Update order/payment records; emit events for UI
- [ ] Acceptance: refund reflected in Stripe and DB; order state updated

### Step 10 — Disputes (chargebacks)
- [ ] Webhook handling to mark orders disputed; attach evidence placeholders
- [ ] Endpoint to submit basic evidence notes/files (stub)
- [ ] Acceptance: dispute lifecycle visible in order timeline

### Step 11 — Receipts & invoices
- [x] Generate simple PDF receipt with line items, fees, taxes (Payments)
- [ ] Email/send link to buyer and seller; store URL on order
- [ ] Acceptance: receipt renders and downloads

### Step 12 — Reconciliation jobs
- [x] Job to list recent PaymentIntents and produce a simple report (Payments)
- [ ] Compare with local payments (API/DB)
- [ ] Acceptance: job runs and outputs a reconciliation report

### Step 13 — Security & compliance basics
- [x] Do not store raw PAN; rely on Stripe tokens only (SDK-only)
- [x] Respect SCA flows; surface 3DS required states (PaymentIntent supports request_three_d_secure)
- [ ] Acceptance: test cases with 3DS succeed

### Step 14 — Integration contract
- [ ] Document endpoints and payload contracts consumed by Backend API
- [ ] Provide example payloads for UI fee breakdown and order timeline
- [ ] Acceptance: `README-payments.md` present with examples

---

### Immediate next steps (aligned with current repo)
- Provide `/payments/fees` and `/payments/intent` examples in `README-payments.md` and wire API→Payments calls.
- Add a Stripe balance check endpoint health and a simple `GET /api/v1/health` passthrough in Payments for diagnostics.
- Coordinate with Agent 2 to persist `stripe_customer_id` and `stripe_account_id` on `User` and `PaymentIntent` id on `Payment`.


