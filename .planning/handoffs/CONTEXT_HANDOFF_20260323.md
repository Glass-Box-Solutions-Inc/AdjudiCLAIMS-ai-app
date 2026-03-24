# Context Handoff — AdjudiCLAIMS Full Build

**Task:** Implement PLAN-ADJUDICLAIMS-FULL-BUILD.md (11 phases, full PRD)
**Timestamp:** 2026-03-23
**Handoff Reason:** Context approaching 50% on 1M window
**Previous Agent:** Main session (Opus 4.6, 1M context)
**Next Agent:** Fresh session — continue from Phase 2

---

## Task Overview

Building AdjudiCLAIMS — an AI-powered CA Workers' Comp claims management tool for claims examiners. Full PRD implementation with UPL (Unauthorized Practice of Law) compliance as the hard constraint.

**Plan file:** `.planning/PLAN-ADJUDICLAIMS-FULL-BUILD.md`
**PRD:** `docs/product/PRD_ADJUDICLAIMS.md`
**All 21 design docs:** `docs/` directory (product, foundations, standards, reference)

---

## Completed Work

### Phase 0 — Infrastructure & Dev Environment (COMPLETE)
- docker-compose.yml: PostgreSQL 16 + pgvector on port 5442
- env.d.ts: Vite/RR7 ambient types
- vitest.config.integration.ts + vitest.config.upl.ts: test configs
- prisma/seed.ts: 1 org, 3 users, 3 claims, 3 deadlines, 10 investigation items
- prisma/migrations/20260323192354_init/: Initial migration applied
- package.json: Added zod, zustand, @tanstack/react-query, react-hook-form, @hookform/resolvers, @fastify/rate-limit, better-auth, @types/node, @vitest/coverage-v8, typescript-eslint, eslint plugins
- tsconfig.json: Added tests/ and prisma/ to includes
- eslint.config.js: Fixed allowDefaultProject, TypeScript strict
- Fixed type errors in audit.ts (use Prisma enums), rbac.ts (session access), upl-classifier (sync stub)
- All checks passing: typecheck 0 errors, lint 0 errors, build succeeds

**NOT completed in Phase 0:**
- 0.4.1: `@adjudica/document-classifier` package doesn't exist yet in adjudica-ai-app (package hasn't been created by Adjudica devs yet — tracked as dependency)
- 0.8: cloudbuild.yaml CI/CD pipeline (deferred — GCP projects may not be provisioned yet)
- 0.9: Cloud Monitoring dashboards (requires GCP projects)

### Phase 1 — RBAC & Auth (COMPLETE)
- server/routes/auth.ts: login (email-based dev auth), logout, session endpoints
- server/routes/organizations.ts: get org, list members (role-gated)
- server/routes/claims.ts: FULLY IMPLEMENTED — list (role-scoped pagination), get (authz check), create (Zod validation, auto-generates deadlines + investigation items)
- server/services/deadline-generator.ts: 4 deadline types (15-day ack, 40-day determination, 14-day TD, 15-day employer notify)
- server/services/investigation-generator.ts: 10 checklist item types
- server/index.ts: All routes registered
- Tests: 20/20 passing (auth: 7, claims: 11, health: 2)

---

## Pending Work (Priority Order)

### Phase 2 — Document Pipeline (NEXT — highest value, high reuse)
**Key decision:** Document classification uses `@adjudica/document-classifier` shared package (Option A). Package doesn't exist yet — either wait for Adjudica devs or stub the classification step.

Tasks:
1. Document upload endpoint + GCS storage
2. OCR processing service (Google Document AI)
3. Document classification integration (shared package or stub)
4. Claim data extraction (field extraction service)
5. Document chunking + embedding (pgvector, 768-dim)
6. Timeline/chronology generation
7. Tests for entire pipeline

### Phase 3 — Core Claims Services
- Benefit calculator (TD rate, PD, death benefit — LC 4653 formulas)
- Regulatory deadline dashboard (urgency classification)
- Investigation checklist UI updates

