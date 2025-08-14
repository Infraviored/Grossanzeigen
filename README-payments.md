# Payments Service (Agent 4)

Implements Stripe + Stripe Connect integration for orders, fees, payouts, and webhooks.

## Service Path and Port
- Location: `services/payments`
- Base path: `/api/v1`
- Default port: 3002 (override with `PORT` env)

## Endpoints (initial)
- GET `/api/v1/health` → `{ status: 'ok' }`
- GET `/api/v1/payments/stripe/balance` → Stripe balance (requires `STRIPE_SECRET_KEY`)
  - If not configured, returns 503 `{ error: { code: 'PAYMENTS_NOT_CONFIGURED', message } }`

## Environment
Copy `services/payments/env.example` to `services/payments/.env` and set:
- `STRIPE_SECRET_KEY=sk_test_...`
- `STRIPE_API_VERSION=2024-06-20` (default)
- `PORT=3002` (optional)

## Coordination
- Run this service independently of other agents to avoid port conflicts.
- Contract changes must also update `GLOBAL_AGENT_GOAL.md`.

## Next Steps (per Agent 4 plan)
1. Stripe setup (balance check working)
2. Customer handling (create/reuse)
3. Seller onboarding (Connect + onboarding link)
4. PaymentIntent creation for orders
5. Fees calculation and transparency endpoint
6. Webhooks with signature verification + idempotency
7. Refunds, disputes, receipts, reconciliation jobs
