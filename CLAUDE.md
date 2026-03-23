# AdjudiCLAIMS by Glass Box — AI-Powered Claims Management

> **"From Black Box to Glass Box."** Augmented Intelligence for CA Workers Compensation Claims Professionals.
> The product IS the training program. Every deadline cited. Every regulation explained. Every decision transparent.

**Organization:** [LexPerspex](https://github.com/LexPerspex) (GitHub — private development)
**Parent Company:** [Glass-Box-Solutions-Inc](https://github.com/Glass-Box-Solutions-Inc)
**Documentation Hub:** [adjudica-documentation](https://github.com/Glass-Box-Solutions-Inc/adjudica-documentation)
**Master Source:** [ROOT_CLAUDE.md](https://github.com/Glass-Box-Solutions-Inc/adjudica-documentation/blob/main/engineering/ROOT_CLAUDE.md)

---

## CRITICAL GUARDRAILS (READ FIRST)

1. **NEVER push without permission** — Even small fixes require express user permission. No exceptions.
2. **NEVER expose secrets** — No API keys, tokens, credentials in git, logs, or conversation. Source from GCP Secret Manager only.
3. **NEVER force push or skip tests** — 100% passing tests required. No workarounds.
4. **ALWAYS read CLAUDE.md first** — Before any task, read this file and the ROOT_CLAUDE.md.
5. **ALWAYS use Definition of Ready** — 100% clear requirements before implementation.
6. **UPL COMPLIANCE IS NON-NEGOTIABLE** — Every AI output to a claims examiner must comply with the Green/Yellow/Red zone framework. NO legal advice, legal analysis, or legal conclusions to non-attorney users. This is a hard legal requirement under Cal. Bus. & Prof. Code § 6125.

---

## What This Product Is

AdjudiCLAIMS is an AI-powered claims management information tool for California Workers' Compensation claims examiners. It provides:

- Factual data analysis and document summarization
- Regulatory deadline tracking with statutory citations
- Benefit calculations (TD rate, payment schedules)
- Medical record extraction (diagnoses, WPI, restrictions)
- MTUS guideline matching for utilization review
- Investigation completeness tracking
- Contextual regulatory education at every decision point

## What This Product Is NOT

- **NOT a legal advisor** — Claims examiners are not attorneys. AI cannot provide legal advice.
- **NOT a claims automation system** — The examiner makes all substantive decisions.
- **NOT a replacement for defense counsel** — Legal issues are referred to licensed attorneys.
- **NOT a black box** — Every output cites its source. Every regulation is explained.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Router 7 |
| Backend | Fastify 5 |
| ORM | Prisma 6 |
| Database | PostgreSQL 15 + pgvector |
| AI — Chat/Classification | Anthropic Claude (via API) |
| AI — RAG/Embeddings | Google Vertex AI (Gemini) |
| Document Processing | Google Document AI |
| Knowledge Base | Shared KB (regulatory sections, MTUS, OMFS) |
| Infrastructure | GCP (Cloud Run, Cloud SQL, Secret Manager) |
| CI/CD | Cloud Build |

---

## Commands

```bash
# Development
npm install                    # Install dependencies
npm run dev                    # Start development server
npm run build                  # Production build
npm run typecheck              # TypeScript strict check

# Testing
npm run test                   # Run unit tests (Vitest)
npm run test:integration       # Run integration tests
npm run test:upl               # Run UPL compliance test suite
npm run test:all               # Run all test suites

# Database
npx prisma migrate dev         # Apply migrations (development)
npx prisma migrate deploy      # Apply migrations (production)
npx prisma generate            # Regenerate Prisma client
npx prisma studio              # Open Prisma Studio

# Linting
npm run lint                   # ESLint
npm run format                 # Prettier
```

---

## Architecture

```
adjudiclaims-ai-app/
├── app/                          # React Router 7 frontend
│   ├── routes/                   # Route modules
│   ├── components/
│   │   ├── education/            # Tier 1/Tier 2 education components
│   │   ├── workflows/            # Decision workflow UI
│   │   └── compliance/           # Compliance dashboard
│   └── services/                 # Frontend services
├── server/                       # Fastify backend
│   ├── routes/                   # API routes
│   ├── services/
│   │   ├── upl-classifier.service.ts      # Query zone classification (GREEN/YELLOW/RED)
│   │   ├── upl-validator.service.ts       # Output validation — prohibited language detection
│   │   ├── benefit-calculator.service.ts  # TD/PD statutory calculations
│   │   ├── deadline-engine.service.ts     # Regulatory deadline tracking
│   │   ├── investigation-checklist.service.ts
│   │   ├── education-profile.service.ts   # User education state (Tier 1 dismissals, training)
│   │   ├── case-chat.service.ts           # RAG-powered Q&A (reused from Adjudica)
│   │   ├── document-classifier.service.ts # Document classification (reused)
│   │   ├── document-field-extraction.service.ts  # Field extraction (reused)
│   │   └── event-generation.service.ts    # Timeline generation (reused)
│   ├── prompts/
│   │   └── adjudiclaims-chat.prompts.ts   # UPL-filtered system prompts
│   └── middleware/               # Auth, RBAC, audit logging
├── prisma/
│   ├── schema.prisma             # Dual-tenant schema (InsuranceOrg → Claims)
│   └── migrations/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── upl-compliance/           # 100+ RED, 100+ GREEN, 50+ YELLOW test cases
├── docs/                         # Design documentation (from adjudica-documentation)
│   ├── product/                  # PRD, user guide, education spec, workflows, provisioning
│   ├── foundations/              # Examiner duties, attorney duties
│   ├── standards/                # UPL disclaimers, HIPAA, AI transparency
│   └── reference/                # Adjudica architecture reference
├── CLAUDE.md                     # This file
├── package.json
├── tsconfig.json
└── Dockerfile
```

---

## UPL Compliance — The Core Constraint

Every feature in this product operates under the **Unauthorized Practice of Law** constraint:

| Zone | AI Behavior | Example |
|------|-------------|---------|
| **GREEN** | Factual data, arithmetic, citations | "The QME diagnosed 12% WPI for the lumbar spine" |
| **YELLOW** | Statistical data + mandatory disclaimer | "Comparable claims resolved in $45K-$85K range. Consult defense counsel." |
| **RED** | Blocked — attorney referral | "This question requires legal analysis. Contact defense counsel." |

**Three enforcement layers:**
1. **Query classifier** — Pre-chat zone classification (lightweight LLM call)
2. **System prompt** — Role-specific prompt enforcing zone boundaries
3. **Output validator** — Post-generation prohibited language detection

**Test requirements before any release:**
- 100+ RED zone queries → 100% must be blocked
- 100+ GREEN zone queries → ≤2% false positive block rate
- 50+ YELLOW zone queries → 100% must include disclaimer
- 200+ response variations → 100% caught by output validator

**Full specification:** `docs/product/ADJUDICLAIMS_CHAT_SYSTEM_PROMPTS.md`

---

## Education System — Glass Box Philosophy

AdjudiCLAIMS is not just a tool — it is the training program. Two-tier progressive disclosure:

| Tier | Content | Behavior |
|------|---------|----------|
| **Tier 1: Dismissable basics** | Term definitions ("AWE = Average Weekly Earnings") | New examiners see by default; dismiss permanently once learned |
| **Tier 2: Always-present core** | Statutory authority + consequences ("LC 4650 requires TD payment within 14 days because...") | NEVER hidden — Glass Box foundation |

**Specifications:**
- Education content: `docs/product/ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md` (57 entries)
- Decision workflows: `docs/product/ADJUDICLAIMS_DECISION_WORKFLOWS.md` (20 workflows)
- Training system: `docs/product/ADJUDICLAIMS_ONBOARDING_AND_TRAINING.md`

---

## RBAC Roles

| Role | Permissions | System Prompt |
|------|------------|---------------|
| `CLAIMS_EXAMINER` | Claim access, factual AI, benefit calc, deadlines | UPL-filtered examiner prompts |
| `CLAIMS_SUPERVISOR` | Examiner + team oversight, compliance review | UPL-filtered examiner prompts + compliance tools |
| `CLAIMS_ADMIN` | Team management, portfolio analytics | UPL-filtered + admin tools |

Examiner roles **CANNOT** access: case law research, legal document drafting, PD calculator, attorney work product, attorney chat sessions.

**Full permission matrix:** `docs/product/DATA_BOUNDARY_SPECIFICATION.md`

---

## Environment Variables

| Variable | Source | Description |
|----------|--------|-------------|
| `DATABASE_URL` | GCP Secret Manager | PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | GCP Secret Manager | Claude API key |
| `VERTEX_AI_PROJECT` | GCP Secret Manager | Vertex AI project ID |
| `DOCUMENT_AI_PROCESSOR` | GCP Secret Manager | Document AI processor ID |
| `SESSION_SECRET` | GCP Secret Manager | Session encryption key |
| `NODE_ENV` | Runtime | `development` / `staging` / `production` |
| `PORT` | Runtime | Server port (default: 4900) |

**NEVER store secrets in `.env` files committed to git.** Use GCP Secret Manager for all credentials.

---

## Design Documentation Index

| Document | Purpose |
|----------|---------|
| `docs/product/PRD_ADJUDICLAIMS.md` | Product requirements, features, user stories |
| `docs/product/ADJUDICLAIMS_USER_GUIDE.md` | End-user guide with regulatory context |
| `docs/product/ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md` | 57 education entries — every legally mandated duty |
| `docs/product/ADJUDICLAIMS_DECISION_WORKFLOWS.md` | 20 step-by-step decision workflows |
| `docs/product/ADJUDICLAIMS_ONBOARDING_AND_TRAINING.md` | Training system specification |
| `docs/product/ADJUDICLAIMS_REGULATORY_COMPLIANCE_IMPLEMENTATION_GUIDE.md` | 6-phase compliance checklist |
| `docs/product/ADJUDICLAIMS_PHASE_0_PROVISIONING.md` | Infrastructure provisioning plan |
| `docs/product/ADJUDICLAIMS_CHAT_SYSTEM_PROMPTS.md` | UPL-compliant chat system prompts |
| `docs/product/DATA_BOUNDARY_SPECIFICATION.md` | Dual-tenant architecture, RBAC, document access |
| `docs/product/CLAIMS_SYSTEM_INTEGRATION_SPEC.md` | CMS integration design |
| `docs/product/KB_REGULATORY_GAP_REPORT.md` | KB content gaps blocking features |
| `docs/foundations/WC_CLAIMS_EXAMINER_ROLES_AND_DUTIES.md` | Comprehensive examiner duty catalog |
| `docs/foundations/WC_DEFENSE_ATTORNEY_ROLES_AND_DUTIES.md` | Attorney duties (boundary reference) |
| `docs/standards/ADJUDICLAIMS_UPL_DISCLAIMER_TEMPLATE.md` | Disclaimer templates + prohibited patterns |

---

## Before You Start Any Task

1. `git fetch origin && git status -uno`
2. Read this CLAUDE.md
3. Read relevant design documentation from `docs/`
4. Check `.planning/STATE.md` and `PLAN-*.md` if they exist
5. Satisfy Definition of Ready — 100% clear requirements before implementation
6. Understand the UPL implications of any feature you're building
7. Clarify ALL ambiguities before execution

---

## Git Authentication

| Setting | Value |
|---------|-------|
| Method | HTTPS with PAT |
| Token Source | GCP Secret Manager (`github-pat-glassbox`, project: `adjudica-internal`) |
| Sync Script | `bash ~/Claude_Code/scripts/sync-git-credentials.sh` |

---

## Centralized Documentation & Planning

This project's design documentation lives in both this repo (`docs/`) and the
[Glass Box Documentation Hub](https://github.com/Glass-Box-Solutions-Inc/adjudica-documentation).

| Resource | Location |
|----------|----------|
| Design docs (local) | `docs/` directory in this repo |
| Design docs (source of truth) | `adjudica-documentation/product/` |
| Engineering standards | `adjudica-documentation/engineering/` |
| Legal documents | `adjudica-documentation/legal/` |

**Rule:** Design docs in this repo are copies. The source of truth is adjudica-documentation.
Update the source first, then re-bootstrap with `ADJUDICLAIMS_REPO_BOOTSTRAP.sh`.

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
