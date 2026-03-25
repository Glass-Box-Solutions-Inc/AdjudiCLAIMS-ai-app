# Context Handoff — AdjudiCLAIMS Phase 5 (Claims Chat System)

**Task:** Implement Phase 5 of PLAN-ADJUDICLAIMS-FULL-BUILD.md, then continue through remaining phases
**Timestamp:** 2026-03-24
**Handoff Reason:** User-requested handoff for fresh context
**Previous Agent:** Opus 4.6 (1M context) — committed Phases 0-4
**Next Agent:** Fresh session — implement Phase 5, then continue

---

## Task Overview

Building AdjudiCLAIMS — an AI-powered CA Workers' Comp claims management tool for claims examiners. Phase 5 adds the chat system integrating the UPL compliance pipeline (Phase 4) with RAG-powered Q&A.

**Plan file:** `.planning/PLAN-ADJUDICLAIMS-FULL-BUILD.md`
**PRD:** `docs/product/PRD_ADJUDICLAIMS.md`
**Chat prompts spec:** `docs/product/ADJUDICLAIMS_CHAT_SYSTEM_PROMPTS.md`

---

## Completed Work (Phases 0-4)

### Phase 0-1: Infrastructure + Auth + RBAC + Claims (`7381b85`)
- Docker Compose (PostgreSQL 16 + pgvector, port 5442)
- Prisma schema: 17 models, 11 enums. Migration `20260323192354_init` applied
- Seed data: 1 org (Pacific Coast Insurance), 3 users, 3 claims
- Session-based auth (login/logout/session routes)
- Organization routes (get org, list members)
- Claims routes: list (role-scoped), get (authz), create (auto-generates deadlines + investigation items)
- Deadline generator (4 types), investigation generator (10 types)
- ESLint/TypeScript/Vitest configs fixed

### Phase 2: Document Pipeline (`b3aa007`)
- GCS storage service, Google Document AI OCR service
- Document classifier (stub for shared `@adjudica/document-classifier`)
- Field extraction service, embedding service (Vertex AI, 768-dim pgvector)
- Document pipeline orchestrator (OCR → classify → extract → embed → timeline)
- Timeline/chronology generation service
- Document routes (upload, list, get, delete)

### Phase 3: Core Claims Services (`205216f`)
- Benefit calculator: TD rate (LC 4653), payment schedules (LC 4650), late penalties (LC 4650(c)), death benefits (LC 4700-4706)
- Deadline engine: urgency classification, overdue detection, dashboard routes
- Investigation checklist: completeness scoring, category tracking, routes

### Phase 4: UPL Compliance Engine (`a1de874`)
- **Query classifier** (`server/services/upl-classifier.service.ts`):
  - Stage 1: Regex pre-filter — 9 RED patterns, 7 GREEN patterns, 7 adversarial patterns
  - Stage 2: LLM classification via Claude Haiku (fallback when no regex match)
  - `classifyQuery()` (async, full pipeline), `classifyQuerySync()` (sync, keyword-only)
  - Conservative default: unmatched → YELLOW (keyword-only) or RED (LLM fallback)
- **Output validator** (`server/services/upl-validator.service.ts`):
  - 11 prohibited language regex patterns (CRITICAL severity)
  - `validateOutput()` (sync regex), `validateOutputFull()` (async, includes LLM)
- **Disclaimer service** (`server/services/disclaimer.service.ts`):
  - `getDisclaimer(zone, featureContext?, redTrigger?)`
  - 5 feature-specific YELLOW variants, 6 trigger-specific RED referral messages
  - `PRODUCT_DISCLAIMER` constant
- **UPL routes** (`server/routes/upl.ts`):
  - `POST /api/upl/classify` — classify query, returns zone + disclaimer
  - `POST /api/upl/validate` — validate output, returns PASS/FAIL + violations
- **849 UPL tests** across 4 test files: classifier (449), validator (303), disclaimer (67), routes (30)
- All services work without ANTHROPIC_API_KEY (regex/keyword-only mode for tests)

---

## Test Status

