# Context Handoff — AdjudiCLAIMS Phase 4.5 (Production Hardening)

**Task:** Implement Phase 4.5 production hardening, then continue to Phase 5+
**Timestamp:** 2026-03-24
**Handoff Reason:** Context at ~60%, user requested handoff
**Previous Agent:** Opus 4.6 (1M context) — committed Phases 0-4, planned Phase 4.5
**Next Agent:** Fresh session — execute Phase 4.5 hardening plan, then Phase 5+

---

## Current State

**1,001 tests passing | 0 type errors | 0 lint errors | 4 commits ahead of origin (not pushed)**

```
a1de874 feat: Phase 4 — UPL compliance engine (classifier, validator, disclaimers)
205216f feat: Phase 3 — core claims services (benefit calc, deadlines, investigation)
b3aa007 feat: Phase 2 — document pipeline (upload, OCR, classify, extract, embed)
7381b85 feat: Phase 0-1 — infrastructure, auth, RBAC & claims implementation
c1b17d4 feat: Phase 0 application scaffold — RR7 + Fastify + Prisma + RBAC
f5459a8 docs: bootstrap AdjudiCLAIMS design documentation from docs hub
```

---

## Why Phase 4.5 Exists

A thorough comparison of AdjudiCLAIMS against the production Adjudica app (`~/adjudica-ai-app/`) revealed that Phases 0-4 are **scaffold-quality, not production-quality**. The Adjudica app has 7-layer error handling, SOC 2 session management, Temporal background processing, LLM abstraction with fallback chains, DB retry with backoff, PgBouncer connection pooling, Langfuse/Sentry/OTEL observability, and environment validation. AdjudiCLAIMS has none of these.

Building Phase 5 (Chat — concurrent LLM calls, RAG queries, streaming) on the current scaffold would produce something that works in dev but fails in production.

**The approved plan is at:** `.planning/plans/streamed-napping-pearl.md` (also copied in full below)

---

## Approved Plan: Phase 4.5 Production Hardening (10 Work Items)

### Execution Order (4 waves)

```
Wave A (foundations, parallel):  WI-2 Error Classes  |  WI-8 Env Validation  |  WI-5a LLM types/interfaces
Wave B (infra, parallel):        WI-6 Rate Limit  |  WI-7 Shutdown  |  WI-9 CORS  |  WI-5b LLM adapters
Wave C (fixes, parallel):        WI-1 Bug Fixes + Migration  |  WI-3 Claim Middleware  |  WI-4 Transactions
Wave D (migration, parallel):    WI-5c Service Migration  |  WI-10 DB Pagination
```

### WI-1: Fix 4 Critical Bugs

1. **Audit: document delete** — `server/routes/documents.ts:336` logs `DOCUMENT_UPLOADED` for deletes. Add `DOCUMENT_DELETED` to Prisma AuditEventType enum and use it.
2. **Audit: deadline waived** — `server/routes/deadlines.ts:239` both ternary branches return `DEADLINE_MET`. Fix: `status === 'MET' ? 'DEADLINE_MET' : 'DEADLINE_WAIVED'`. Add `DEADLINE_WAIVED` to enum.
3. **Session destroy race** — `server/routes/auth.ts:105-112` sends response before `session.destroy()` completes. Promisify and await.
4. **Path traversal** — `server/services/storage.service.ts` uses raw upload filename. Sanitize with `path.basename()`, reject `..` patterns.

Combined Prisma migration with WI-4.

### WI-2: Global Error Handler + Custom Error Classes

**Create:** `server/lib/errors.ts`
```
AppError (base: statusCode, code, isOperational)
  ├── ValidationError (400)
  ├── UnauthorizedError (401)
  ├── ForbiddenError (403)
  ├── NotFoundError (404)
  ├── ConflictError (409)
  └── ExternalServiceError (503)
```

**Create:** `server/lib/error-handler.ts` — `server.setErrorHandler()`:
- Map AppError → HTTP status, ZodError → 400, Prisma P2002 → 409, P2025 → 404
- Consistent envelope: `{ error, code, details? }`
- Strip stack traces in production

**Reference:** `~/adjudica-ai-app/server/lib/errorHandler.ts` and `~/adjudica-ai-app/shared/utils/response.ts`

### WI-3: Claim Access Middleware

**Create:** `server/middleware/claim-access.ts` — `requireClaimAccess()` preHandler:
- Extract `:claimId`, verify org ownership, verify examiner assignment, attach `request.claim`

**Remove** duplicated `verifyClaimAccess()` from `documents.ts`, `deadlines.ts`, `investigation.ts`

### WI-4: Transaction Safety + Unique Constraints

- `server/routes/claims.ts:263-301` — wrap claim+deadlines+investigation in `prisma.$transaction()`
- `deadline-generator.ts` + `investigation-generator.ts` — accept `TransactionClient` type
- Schema: `@@unique([claimId, deadlineType])` on RegulatoryDeadline, `@@unique([claimId, itemType])` on InvestigationItem

### WI-5: LLM Abstraction Layer (CRITICAL — User Requirements)

