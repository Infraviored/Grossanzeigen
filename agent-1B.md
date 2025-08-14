# IMPORTANT!!
After each step read the next step of the markdown file  and fulfill it until you are done.

## Agent 1B — Seller Experience: Listing Wizard & Media Uploads

### Scope
Own the seller flows: listing creation/edit wizard, draft autosave, presigned uploads, and publish/unpublish actions.

### Existing assets to leverage (do not duplicate)
- Wizard routes: `apps/web/src/app/(sell)/wizard/*` (title, category, attributes, price, location, images, review)
- Seller entry point: `apps/web/src/app/sell/page.tsx`
- Uploader: `apps/web/src/components/uploader/PresignedUploader.tsx`
- UI primitives: `apps/web/src/components/ui/*`
- Hooks: `apps/web/src/hooks/useListing.ts`
- API helper: `apps/web/src/lib/api.ts`

### API contracts to consume
- `POST /api/v1/listings` (create draft)
- `PUT /api/v1/listings/:id` (edit draft/active)
- `POST /api/v1/listings/:id/publish` and `POST /api/v1/listings/:id/unpublish`
- `POST /api/v1/images/presign` → { uploadUrl, key }
- `POST /api/v1/images/attach` → attach uploaded key to listing with order index

---

### Step 1 — Seller entry page
- File: `apps/web/src/app/sell/page.tsx`
- Show CTA to start wizard; if a draft exists in localStorage (listingId), offer “Continue draft”
- Acceptance: Clicking “Start” routes to `/sell/wizard` and creates a draft server-side.

### Step 2 — Wizard shell and step state
- File: `apps/web/src/app/(sell)/wizard/layout.tsx` and `.../wizard/page.tsx`
- Keep current listingId in URL query or localStorage; fetch draft before rendering steps
- Acceptance: Wizard displays step nav; unavailable steps disabled until prior completion.

### Step 3 — Steps (title, category, attributes, price, location)
- Implement each step component to update the draft via `PUT /listings/:id`
- Autosave after field blur and when navigating next/prev
- Acceptance: Refreshing mid-wizard restores data from server.

### Step 4 — Images step (presigned uploads)
- Use `PresignedUploader.tsx` to request presigned URL → direct-upload → attach
- Support reorder of images; maintain `orderIndex`
- Acceptance: Thumbnails render, reorder persists, and review page shows images.

### Step 5 — Review & publish
- Show a summary; wire “Publish” to `POST /listings/:id/publish`
- If blocked (e.g., unverified email or moderation flagged), show clear error and guidance
- Acceptance: Publish transitions draft → active and redirects to `listings/[id]`.

### Step 6 — Unpublish and edit from detail
- On `apps/web/src/app/listings/[id]/page.tsx`, render edit/unpublish when current user is seller
- Acceptance: Unpublish returns to draft and wizard allows edits.

### Guardrails
- Do not create new overlapping routes; reuse existing wizard directory
- Keep listingId persisted; never orphan the draft

### Handoff artifacts
- Document POST/PUT payload shapes for each step and expected server responses