| Suite | File | Tests |
|-------|------|-------|
| Health | tests/unit/health.test.ts | 2 |
| Auth | tests/unit/auth.test.ts | 7 |
| Claims | tests/unit/claims.test.ts | 11 |
| Documents | tests/unit/documents.test.ts | 12 |
| Doc Pipeline | tests/unit/document-pipeline.test.ts | 27 |
| Calculator | tests/unit/calculator.test.ts | 43 |
| Deadlines | tests/unit/deadlines.test.ts | 21 |
| Investigation | tests/unit/investigation.test.ts | 29 |
| UPL Classifier | tests/unit/upl-classifier.test.ts | 449 |
| UPL Validator | tests/unit/upl-validator.test.ts | 303 |
| UPL Disclaimer | tests/unit/upl-disclaimer.test.ts | 67 |
| UPL Routes | tests/unit/upl-routes.test.ts | 30 |
| **Total** | **12 files** | **1,001 (100% PASS)** |

TypeScript: 0 errors | ESLint: 0 errors | Build: Succeeds

---

## Phase 5 — What to Build

### 5.1 — System Prompts File

**Create:** `server/prompts/adjudiclaims-chat.prompts.ts`

Three verbatim prompts from `docs/product/ADJUDICLAIMS_CHAT_SYSTEM_PROMPTS.md`:
- `EXAMINER_CASE_CHAT_PROMPT` (§1) — main chat system prompt
- `EXAMINER_DRAFT_CHAT_PROMPT` (§2) — document editing assistant prompt
- `COUNSEL_REFERRAL_PROMPT` (§5) — factual summary generator prompt

### 5.2 — Examiner Chat Service

**Create:** `server/services/examiner-chat.service.ts`

Three-stage UPL pipeline per request:
1. **Pre-chat:** `classifyQuery(message)` → zone determination
2. **Chat:** RAG retrieval → Claude API response with examiner system prompt
3. **Post-chat:** `validateOutput(response)` → prohibited language check

Zone-based flow:
- **GREEN:** Generate → validate → add GREEN disclaimer → deliver
- **YELLOW:** Generate → validate → add YELLOW disclaimer → deliver
- **RED:** Block immediately → deliver attorney referral message → offer counsel referral

Key interfaces:
```typescript
interface ChatRequest {
  claimId: string;
  sessionId?: string;
  message: string;
  userId: string;
  orgId: string;
}

interface ChatResponse {
  sessionId: string;
  messageId: string;
  content: string;
  classification: UplClassification;
  disclaimer: DisclaimerResult;
  validation: ValidationResult;
  wasBlocked: boolean;
  citations: Citation[];
}
```

RAG retrieval must filter out restricted documents:
- `accessLevel != 'ATTORNEY_ONLY'`
- `containsLegalAnalysis == false`
- `containsWorkProduct == false`
- `containsPrivileged == false`

### 5.3 — Counsel Referral Service

**Create:** `server/services/counsel-referral.service.ts`

Generates factual claim summaries for defense counsel (triggered from RED zone).
6 sections: Claim Overview, Medical Evidence, Benefits Status, Claim Timeline, Legal Issue Identified, Documents Available.
Must pass UPL output validation — no legal analysis allowed in summary.

### 5.4 — Chat Routes

**Create:** `server/routes/chat.ts`

Endpoints:
- `POST /api/claims/:claimId/chat` — send message (calls examiner-chat service)
- `GET /api/claims/:claimId/chat/sessions` — list sessions (role-scoped)
- `GET /api/chat/sessions/:sessionId/messages` — get messages (paginated)
- `POST /api/claims/:claimId/counsel-referral` — generate counsel referral

**Update:** `server/index.ts` — register chatRoutes

### 5.5 — Tests

Phase 5 testing gate (from plan):
- Examiner system prompt injected for CLAIMS_EXAMINER role
- RAG retrieval excludes attorney work product and privileged docs
- Chat response includes source citations
- GREEN/YELLOW/RED zone responses have correct disclaimers
- RED zone produces attorney referral (not a response)
- Counsel referral summary contains all 6 sections + no prohibited language
- Draft chat blocks legal document generation
- Chat sessions isolated between orgs
- All chat interactions audit-logged

---

## Existing Infrastructure to Use

### Prisma Models (already in schema, migration applied)

```prisma
model ChatSession {
  id        String   @id @default(cuid())
  claimId   String
  userId    String
  createdAt DateTime @default(now())
  claim     Claim         @relation(...)
  user      User          @relation(...)
  messages  ChatMessage[]
}

model ChatMessage {
  id                String    @id @default(cuid())
  sessionId         String
  role              ChatRole  // USER | ASSISTANT | SYSTEM
  content           String
  uplZone           UplZone?  // GREEN | YELLOW | RED
  wasBlocked        Boolean   @default(false)
  disclaimerApplied Boolean   @default(false)
  createdAt         DateTime  @default(now())
  session           ChatSession @relation(...)
}
```