**User directive:** Default to Gemini, Claude as option. Model selection is a billing feature.

| Tier | Model | Default? | Upcharge |
|------|-------|----------|----------|
| **Free** | Gemini 3.1 Flash Lite | YES | $0 |
| **Standard** | Gemini 3.1 Flash | No | $ |
| **Premium** | Gemini 3.1 Pro | No | $$ |
| **Premium+** | Claude Sonnet | No | $$$ |
| **Enterprise** | Claude Opus | No | $$$$ |

**Create under `server/lib/llm/`:**
- `types.ts` — `LLMProvider`, `ModelTier`, `ModelConfig`, `MODEL_REGISTRY`, `LLMRequest`, `LLMResponse`
- `adapter.ts` — `ILLMAdapter` interface: `generate()`, `generateStructured()`, `classify()`
- `gemini-adapter.ts` — Vertex AI impl (Flash Lite, Flash, Pro)
- `claude-adapter.ts` — Anthropic impl (Sonnet, Opus)
- `factory.ts` — `getLLMAdapter(tier?)` defaults to FREE, singleton per provider, graceful fallback
- `retry.ts` — `executeWithRetry()` with exponential backoff + jitter, error classification
- `index.ts` — barrel

**Migrate services:** Replace `new Anthropic()` in `upl-classifier.service.ts`, `upl-validator.service.ts`, `field-extraction.service.ts` with `getLLMAdapter()`

**Usage tracking:** `LLMResponse` includes `{ provider, model, usage: { inputTokens, outputTokens } }` for billing via audit events.

**Reference:** `~/adjudica-ai-app/packages/llm/` for adapter pattern, `~/adjudica-ai-app/server/lib/errors/classifier.ts` for retry classification

### WI-6: Rate Limiting

Register `@fastify/rate-limit` (already in package.json):
- Global: 100 req/15min
- `/api/auth/login`: 10 req/min
- `/api/upl/classify`, `/api/upl/validate`: 30 req/min

### WI-7: Graceful Shutdown

SIGTERM/SIGINT → `server.close()` → `prisma.$disconnect()` → exit. Double-shutdown guard. uncaughtException/unhandledRejection handlers.

### WI-8: Environment Validation

**Create:** `server/lib/env.ts` — Zod schema:
- `DATABASE_URL`: required, must start with `postgresql://`
- `SESSION_SECRET`: required in production (min 32 chars), default in dev/test
- `NODE_ENV`: enum
- `VERTEX_AI_PROJECT`, `ANTHROPIC_API_KEY`: optional
- Fail fast on startup

Remove hardcoded session secret fallback from `server/index.ts`.

### WI-9: CORS Lockdown

- `origin`: env-specific allowlist (not `true`)
- Session cookie: explicit `sameSite: 'lax'`

### WI-10: Database-Level Deadline Pagination

Refactor `deadline-engine.service.ts`: new `getAllUserDeadlinesPaginated()` using DB-level `where` + `orderBy` + `take`/`skip` instead of loading all into memory.

### Single Prisma Migration (WI-1 + WI-4)

```sql
ALTER TYPE audit_event_type ADD VALUE 'DOCUMENT_DELETED';
ALTER TYPE audit_event_type ADD VALUE 'DEADLINE_WAIVED';
CREATE UNIQUE INDEX "regulatory_deadlines_claim_id_deadline_type_key"
  ON "regulatory_deadlines"("claim_id", "deadline_type");
CREATE UNIQUE INDEX "investigation_items_claim_id_item_type_key"
  ON "investigation_items"("claim_id", "item_type");
```

---

## Files Summary

**New files (~16):**
- `server/lib/errors.ts`
- `server/lib/error-handler.ts`
- `server/lib/env.ts`
- `server/lib/llm/types.ts`
- `server/lib/llm/adapter.ts`
- `server/lib/llm/gemini-adapter.ts`
- `server/lib/llm/claude-adapter.ts`
- `server/lib/llm/factory.ts`
- `server/lib/llm/retry.ts`
- `server/lib/llm/index.ts`
- `server/middleware/claim-access.ts`
- `prisma/migrations/YYYYMMDD_hardening/migration.sql`
- `tests/unit/error-handler.test.ts`
- `tests/unit/claim-access.test.ts`
- `tests/unit/llm-adapter.test.ts`
- `tests/unit/llm-retry.test.ts`

**Modified files (~15):**
- `server/index.ts` (WI-2, WI-6, WI-7, WI-8, WI-9)
- `server/routes/auth.ts` (WI-1, WI-6)
- `server/routes/documents.ts` (WI-1, WI-3)
- `server/routes/deadlines.ts` (WI-1, WI-3, WI-10)
- `server/routes/investigation.ts` (WI-3)
- `server/routes/claims.ts` (WI-4)
- `server/routes/upl.ts` (WI-6)
- `server/services/upl-classifier.service.ts` (WI-5)
- `server/services/upl-validator.service.ts` (WI-5)
- `server/services/field-extraction.service.ts` (WI-5)
- `server/services/storage.service.ts` (WI-1)
- `server/services/deadline-engine.service.ts` (WI-10)
- `server/services/deadline-generator.ts` (WI-4)
- `server/services/investigation-generator.ts` (WI-4)
- `prisma/schema.prisma` (WI-1, WI-4)

