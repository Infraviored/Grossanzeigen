# IMPORTANT!!
After each step read the next step of the markdown file  and fulfill it until you are done.

## Agent 3 — Database, Search & Media (PostgreSQL, Prisma, OpenSearch, S3)

### Scope
Design the relational schema, implement migrations and seeds, stand up search with proper mappings and ingestion, and provide S3-based media storage and a simple async image pipeline.

### Data rules
- Normalize where it helps integrity; denormalize selectively for performance
- Use UUIDs for public ids; created_at/updated_at on all tables
- Soft-delete where user-facing deletes occur; keep audit columns

---

### Step 1 — Prisma setup
- Initialize Prisma in `apps/api` with PostgreSQL provider
- Configure connection string via env; enable preview features needed
- Acceptance: `prisma migrate dev` runs without errors

### Step 2 — Core tables: users & auth
- Tables: users, profiles, sessions, devices, verification_tokens, password_resets
- Indices on email (unique), session tokens, device identifiers
- Acceptance: can create a user and a session via seed script

### Step 3 — Catalog: categories & attributes
- Tables: categories (tree), category_attributes (schema per category)
- Store attribute schema as JSON with type hints (enum, number range, text)
- Acceptance: sample categories loaded; attributes retrievable

### Step 4 — Listings & images
- Tables: listings, listing_attributes (EAV or JSON per category schema), listing_images
- Columns: status (draft/active/sold/expired), price, currency, geo (lat/lon), location text
- Indices: status, price, created_at, geo (use PostGIS or separate lat/lon indices)
- Acceptance: can insert listing with attributes and images

### Step 5 — Messaging
- Tables: conversations (participants), messages (text, attachments placeholder), receipts (read)
- Indices: by conversation, by user, created_at
- Acceptance: create a conversation and append messages in seed

### Step 6 — Orders & payments (shared with Payments agent)
- Tables: orders, order_items, payments, refunds, payouts
- Keep minimal fields for handoff to Payments agent (stripe ids, amounts)
- Acceptance: order can be created and moved through states by updates

### Step 7 — Social: favorites & saved searches
- Tables: favorites (user_id, listing_id), saved_searches (user_id, params JSON)
- Acceptance: saved search stored and retrieved; favorite toggled

### Step 8 — Notifications
- Tables: notifications (user_id, type, payload JSON, read_at)
- Acceptance: insert and list notifications for a user

### Step 9 — Moderation
- Tables: moderation_flags (subject_type/id, reason, status), reports, audit_log
- Acceptance: report stored; status transitions recorded

### Step 10 — Outbox for search
- Table: search_outbox (event_type, entity_id, payload, processed_at)
- Trigger creation on listing insert/update/delete
- Acceptance: creating/updating a listing enqueues an outbox record

### Step 11 — Seed datasets
- Create seed scripts for categories, sample users, sample listings with images
- Generate realistic attribute values; random geos within a bounding box
- Acceptance: after seed, app has 1k+ listings for testing

### [x] Step 12 — OpenSearch cluster and indices
- Create indices: `listings`, `sellers`
- Mappings: text fields with analyzers, keyword for exact, numeric for facets, geo_point for location
- Acceptance: indices exist with expected mappings

### Step 13 — Analyzers & synonyms
- Add language analyzers; category-specific synonym sets (e.g., "phone" ~ "smartphone")
- N-grams for partial match on titles
- Acceptance: queries return expected matches for synonyms and partials

### Step 14 — Ingestion pipeline
- Service to consume search_outbox and upsert documents
- Handle tombstones on delete; idempotent operations
- Acceptance: changing a listing updates search doc; delete removes it

### Step 15 — Query helpers
- Implement search helpers: query building for text + filters + sort + geo distance
- Use `search_after` for deep pagination
- Acceptance: helper returns consistent results vs raw queries

### Step 16 — Facets & counts
- Configure aggregations for category, condition, price ranges
- Acceptance: UI receives facet counts consistent with hits

### [x] Step 17 — Reindexing
- Full reindex job with alias swap (listings_v1 → listings_v2)
- Progress logging; throttle to protect cluster
- Acceptance: reindex completes, zero-downtime alias switch works

### Step 18 — S3 storage for media
- Buckets: `images-original`, `images-processed`
- Lifecycle policies (e.g., transition to infrequent access later)
- Acceptance: objects can be uploaded via presigned URLs and read via CDN

### [x] Step 19 — Image processing pipeline
- Worker to resize to presets (thumb, medium, large) and write to processed bucket
- Store processed variants in DB and mark readiness
- Acceptance: uploaded image results in available variants

### [ ] Step 20 — Backups & basic maintenance
---

### Immediate next steps (aligned with current repo)
- Provide a small seed set for `categories` and a dozen `listings` so Agent 1 can render search quickly.
- Deliver a lightweight ingestion daemon that drains `SearchOutbox` on interval (uses `apps/api/src/scripts/ingest-outbox.ts`).
- Document OpenSearch env in `.env` (e.g., `OPENSEARCH_NODE`, username/password) and ensure health uses those.
- Enable automated DB backups and document restore procedure (note only)
- Provide vacuum/analyze schedule guidance; index bloat checks
- Acceptance: scripts/docs exist in repo `db/README.md`