### Phase 4 — UPL Compliance Engine (CRITICAL — submit to legal review)
- Query classifier (GREEN/YELLOW/RED)
- Output validator (prohibited language regex + LLM validation)
- Disclaimer injection
- Adversarial prompt detection
- 400+ test cases required

### Phase 5-8 — Chat, Education, Compliance, Data Boundaries
### Phase 9 — MVP Launch Gate (all 12 UPL acceptance criteria)
### Phase 10-11 — Tier 2 & 3 Features

---

## Critical Context

### Key Decisions Made
1. **Shared classifier:** `@adjudica/document-classifier` from `adjudica-ai-app/packages/document-classifier/` (Option A, file: dependency). Shares Adjudica's taxonomy for now. Memory saved at `memory/project_shared_classifier.md`
2. **Test data:** Real WC claim file (Salerno, Claim 06349136) in `~/Downloads/Salerno/` for Phase 2 testing. Memory at `memory/reference_salerno_test_data.md`
3. **Auth approach:** Session-based with @fastify/session (not BetterAuth yet). Email-only login for dev.
4. **UPL is the hard constraint:** Every AI output must be GREEN/YELLOW/RED classified. RED = blocked + attorney referral. Legal counsel sign-off required before launch.

### Architecture Patterns
- Fastify plugin pattern: one async plugin per domain, registered via `server.register()`
- Prisma singleton with HMR protection (`globalThis` pattern in `server/db.ts`)
- Zod validation on all API inputs (CreateClaimBodySchema, etc.)
- Role-scoped queries: examiner sees assigned only, supervisor/admin sees all org
- Audit logging: append-only, never log PHI, use `logAuditEvent()` helper
- Tests use `server.inject()` with mocked Prisma (vi.mock pattern)

### Files Modified (All)
```
CREATED:
  .planning/PLAN-ADJUDICLAIMS-FULL-BUILD.md
  docker-compose.yml
  env.d.ts
  vitest.config.integration.ts
  vitest.config.upl.ts
  prisma/seed.ts
  prisma/migrations/20260323192354_init/migration.sql
  server/routes/auth.ts
  server/routes/organizations.ts
  server/services/deadline-generator.ts
  server/services/investigation-generator.ts
  tests/unit/auth.test.ts
  tests/unit/claims.test.ts
  .planning/handoffs/CONTEXT_HANDOFF_20260323.md

MODIFIED:
  package.json (dependencies, prisma.seed config)
  tsconfig.json (added tests/, prisma/ to includes)
  eslint.config.js (allowDefaultProject, suppress deprecated)
  server/index.ts (registered auth + org routes)
  server/routes/claims.ts (replaced stubs with full implementation)
  server/middleware/audit.ts (use Prisma enums, fix JSON type)
  server/middleware/rbac.ts (fix session access)
  server/services/upl-classifier.service.ts (sync stub)
  tests/unit/health.test.ts (fix unnecessary type assertions)
```

---

## Next Steps (First 10 Minutes of Fresh Session)

1. Read this handoff file
2. Read `.planning/PLAN-ADJUDICLAIMS-FULL-BUILD.md` Phase 2 section
3. Run `npm run test && npm run typecheck && npm run lint` to confirm baseline
4. Assess whether `@adjudica/document-classifier` package exists yet
5. Begin Phase 2.1 (document upload endpoint) — this can proceed independently of the shared classifier

---

## Test Status

| Suite | Count | Status |
|-------|-------|--------|
| tests/unit/health.test.ts | 2 | PASS |
| tests/unit/auth.test.ts | 7 | PASS |
| tests/unit/claims.test.ts | 11 | PASS |
| **Total** | **20** | **100% PASS** |

TypeScript: 0 errors
ESLint: 0 errors
Build: Succeeds

---

## Database Status

- PostgreSQL 16 + pgvector running via docker-compose on port 5442
- Migration `20260323192354_init` applied (17 models, 11 enums)
- Seed data: 1 org (Pacific Coast Insurance), 3 users, 3 claims, 3 deadlines, 10 investigation items
- To restart: `docker compose up -d` then `npx prisma migrate deploy`
