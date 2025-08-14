# IMPORTANT!!
After each step read the next step of the markdown file  and fulfill it until you are done.

## Agent 1A — Public & Search Experience (Next.js / React / TypeScript)

### Scope
Own the public-facing experience and search/browse flows. Deliver a real landing page at `/` and a functional `/search` with filters and results. Avoid creating any new route-group index `page.tsx` that would resolve to `/`.

### Existing assets to leverage (do not duplicate)
- Layout/shell: `apps/web/src/app/layout.tsx`, `globals.css`, `providers.tsx`
- Pages you can build on: `apps/web/src/app/page.tsx`, `apps/web/src/app/search/page.tsx`
- Loading states: `apps/web/src/app/(public)/loading.tsx`, `apps/web/src/app/(search)/loading.tsx`
- UI primitives: `apps/web/src/components/ui/*` (button, input, select, checkbox, modal, sheet, tabs, toast)
- Hooks: `apps/web/src/hooks/useListings.ts`, `apps/web/src/hooks/useListing.ts`
- API helpers: `apps/web/src/lib/api.ts`

### API contracts to consume
- `GET /api/v1/categories`
- `GET /api/v1/listings?text=&categoryId=&minPrice=&maxPrice=&sort=&cursor=&limit=`
- `GET /api/v1/listings/:id` (for related items section)

---

### Step 1 — Replace landing page `/`
- File: `apps/web/src/app/page.tsx`
- Implement:
  - Hero section: headline, subcopy
  - Inline search box form (`GET` to `/search?q=...`)
  - CTAs: primary → `/sell`, secondary → `/search`
  - Category grid (4–8 items): hardcode names first, then wire to `GET /api/v1/categories`
- Acceptance: Navigating to `/` renders hero, search, CTAs, and category links.

### Step 2 — `/search` page scaffolding
- File: `apps/web/src/app/search/page.tsx` (this route already exists; enhance it)
- Implement:
  - Read `q`, `categoryId`, `min`, `max`, `sort`, `cursor` from URLSearchParams
  - Use `useListings` to fetch results; render list of cards with price/title/image placeholder
  - Pagination: next/prev via `cursor` param
  - Empty state message when no results
- Acceptance: Visiting `/search?q=phone` shows results; changing URL params refines results.

### Step 3 — Filters panel (client component)
- Integrate a left sidebar or top filter bar with controls:
  - Category select (from categories API)
  - Price min/max inputs
  - Sort select (date_desc, price_asc, price_desc)
- Keep filter state in the URL (pushState/replaceState) so refresh/back works
- Acceptance: Changing filters updates URL and triggers new fetch; results reflect filters.

### Step 4 — Result card component
- Create `apps/web/src/components/ResultCard.tsx` with props { id, title, price, currency, imageUrl?, locationText? }
- Use `next/link` to link to `/listings/[id]`
- Acceptance: Cards render consistently and are clickable to detail pages.

### Step 5 — Category-driven browse
- From the landing page category grid, link to `/search?categoryId=...`
- On `/search`, show a breadcrumb or chip for the selected category with a clear button
- Acceptance: Clicking a category on `/` lands on `/search` with filtered results.

### Step 6 — SEO & metadata (public/search)
- Add appropriate `<title>` and descriptions for `/` and `/search` via Next metadata
- Add JSON-LD for product snippets on listing cards only if server data available (optional)
- Acceptance: View source shows correct meta; Lighthouse SEO warnings are minimal.

### Step 7 — Performance & UX polish
- Use `next/image` for thumbnails
- Skeleton states while loading (`loading.tsx` already present for groups)
- Debounce typing in the search box (client) before navigation
- Acceptance: Interaction remains smooth, no layout shifts for thumbnails.

### Guardrails
- Do not add new route-group `page.tsx` files inside `(public)` or `(search)` that would resolve to `/`.
- Keep state in URL; never rely solely on React local state for filters.

### Handoff artifacts
- Update `README-frontend.md` with public/search usage, URL param contract, and example deep links.