### Embedding Service (already implemented)

```typescript
// server/services/embedding.service.ts
similaritySearch(query: string, claimId: string, topK?: number): Promise<SearchResult[]>
// Returns: { chunkId, documentId, content, similarity }
```

### Document Access Control Fields (in Document model)

```prisma
accessLevel           AccessLevel @default(EXAMINER_ONLY)  // SHARED | ATTORNEY_ONLY | EXAMINER_ONLY
containsLegalAnalysis Boolean     @default(false)
containsWorkProduct   Boolean     @default(false)
containsPrivileged    Boolean     @default(false)
```

### Audit Event Types Available

```
CHAT_MESSAGE_SENT, CHAT_RESPONSE_GENERATED, COUNSEL_REFERRAL_GENERATED
UPL_ZONE_CLASSIFICATION, UPL_OUTPUT_BLOCKED, UPL_DISCLAIMER_INJECTED
```

### Anthropic SDK

`@anthropic-ai/sdk` is in package.json. Pattern:
```typescript
import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env
```

All services must work without API key (stub/template mode for testing).

---

## Reference Only: Adjudica Chat Services (DO NOT IMPORT — ARCHITECTURE REFERENCE ONLY)

The parent Adjudica attorney product has chat services at `~/adjudica-ai-app/server/services/chat/` that can be **read for architecture patterns only**. AdjudiCLAIMS has **NO dependencies on adjudica-ai-app**. All code must be built fresh in this repo.

```
~/adjudica-ai-app/server/services/chat/
  case-chat.service.ts       (764 lines — main chat orchestrator — READ for patterns)
  chat-rag.service.ts        (37 lines — RAG retrieval wrapper)
  chat-session.service.ts    (243 lines — session CRUD)
  case-chat.prompts.ts       (50 lines — attorney system prompts)
  citation-builder.service.ts
  draft-chat.service.ts
  source-compliance.service.ts
```

AdjudiCLAIMS is a standalone product. It shares NO runtime code with Adjudica. The only conceptual overlap is:
- Similar RAG architecture (vector search → context injection → LLM response)
- Similar session management patterns

AdjudiCLAIMS adds these unique requirements NOT in Adjudica:
- UPL pre/post processing pipeline (classify → generate → validate → disclaim)
- RAG filtering for attorney-only/privileged documents
- Counsel referral generator
- Different system prompts (examiner, not attorney)
- Zone badges and disclaimer injection on every output

---

## Architecture Patterns

- **Fastify plugin pattern:** one `async function xxxRoutes(server: FastifyInstance)` per domain
- **Prisma singleton:** `import { prisma } from '../db.js'` with HMR protection
- **Zod validation:** on all API inputs
- **Role-scoped queries:** examiner sees assigned only, supervisor/admin sees all org
- **Audit logging:** `logAuditEvent()` — never log PHI, use IDs
- **Tests:** `server.inject()` with mocked Prisma (`vi.mock('../../server/db.js', ...)`)
- **API key fallback:** all LLM-calling services return stubs when `ANTHROPIC_API_KEY` not set

---

## Key Decisions Already Made

1. **UPL is the hard constraint** — every AI output must be classified and validated
2. **Conservative defaults** — RED on uncertainty, YELLOW on no match
3. **Three enforcement layers** — pre-chat classifier, system prompt, post-chat validator
4. **Session-based auth** with `@fastify/session` (not BetterAuth yet)
5. **Shared classifier** package from adjudica-ai-app doesn't exist yet — using stubs

---

## First 10 Minutes of Fresh Session

1. Read this handoff file
2. Read `.planning/PLAN-ADJUDICLAIMS-FULL-BUILD.md` Phase 5 section
3. Read `docs/product/ADJUDICLAIMS_CHAT_SYSTEM_PROMPTS.md` for verbatim prompts
4. Reference `~/adjudica-ai-app/server/services/chat/case-chat.service.ts` for patterns
5. Run `npm run test && npm run typecheck && npm run lint` to confirm baseline
6. Begin with `server/prompts/adjudiclaims-chat.prompts.ts` (no dependencies)
7. Then `server/services/examiner-chat.service.ts` + `counsel-referral.service.ts`
8. Then `server/routes/chat.ts` + update `server/index.ts`
9. Then tests

---

## Files in This Repo

