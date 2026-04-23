# AdjudiCLAIMS — Current State

**Last Updated:** 2026-04-23
**Branch:** main
**Last Merge:** PR #32 — `docs/batch-2026-04-20-execution-record` → `main` (batch execution record)

---

## Phase Summary

| Phase | Status | Completion |
|-------|--------|------------|
| 0 Infrastructure | ✅ Complete | 100% |
| 1 Auth & RBAC | ✅ Complete | 100% |
| 2 Document Pipeline | ✅ Complete | 100% |
| 3 Core Claims Services | ✅ Complete | 100% |
| 4 UPL Compliance | ✅ Complete | 100% (counsel sign-off received 2026-04-23) |
| 5 Claims Chat | ✅ Complete | 100% |
| 6 Education & Training | ✅ Complete | ~95% |
| 7 Compliance Dashboard | ✅ Complete | ~95% |
| 8 Data Boundaries & KB | ✅ Complete | ~95% |
| 9 MVP Integration Testing | ✅ Complete | ~95% |
| 10 Tier 2 Features | ✅ Complete | ~95% |
| 11 Tier 3 Features | ❌ Not Started | 0% |

## Current Focus: Pre-Production Deployment

### Open Blockers (non-engineering)

1. **Unified server not deployed to Cloud Run staging** — `server/production.ts` committed, Cloud Build triggers on `main` push but staging deployment needs verification
2. **Production database migration not run** — `npx prisma migrate deploy` against staging/production pending
3. **Staging E2E verification** — Playwright suite needs to run against the staging URL once deployed

### Resolved (2026-04-20 Batch)

- ~~23 AJC tickets~~ — `/process-backlog` run closed AJC-1, AJC-2, AJC-4–AJC-24 (all 23 in scope); ~30 PRs merged (see `docs/executions/batch-2026-04-20.md`)
- ~~Legal counsel UPL review~~ — Package approved verbatim by counsel on 2026-04-23 (AJC-3 closed)
- ~~Graph RAG G5 Trust UX~~ — Shipped in AJC-14 (confidence badges + entity panel)
- ~~MTUS guideline matching~~ — 11-entry placeholder replaced with 41-entry KB in AJC-15
- ~~Benefit payment letters~~ — PDF export + LC 3761 employer notifications shipped in AJC-16
- ~~Enhanced counsel referral~~ — Email integration with examiner CC + referral tracking UI shipped in AJC-17
- ~~Decision workflow audit~~ — All 20 workflows verified + 103 citation-integrity tests added in AJC-18
- ~~Training sandbox~~ — Per-user sandbox with 9 synthetic claims + multi-tenant safety shipped in AJC-19
- ~~Insurance Claims Case Generator~~ — 5-phase Python + Next.js package shipped across AJC-20–24
- ~~Regulatory KB expansion~~ — 33 → 50 entries in AJC-9
- ~~Compliance dashboard admin view~~ — Shipped in AJC-5
- ~~UPL analytics + org-boundary service + soft-delete guard~~ — Shipped in AJC-7, AJC-10

### Next Actions

1. Deploy unified server to Cloud Run staging (verify Cloud Build trigger fires on `main`)
2. Run `npx prisma migrate deploy` against staging database
3. Run Playwright E2E suite against staging URL
4. Run `npx prisma migrate deploy` against production database
5. Cut MVP 1.0 release tag

## Quality Metrics

| Metric | Value |
|--------|-------|
| Test files | 101 |
| Tests passing | 3,521 / 3,521 |
| Typecheck errors | 0 |
| Build | succeeds |
| UPL RED blocked | 126/126 (100%) |
| UPL GREEN false positive | 0/126 (0%) |
| UPL YELLOW disclaimed | 62/62 (100%) |
| UPL output validator | 203/203 (100%) |
| SOC 2 compliance tests | 69 passing |
| Decision workflows | 20 (all with citation-integrity invariants) |
| Regulatory KB entries | 50 |
| MTUS guideline entries | 41 |
| Legal counsel sign-off | ✅ Received 2026-04-23 |

## New Features (2026-04-20 Batch)

- **Benefit Payment Letters (LC 3761)** — PDF generator + employer notification templates; org-scoped access control; Print + Download UI
- **Enhanced Counsel Referral** — Email integration (SendGrid + examiner CC), referral status tracking (PENDING→SENT→RESPONDED→CLOSED), chat-panel "Refer to Counsel" CTA, referrals tab UI
- **Training Sandbox** — Per-user `User.trainingModeEnabled` + `Claim.isSynthetic` + `syntheticOwnerId`; 9 curated synthetic scenarios (TRAIN-001 – TRAIN-009); enable/disable/reset routes; yellow sandbox banner
- **Decision Workflow Audit** — 103 new tests locking citation format, UPL zone invariants, step metadata integrity, and skippable-step rules
- **Insurance Claims Case Generator** — Standalone Python package (`packages/insurance-claims-case-generator/`): 13 scenarios, 24 PDF document types, FastAPI service with 6 endpoints, AdjudiCLAIMS integration client, GCP secrets, Dockerfile, Next.js 15 frontend
- **Graph RAG G5 Trust UX** — Confidence badges + entity panel in chat

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
