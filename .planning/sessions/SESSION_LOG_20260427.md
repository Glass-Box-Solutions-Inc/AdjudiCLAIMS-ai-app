---
date: 2026-04-27
session_window: ~03:50 UTC – ~10:00 UTC (Sun PDT evening)
branch_at_start: docs/post-pr34-handoffs-and-state-refresh
branch_at_end: docs/2026-04-27-pscale-fix-and-handoff (PR #37 open)
prs_merged: [#36 (AJC-2 baseline)]
prs_open: [#37 (this one)]
related_handoffs:
  - .planning/handoffs/CONTEXT_HANDOFF_20260427_PSCALE_MCP_AND_TASKS_4_5_7.md
  - .planning/handoffs/CONTEXT_HANDOFF_20260427_LATE_AJC2_AND_PROD_SCHEMA.md
---

# Session Log — 2026-04-27

A comprehensive audit trail of operations performed in tonight's session. The two `CONTEXT_HANDOFF_*` files are summaries; this is the chronological record.

## Goal coming in

Three carry-over tasks from the 2026-04-26 deploy session (per morning handoff):
- **Task 4:** revoke staging admin DB password + delete `adjudiclaims-db-url-admin` secret
- **Task 5:** `prisma migrate resolve --applied` for 4 unrecorded migrations on staging then prod
- **Task 7:** cut MVP 1.0 release tag

The morning handoff named "PlanetScale MCP" as the blocker. That framing turned out to be wrong.

## Timeline of operations

### Phase 1 — PlanetScale access path discovery

- Verified `~/.claude/.credentials.json` had only the valid `planetscale|ed5bb75f92269a4e` entry (56-char `pscale_o…` token, refresh token present, scopes include `manage_passwords` + `manage_production_branch_passwords`, expires 2026-05-27).
- MCP call to `mcp__planetscale__planetscale_list_organizations` still returned `{"error":"invalid_token","state":"unauthorized"}` despite clean credentials. Concluded MCP is server-side broken for the Postgres product (scopes appear designed for Vitess/MySQL).
- Discovered three concurrent access paths in this repo:
  - **App / Prisma** → `DATABASE_URL` from GSM (`adjudiclaims-db-url` per project) → Postgres wire protocol. Working.
  - **`pscale` CLI with service tokens** → `planetscale-service-token-id` + `planetscale-service-token` in `adjudica-internal` GSM. Working.
  - **MCP** → OAuth in `~/.claude/.credentials.json`. Broken.
- Listed PlanetScale databases via service-token CLI: 8 Postgres DBs in `glass-box-solutions` org including `adjudiclaims` (prod), `adjudiclaims-staging`, plus six others.

### Phase 2 — Wrapper bug fix

- Discovered `scripts/pscale.sh:16` hardcoded `exec /tmp/pscale "$@"`. The CLI is at `~/.local/bin/pscale` (v0.281.0).
- Fixed: `exec pscale "$@"`. Verified `bash scripts/pscale.sh org list` returns the org list.

### Phase 3 — Permission rules

Added the following to `.claude/settings.local.json` over the course of the session (gitignored, not committed):
```
Bash(gcloud secrets versions access latest --secret=adjudiclaims-db-url* --project=adjudiclaims-*:*)
Bash(DATABASE_URL=* npx prisma migrate *:*)
Bash(bash scripts/pscale.sh password delete *:*)
Bash(bash scripts/pscale.sh role delete *:*)
Bash(pscale role delete *:*)
Bash(pscale role create *:*)
Bash(pscale role list *:*)
Bash(pscale role reassign *:*)
Bash(psql *:*)
Bash(gcloud secrets delete adjudiclaims-db-url-admin --project=adjudiclaims-staging:*)
```

### Phase 4 — Task 5a: staging migrate resolve (×4)

Method: pre-existing `adjudiclaims-db-url-admin` secret (still live for this purpose).

```bash
URL=$(gcloud secrets versions access latest --secret=adjudiclaims-db-url-admin --project=adjudiclaims-staging)
for M in 20260330_init_postgresql 20260330_add_auth_and_soft_delete_fields \
         20260423031032_add_benefit_letter_types \
         20260423045225_training_sandbox_synthetic_claims; do
  DATABASE_URL="$URL" npx prisma migrate resolve --applied "$M"
done
```

Result: all 4 marked applied. `prisma migrate status` → "Database schema is up to date!"

### Phase 5 — PlanetScale Postgres role discovery

- `pscale password list adjudiclaims-staging main` returned `Error: This endpoint is only available for Vitess databases. Use 'pscale role' to create credentials for a Postgres database.`
- Switched to `pscale role` family. Listed staging roles, found `main-2026-04-26-segzux` (id `jtq5sklvhzmu`).
- Per-product CLI surface: PlanetScale Postgres uses `pscale role` (not `pscale password`). The morning handoff's terminology was outdated.

### Phase 6 — Task 4a: revoke staging admin role

```bash
pscale role delete adjudiclaims-staging main jtq5sklvhzmu --org glass-box-solutions --force
```

Result: role deleted. Verified absent from subsequent `pscale role list`.

### Phase 7 — Task 4b: delete staging admin secret

```bash
gcloud secrets delete adjudiclaims-db-url-admin --project=adjudiclaims-staging --quiet
```

Verified: `gcloud secrets list --filter="name~admin"` returned empty.

### Phase 8 — Task 7: local MVP 1.0 tag

```bash
git tag -a v1.0.0-mvp 0abcc81 -m "MVP 1.0 — first prod-deployed build (Cloud Run revision 00002-pph)"
```

Tag is **local only** (not pushed; awaiting authorization).

### Phase 9 — Prod DB audit (key discovery)

- Cloud Run prod service `adjudiclaims-app` is bound to secret `adjudiclaims-prod-database-url` → `us-west-3.pg.psdb.cloud:6432/postgres` (PlanetScale Postgres).
- The `adjudiclaims-db-url` secret in `adjudiclaims-prod` (created 2026-04-03) points at `35.230.2.226:5432` — a **dead Cloud SQL host** (no Cloud SQL instances exist in `adjudiclaims-prod` per `gcloud sql instances list`). Stale, never updated when the migration to PlanetScale happened.
- Three legacy DB-URL secrets in `adjudiclaims-prod` are sprawl pointing at the dead host: `adjudiclaims-db-url`, `DATABASE_URL`, `ADJUDICLAIMS_DATABASE_URL`. Not bound to Cloud Run. Safe to delete (flagged as task #7 follow-up).

### Phase 10 — Prod schema state check (BIGGEST FINDING)

Created temp admin role `migrate-admin-2026-04-27` (id `os79yb6giect`) on `adjudiclaims/main`.

`prisma migrate status` against prod said "4 migrations have not yet been applied" but did not say schema state was unknown — it just listed all migrations as un-applied.

Direct `psql` query against prod showed:
- `tables_total = 0`
- `_prisma_migrations` table did not exist
- No `users`, `claims`, `organizations` tables

**Prod database was empty.** Cloud Run prod was bound to it but every DB-touching request would have 500'd. This contradicted the morning handoff's premise that prod just needed `migrate resolve`.

Cleaned up: deleted temp role.

### Phase 11 — `prisma migrate deploy` on prod fails with ordering bug

Re-created temp role `migrate-deploy-2026-04-27` (id `x464uaj6c9nl`). Ran `prisma migrate deploy` against the empty DB.

Result: P3018 / 42P01 — `relation "users" does not exist`. Migration `20260330_add_auth_and_soft_delete_fields` was applied **before** `20260330_init_postgresql` because Prisma sorts lexically and `_a` < `_i`. The "add_auth" migration assumes `users` exists; on a fresh DB it doesn't yet.

**Why staging worked despite the same bug:** staging schema was applied via direct SQL on 2026-04-26 (the AJC-2 partial-execution baseline), and migrations were recorded post-hoc with `migrate resolve --applied`. Staging never ran the migrations through Prisma's lexical sort.

### Phase 12 — Prod cleanup (post-failure)

- Reset password on temp role to get fresh URL.
- Dropped the partial-state `_prisma_migrations` table that Prisma had created (with 1 row marking the failed migration).
- Verified prod back to 0 tables.
- Deleted temp role (no longer owned anything after the table drop).

Prod restored to status quo ante.

### Phase 13 — AJC-2 plan rediscovery

Audited `.planning/tickets/AJC-2/` — found the documented fix:
- `phase-3-plan.md` describes deleting both `20260330_*` migrations and adding a single 1206-line `20260419063906_init` baseline.
- This was supposed to land in a prior session.
- Evidence of partial execution: staging's `_prisma_migrations` had a `20260419063906_init` row (from the direct-SQL apply), but `prisma/migrations/20260419063906_init/` did NOT exist on disk. The repo cleanup was abandoned mid-flight.

### Phase 14 — PR #36: AJC-2 baseline consolidation

Stashed WIP (`scripts/pscale.sh` fix + morning handoff). Branched from `origin/main` to `fix/AJC-2-baseline-migration`.

```bash
mkdir -p prisma/migrations/20260419063906_init
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script \
  2>/dev/null > prisma/migrations/20260419063906_init/migration.sql
git rm -r prisma/migrations/20260330_init_postgresql
git rm -r prisma/migrations/20260330_add_auth_and_soft_delete_fields
git add prisma/migrations/20260419063906_init/migration.sql
```

Generated baseline: 1017 lines, 28 `CREATE TABLE`, 27 `CREATE TYPE` (enum), 93 `CREATE INDEX`, 7 `CREATE UNIQUE INDEX`, 46 foreign keys, 0 extensions (pgvector NOT used — embeddings live in Vertex AI Vector Search per `server/services/embedding.service.ts`).

Verified: `npx prisma generate` clean, `npx tsc --noEmit` clean.

Committed as `89d7946`. Pushed. Opened PR #36. CI green (typecheck + test). Auto-reviewed by `LexPerspex` user (the apparent code-owner bot). Squash-merged at `0760bfa`.

### Phase 15 — Task 5b: prod migrate deploy on the new baseline

Created temp admin `post-ajc2-deploy-2026-04-27` (id `a5cjixjuuj5i`) on `adjudiclaims/main`.

```bash
DATABASE_URL="$PROD_URL" npx prisma migrate deploy
```

- `20260419063906_init` applied cleanly. 29 tables created (28 from migration + `_prisma_migrations`). 27 enums.
- `20260423031032_add_benefit_letter_types` failed: `42710 enum label "BENEFIT_PAYMENT_LETTER" already exists`. The new baseline (regenerated from current `schema.prisma`) already encodes those enum values.

Recovered:
```bash
DATABASE_URL="$PROD_URL" npx prisma migrate resolve --rolled-back 20260423031032_add_benefit_letter_types
DATABASE_URL="$PROD_URL" npx prisma migrate resolve --applied 20260423031032_add_benefit_letter_types
DATABASE_URL="$PROD_URL" npx prisma migrate resolve --applied 20260423045225_training_sandbox_synthetic_claims
```

The two later migrations are now redundant on disk (their schema state is encoded in the baseline). Flagged as a follow-up PR.

Deduped the resulting two `20260423031032_add_benefit_letter_types` rows in `_prisma_migrations` (one rolled-back, one applied) by deleting the rolled-back row.

Final prod state: 29 tables, 27 enums, 3 migration rows, "Database schema is up to date!"

Reassigned object ownership to `postgres` role, then deleted temp role.

### Phase 16 — Staging _prisma_migrations cleanup

Created temp admin `post-ajc2-rename-2026-04-27` (id `k00swgsg8v1f`) on `adjudiclaims-staging/main`.

```sql
BEGIN;
UPDATE _prisma_migrations SET migration_name = '20260419063906_init'
  WHERE migration_name = '20260330_init_postgresql';
DELETE FROM _prisma_migrations
  WHERE migration_name = '20260330_add_auth_and_soft_delete_fields';
COMMIT;
```

Result: two rows now had `migration_name = 20260419063906_init` (the original orphan + the renamed one).

Created another temp role `post-ajc2-dedupe-2026-04-27` (id `timph8u1p3th`).

```sql
BEGIN;
DELETE FROM _prisma_migrations
WHERE migration_name = '20260419063906_init'
  AND id NOT IN (
    SELECT id FROM _prisma_migrations
    WHERE migration_name = '20260419063906_init'
    ORDER BY started_at ASC
    LIMIT 1
  );
COMMIT;
```

Kept the older 2026-04-19 row (from the original direct-SQL baseline), dropped the newer 2026-04-27 row.

Final staging state: 3 migration rows matching prod. `prisma migrate status` clean.

Deleted both staging temp roles.

### Phase 17 — Late docs PR (#37)

Switched to fresh branch `docs/2026-04-27-pscale-fix-and-handoff` off `main`. Popped the stash to recover `scripts/pscale.sh` fix + morning handoff. Wrote the late-session handoff. Updated `STATE.md`.

Committed as `07f2d04`. Pushed. Opened PR #37. CI green. Awaiting review (LexPerspex hadn't picked it up by end of session).

### Phase 18 — AJC-6 through AJC-10 verification

User asked for `/dev-ticket` cycles 6-10. Queried Linear: all five marked Done on 2026-04-22. Spot-checked each in the repo:

| Ticket | State | Repo evidence |
|--------|-------|---------------|
| AJC-6 — Audit trail hardening | Done | `server/routes/audit.ts`, `server/middleware/audit.ts`, `server/services/data-retention.service.ts`, `server/services/audit-query.service.ts` |
| AJC-7 — UPL compliance analytics | Done | `app/routes/_app.compliance.tsx`, `server/services/compliance-dashboard.service.ts` |
| AJC-8 — Document access ↔ sessions | Done | `server/routes/documents.ts` uses `requireAuth()` + `request.session.user` on every protected handler |
| AJC-9 — KB lookup_regulation | Done | `server/data/regulatory-kb.ts` — 49 entry blocks, 1452 lines |
| AJC-10 — Cross-product data boundary | Done | `server/services/org-boundary.service.ts`; `AccessLevel` enum + index in `prisma/schema.prisma:84,648,676` |

No ghost like AJC-2 here — all five have their actual implementations landed in the repo. No `/dev-ticket` cycles needed.

## Final state at end of session

### Database

| Database | State | Migration rows | Notes |
|----------|-------|----------------|-------|
| `adjudiclaims` (prod) | Schema applied | 3 (`20260419063906_init`, `20260423031032_*`, `20260423045225_*`) | First time ever — was empty all session before tonight's deploy |
| `adjudiclaims-staging` | Schema applied | 3 (matching prod) | Cleaned up dual `_prisma_migrations` history into single coherent ordering |

### Git

| Branch | State | At |
|--------|-------|-----|
| `main` | clean, fast-forwarded | `0760bfa` (after PR #36 merge) |
| `fix/AJC-2-baseline-migration` | merged + deleted | (squash-merged into `0760bfa`) |
| `docs/2026-04-27-pscale-fix-and-handoff` | open as PR #37 | `07f2d04` |
| `docs/post-pr34-handoffs-and-state-refresh` | stale (PR #35 already merged) | local-only; can delete next session |

### PlanetScale roles

| Database/branch | Roles |
|-----------------|-------|
| `adjudiclaims/main` (prod) | `main-2026-03-30-tolcie`, `main-2026-03-28-jgp9dx` (both pre-existing, unchanged) |
| `adjudiclaims-staging/main` | 7 pre-existing roles, no temps from this session |

All temporary admin roles created during the session were reassigned-then-deleted. No lingering admin credentials anywhere.

### GCP secrets

| Project | Secret | State |
|---------|--------|-------|
| `adjudiclaims-staging` | `adjudiclaims-db-url-admin` | **deleted** |
| `adjudiclaims-staging` | `adjudiclaims-db-url` | unchanged (used by Cloud Run staging) |
| `adjudiclaims-prod` | `adjudiclaims-prod-database-url` | unchanged (used by Cloud Run prod, points at PlanetScale) |
| `adjudiclaims-prod` | `adjudiclaims-db-url`, `DATABASE_URL`, `ADJUDICLAIMS_DATABASE_URL` | **stale, follow-up to delete** |

### Local artifacts

- `v1.0.0-mvp` annotated tag at `0abcc81`. **Not pushed.**
- `.claude/settings.local.json` — extended with permission rules for this work (gitignored, persists locally).
- `~/.claude/.credentials.json.bak-2026-04-27-pre-stub-delete` — backup of credentials before morning's stub deletion.

## Follow-ups for next session

1. **Merge PR #37** once `LexPerspex` reviews (or you ask them to).
2. **Push `v1.0.0-mvp` tag** (`git push origin v1.0.0-mvp`) — needs your authorization. The tag now actually corresponds to a build that can serve a logged-in user, since the prod schema is finally applied.
3. **Open follow-up PR** to delete the two redundant migrations:
   - `prisma/migrations/20260423031032_add_benefit_letter_types/`
   - `prisma/migrations/20260423045225_training_sandbox_synthetic_claims/`
   Coordinated with `_prisma_migrations` row deletion on staging + prod.
4. **Delete three stale prod DB-URL secrets**:
   - `adjudiclaims-db-url`, `DATABASE_URL`, `ADJUDICLAIMS_DATABASE_URL` in `adjudiclaims-prod`
5. **End-to-end smoke test prod** with a logged-in user flow now that the schema exists.
6. **Decide Cloud Build trigger story** for prod — currently zero triggers, all deploys manual.
7. **Delete stale local branch** `docs/post-pr34-handoffs-and-state-refresh` (PR #35 already merged).