```
MODIFIED (committed through Phase 4):
  eslint.config.js
  package.json / package-lock.json
  tsconfig.json
  server/index.ts (health, auth, claims, org, documents, investigation, deadlines, calculator, upl routes registered)
  server/middleware/audit.ts (Prisma enums)
  server/middleware/rbac.ts (session access)
  server/routes/claims.ts (full implementation)
  server/routes/health.ts
  server/services/benefit-calculator.service.ts (full rewrite)
  server/services/upl-classifier.service.ts (full implementation)

CREATED (committed through Phase 4):
  .planning/PLAN-ADJUDICLAIMS-FULL-BUILD.md
  .planning/handoffs/CONTEXT_HANDOFF_20260323.md
  docker-compose.yml
  env.d.ts
  vitest.config.integration.ts / vitest.config.upl.ts
  prisma/seed.ts / prisma/migrations/20260323192354_init/
  server/routes/auth.ts, calculator.ts, deadlines.ts, documents.ts, investigation.ts, organizations.ts, upl.ts
  server/services/deadline-engine.service.ts, deadline-generator.ts, disclaimer.service.ts
  server/services/document-classifier.service.ts, document-pipeline.service.ts, embedding.service.ts
  server/services/field-extraction.service.ts, investigation-checklist.service.ts, investigation-generator.ts
  server/services/ocr.service.ts, storage.service.ts, timeline.service.ts, upl-validator.service.ts
  tests/unit/*.test.ts (12 files), tests/integration/document-pipeline.e2e.test.ts
  uploads/org_pacific_coast/...

TO CREATE (Phase 5):
  server/prompts/adjudiclaims-chat.prompts.ts
  server/services/examiner-chat.service.ts
  server/services/counsel-referral.service.ts
  server/routes/chat.ts
  tests/unit/chat.test.ts (or split into multiple)
```

---

## Remaining Phases After Phase 5

| Phase | Name | Depends On | Key Deliverables |
|-------|------|------------|-----------------|
| **6** | Education & Training | Phase 5 | Tier 1 dismissable terms (~85), Tier 2 always-present panels, 4 training modules with assessments, 5 MVP decision workflows, new examiner mode |
| **7** | Compliance Dashboard & Audit | Phases 3,4,5 | Immutable audit trail, compliance dashboards (examiner/supervisor/admin), UPL monitoring dashboard with alerting |
| **8** | Data Boundaries & KB Access | Phases 5,7 | Document access filtering (ATTORNEY_ONLY exclusion), KB query filtering by role, cross-product data rules |
| **9** | MVP Integration Testing & UPL Acceptance | ALL 0-8 | E2E tests (Playwright), full UPL acceptance suite (12 criteria), security audit, performance testing, production deployment |
| **10** | Tier 2 Features | Phase 9 | MTUS guideline matching, comparable claims, compliance reporting, benefit letters, employer notifications, training sandbox, 15 additional workflows |
| **11** | Tier 3 Features | Phase 10 | CMS integration (Guidewire/Duck Creek/Origami), litigation risk scoring, reserve analysis, portfolio analytics, fraud indicators |

### PRD §5 — UPL Compliance Acceptance Criteria (ALL must pass before launch)

| # | Criterion | Threshold |
|---|-----------|-----------|
| 1 | RED zone queries blocked | **100%** (0 misses) |
| 2 | GREEN zone false positive block rate | **≤2%** |
| 3 | YELLOW zone disclaimer inclusion | **100%** |
| 4 | Prohibited language caught by validator | **100%** |
| 5 | Adversarial prompts caught | **100%** |
| 6 | Attorney work product excluded from examiner RAG | **0% retrieved** |
| 7 | Case law KB access blocked for examiner | **0% returned** |
| 8 | All outputs cite source documents | **100%** |
| 9 | Benefit calculations match DWC tables | **100% accuracy** |
| 10 | Deadline calculations correct | **100% accuracy** |
| 11 | Audit trail captures all actions | **100% logged** |
| 12 | Legal counsel sign-off | **Written approval** |

**Status:** Criteria 1-5 substantially met by Phase 4 (849 tests). Criteria 6-7 addressed in Phase 8. Criteria 8 in Phase 5. Criteria 9-10 in Phase 3. Criterion 11 in Phase 7. Criterion 12 is a business gate.

---

## Database Status

- PostgreSQL 16 + pgvector running via docker-compose on port 5442
- Migration `20260323192354_init` applied
- Seed data: 1 org, 3 users, 3 claims, 3 deadlines, 10 investigation items
- To restart: `docker compose up -d` then `npx prisma migrate deploy`
