# Database Ops (Agent 3)

## Backups (dev)
- Logical dump: `pg_dump -h localhost -U postgres -d grossanzeigen -F c -f backups/grossanzeigen_$(date +%F).dump`
- Restore: `pg_restore -h localhost -U postgres -d grossanzeigen --clean backups/<file>.dump`

## VACUUM / ANALYZE
- Weekly: `VACUUM (VERBOSE, ANALYZE);`
- Target heavy-write tables more frequently: `Listing`, `Message`, `SearchOutbox`.

## Index bloat checks
- Use `pgstattuple` or query `pg_stat_user_indexes` to track bloat and scans; rebuild if bloat > 30%.

## Migrations
- Always use Prisma migrations for schema changes.
- For triggers or bespoke SQL, create `--create-only` migration and edit `migration.sql`.

## Reindexing Search
- Use `apps/api/src/scripts/reindex-listings.ts` to build a new versioned index and swap alias `listings`.