---

## After Phase 4.5 → Continue to Phase 5

The Phase 5 handoff is already written at `.planning/handoffs/CONTEXT_HANDOFF_20260324_PHASE5.md`. After Phase 4.5 is committed, proceed to Phase 5 (Claims Chat System) using that handoff.

Key Phase 5 deliverables:
- `server/prompts/adjudiclaims-chat.prompts.ts` — verbatim from `docs/product/ADJUDICLAIMS_CHAT_SYSTEM_PROMPTS.md`
- `server/services/examiner-chat.service.ts` — 3-stage UPL pipeline (classify → RAG + generate → validate)
- `server/services/counsel-referral.service.ts` — factual summary for defense counsel
- `server/routes/chat.ts` — chat endpoints
- Tests

**Important:** Adjudica services at `~/adjudica-ai-app/server/services/chat/` are **REFERENCE ONLY** — read for architecture patterns. AdjudiCLAIMS has NO runtime dependencies on adjudica-ai-app. All code built fresh.

---

## Reference: Adjudica Patterns to Study

| Pattern | Adjudica File | Purpose |
|---------|--------------|---------|
| Error handler | `~/adjudica-ai-app/server/lib/errorHandler.ts` | Global error handler with Sentry + PII redaction |
| Error classes | `~/adjudica-ai-app/shared/utils/response.ts` | `AppError` hierarchy + `withRouteHandler` |
| DB retry | `~/adjudica-ai-app/server/lib/db-retry.ts` | Exponential backoff + jitter for Prisma |
| Middleware factory | `~/adjudica-ai-app/server/utils/middleware.ts` | `createMiddleware<T>` with typed request augmentation |
| Env validation | `~/adjudica-ai-app/server/lib/env.ts` | Zod-validated 40+ env vars |
| LLM abstraction | `~/adjudica-ai-app/packages/llm/` | Adapter pattern, fallback chains, retry |
| Error classification | `~/adjudica-ai-app/server/lib/errors/classifier.ts` | RATE_LIMIT/UNAVAILABLE/AUTH categories |
| Graceful shutdown | `~/adjudica-ai-app/server/index.ts` | SIGTERM + double-shutdown guard |
| Chat orchestrator | `~/adjudica-ai-app/server/services/chat/case-chat.service.ts` | RAG + tool calling + citation tracking |
| Session management | `~/adjudica-ai-app/server/utils/session-validator.ts` | SOC 2 compliant timeouts |

---

## Architecture Patterns in This Codebase

- **Fastify plugin pattern:** `async function xxxRoutes(server: FastifyInstance)`
- **Prisma singleton:** `import { prisma } from '../db.js'` with HMR protection
- **Zod validation:** on all API inputs
- **Role-scoped queries:** examiner sees assigned only, supervisor/admin sees all org
- **Audit logging:** `logAuditEvent()` — never log PHI, use IDs
- **Tests:** `server.inject()` with mocked Prisma (`vi.mock('../../server/db.js', ...)`)
- **API key fallback:** all LLM services return stubs when no API key set

---

## Key Decisions Already Made

1. **UPL is the hard constraint** — every AI output classified GREEN/YELLOW/RED
2. **LLM default: Gemini 3.1 Flash Lite** — cheapest, included free. Claude Sonnet/Opus are paid upcharge tiers
3. **Model selection is a billing feature** — more expensive model = higher monthly upcharge
4. **Conservative UPL defaults** — RED on uncertainty, YELLOW on no match
5. **No dependencies on adjudica-ai-app** — reference only, all code built fresh
6. **Session-based auth** with `@fastify/session` (not BetterAuth yet)

---

## Database Status

- PostgreSQL 16 + pgvector running via docker-compose on port 5442
- Migration `20260323192354_init` applied (17 models, 11 enums)
- Seed data: 1 org (Pacific Coast Insurance), 3 users, 3 claims
- To restart: `docker compose up -d` then `npx prisma migrate deploy`

---

## First 10 Minutes of Fresh Session

1. Read this handoff file
2. Read the approved plan at `.planning/plans/streamed-napping-pearl.md` (or use the copy above)
3. Run `npm run test && npm run typecheck && npm run lint` to confirm baseline
4. Start Wave A in parallel: WI-2 (error classes) + WI-8 (env validation) + WI-5a (LLM types)
5. Then Wave B: WI-6 (rate limit) + WI-7 (shutdown) + WI-9 (CORS) + WI-5b (adapters)
6. Then Wave C: WI-1 (bugs) + WI-3 (claim middleware) + WI-4 (transactions) + migration
7. Then Wave D: WI-5c (service migration) + WI-10 (pagination)
8. Commit as Phase 4.5
9. Continue to Phase 5 using `.planning/handoffs/CONTEXT_HANDOFF_20260324_PHASE5.md`
