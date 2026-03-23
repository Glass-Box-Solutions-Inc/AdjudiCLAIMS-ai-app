# AdjudiCLAIMS — Phase 0: Project Provisioning Specification

**Product:** AdjudiCLAIMS by Glass Box — Augmented Intelligence for CA Workers' Compensation Claims Professionals
**Document Type:** Infrastructure & Project Provisioning Plan
**Purpose:** Everything that must be set up BEFORE any product code is written — repo, GCP, database, CI/CD, secrets, shared services, RBAC foundation
**Repository:** https://github.com/LexPerspex/AdjudiCLAIMS-ai-app (private)
**Last Updated:** 2026-03-23
**Owner:** Engineering / DevOps
**Prerequisites:** None — this is the first phase

---

## 1. Repository Setup

### 1.1 Initialize Repository

Create `LexPerspex/AdjudiCLAIMS-ai-app` as a private repository under the LexPerspex GitHub organization. This repo lives outside the `Glass-Box-Solutions-Inc` org for business-entity separation.

- **Visibility:** Private
- **Default branch:** `main`
- **Description:** AdjudiCLAIMS by Glass Box — AI-powered claims management information tool for CA Workers' Compensation claims examiners

### 1.2 Branch Protection Rules (main)

| Rule | Setting |
|------|---------|
| Require pull request before merging | Yes — 1 reviewer minimum |
| Require status checks to pass | Yes — CI pipeline must pass |
| Require branches to be up to date | Yes |
| Disallow force pushes | Yes — no exceptions |
| Disallow deletions | Yes |
| Require conversation resolution | Yes |

### 1.3 Project Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project-level instructions following the GBS 16-point centralized documentation standard. Must reference ROOT_CLAUDE.md, all AdjudiCLAIMS design docs in adjudica-documentation, tech stack, commands, architecture, environment variables, and the subagent instructions reference. |
| `.gitignore` | Node.js + TypeScript + Prisma standard (node_modules, dist, .env*, prisma/*.db, coverage/) |
| `LICENSE` | Proprietary — Glass Box Solutions, Inc. All rights reserved. |
| `README.md` | Project overview, setup instructions, architecture link, link to adjudica-documentation design docs |
| `CODEOWNERS` | Engineering team leads as required reviewers |
| `renovate.json` | Renovate bot configuration for automated dependency updates |

### 1.4 CLAUDE.md Requirements

The project CLAUDE.md must satisfy all 16 points of the centralized documentation standard and include:

- Reference to ROOT_CLAUDE.md as the master engineering standard
- Links to all AdjudiCLAIMS design documentation in adjudica-documentation:
  - `product/PRD_ADJUDICLAIMS.md`
  - `product/ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md`
  - `product/ADJUDICLAIMS_DECISION_WORKFLOWS.md`
  - `product/ADJUDICLAIMS_ONBOARDING_AND_TRAINING.md`
  - `product/ADJUDICLAIMS_REGULATORY_COMPLIANCE_IMPLEMENTATION_GUIDE.md`
  - `product/foundations/DATA_BOUNDARY_SPECIFICATION.md`
  - `product/foundations/ADJUDICLAIMS_CHAT_SYSTEM_PROMPTS.md`
  - `standards/ADJUDICLAIMS_UPL_DISCLAIMER_TEMPLATE.md`
- Tech stack table (React Router 7, Fastify 5, Prisma 6, PostgreSQL/pgvector, Vertex AI, Claude)
- Dev/build/test/deploy commands
- Architecture directory tree
- Environment variables with GCP Secret Manager retrieval patterns
- Security and secrets directive (never expose in chat or git)
- Context window and checkpoint protocol section
- Centralized documentation and planning section
- Subagent instructions reference

---

## 2. GCP Project Provisioning

### 2.1 Production Project

| Property | Value |
|----------|-------|
| **Project ID** | `adjudiclaims-prod` |
| **Project Name** | AdjudiCLAIMS Production |
| **Region** | `us-west1` (match Adjudica cluster) |
| **Billing** | Linked to Glass Box Solutions billing account |

GBS rule: one GCP project per service. AdjudiCLAIMS gets its own project — never deploy to `adjudica-app-473308` or any other existing project.

### 2.2 Staging Project

| Property | Value |
|----------|-------|
| **Project ID** | `adjudiclaims-staging` |
| **Project Name** | AdjudiCLAIMS Staging |
| **Region** | `us-west1` |
| **Billing** | Linked to Glass Box Solutions billing account |

### 2.3 APIs to Enable (both projects)

- Cloud Run
- Cloud Build
- Cloud SQL Admin
- Secret Manager
- Vertex AI
- Document AI
- Cloud Storage
- Cloud Logging
- Cloud Monitoring
- Artifact Registry
- VPC Access Connector (for Cloud SQL private IP)

### 2.4 IAM Service Accounts

| Service Account | Purpose | Key Roles |
|----------------|---------|-----------|
| `adjudiclaims-app@adjudiclaims-prod.iam` | Cloud Run service identity | Cloud SQL Client, Secret Manager Secret Accessor, Storage Object Viewer, Vertex AI User |
| `adjudiclaims-build@adjudiclaims-prod.iam` | Cloud Build service account | Cloud Build Editor, Cloud Run Admin, Artifact Registry Writer, Secret Manager Secret Accessor |
| `adjudiclaims-db@adjudiclaims-prod.iam` | Cloud SQL client (migration runner) | Cloud SQL Client, Cloud SQL Editor |

Replicate identical accounts in `adjudiclaims-staging`.

### 2.5 VPC and Networking

- Create VPC connector in `us-west1` for Cloud Run to Cloud SQL private IP communication
- Cloud SQL instance uses private IP only (no public IP in production)
- Staging may use public IP with authorized networks for developer access

### 2.6 Budget Alerts

| Alert Threshold | Action |
|----------------|--------|
| 50% of monthly budget | Email notification |
| 80% of monthly budget | Email + Slack notification |
| 100% of monthly budget | Email + Slack + PagerDuty |

---

## 3. Database Provisioning

### 3.1 Cloud SQL Instance

| Property | Value |
|----------|-------|
| **Engine** | PostgreSQL 15 |
| **Instance name** | `adjudiclaims-prod-postgres` (production), `adjudiclaims-staging-postgres` (staging) |
| **Region** | `us-west1` |
| **Machine type** | `db-custom-2-7680` (staging: `db-f1-micro`) |
| **Storage** | 20 GB SSD, auto-increase enabled |
| **Extensions** | `pgvector`, `uuid-ossp`, `pg_trgm` |
| **Database name** | `adjudiclaims` |
| **High availability** | Enabled (production only) |

### 3.2 Schema Design Considerations

The Prisma schema must account for the dual-tenant architecture from DATA_BOUNDARY_SPECIFICATION.md.

**Organization model:**

```
InsuranceOrg (tenant root for AdjudiCLAIMS)
  └── Users (Claims_Admin, Claims_Supervisor, Claims_Examiner)
  └── Claims
      └── Documents → DocumentChunks → Embeddings
      └── Drafts (administrative documents only)
      └── ChatSessions (examiner prompts)
      └── ComplianceData (deadlines, investigation status)
```

**New RBAC roles to model:**

| Role | Enum Value | Scope |
|------|-----------|-------|
| Claims Administrator | `CLAIMS_ADMIN` | Insurance org / TPA |
| Claims Examiner | `CLAIMS_EXAMINER` | Assigned claims within org |
| Claims Supervisor | `CLAIMS_SUPERVISOR` | Team portfolio within org |

**Document access control fields (per DATA_BOUNDARY_SPECIFICATION.md):**

```prisma
accessLevel           DocumentAccess   @default(SHARED)
containsLegalAnalysis Boolean          @default(false)
containsWorkProduct   Boolean          @default(false)
containsPrivileged    Boolean          @default(false)
```

**UPL audit event types to model:**

- `upl_zone_classification` — query classified as GREEN/YELLOW/RED
- `upl_output_blocked` — RED zone output suppressed
- `upl_disclaimer_injected` — YELLOW zone disclaimer added
- `upl_adversarial_detected` — prompt injection attempt caught
- `upl_false_positive_reported` — examiner flagged incorrect block

**Education profile tables:**

- Dismissed Tier 1 regulatory education entries (per user)
- Training module completion records
- Assessment scores and certification timestamps
- Workflow completion tracking

### 3.3 Migration Strategy

**Phase 2A (standalone):** AdjudiCLAIMS has its own database with no shared tables. Claims exist only in the AdjudiCLAIMS database. This is the starting state.

**Phase 2B (shared claim linkage):** Introduce the `SharedClaim` model to link an attorney `Matter` in the Adjudica database with an examiner `Claim` in AdjudiCLAIMS. Requires cross-database references or a shared claims service.

**Phase 2C (defense counsel oversight):** Attorney product gains visibility into examiner compliance dashboards and can initiate counsel referral workflows.

Plan the schema now for Phase 2B compatibility even though Phase 2A implements standalone. Use stable identifiers (claim number, WCAB case number) as future linkage keys.

### 3.4 pgvector Setup

- Enable `pgvector` extension on database creation
- Vector dimension: 768 (match Vertex AI text-embedding model)
- Index type: IVFFlat or HNSW (benchmark during Phase 1)
- Embeddings table mirrors Adjudica pattern: `DocumentChunk` with `embedding` vector column

### 3.5 Connection Pooling

- Cloud SQL Auth Proxy sidecar on Cloud Run (recommended for GCP-native setup)
- Connection limit: 100 per instance (production), 20 (staging)
- Prisma connection pool: `connection_limit=10` per Cloud Run instance

### 3.6 Backup and Retention

| Property | Value |
|----------|-------|
| Automated backups | Daily, 02:00 UTC |
| Backup retention | 30 days (production), 7 days (staging) |
| Point-in-time recovery | Enabled (production) |
| Cross-region backup | Not required for Phase 0 — evaluate at scale |

---

## 4. Secret Management

### 4.1 Secrets to Create in GCP Secret Manager

All secrets created in both `adjudiclaims-prod` and `adjudiclaims-staging` projects.

| Secret Name | Purpose | Rotation |
|------------|---------|----------|
| `adjudiclaims-db-url` | PostgreSQL connection string | On password rotation |
| `adjudiclaims-db-password` | Database password | 90 days |
| `adjudiclaims-anthropic-key` | Claude API key for chat services | On vendor rotation |
| `adjudiclaims-document-ai-processor` | Document AI processor ID | Rarely changes |
| `adjudiclaims-session-secret` | Session encryption key | 90 days |
| `adjudiclaims-github-pat` | GitHub PAT for CI/CD (if using GitHub Actions) | 90 days |

Note: Vertex AI authentication uses the `adjudiclaims-app` service account identity — no separate API key required.

### 4.2 Access Policies

| Principal | Access |
|-----------|--------|
| `adjudiclaims-app` service account | Secret Accessor (read-only) on all secrets |
| `adjudiclaims-build` service account | Secret Accessor (read-only) on all secrets |
| Engineering team members | Secret Manager Admin (for rotation) |
| All other principals | No access |

### 4.3 Enforcement

- NEVER store secrets in code, `.env` files, or git history
- NEVER echo, print, or log secret values
- In CLAUDE.md environment variable tables, use `<retrieve: gcloud secrets versions access latest --secret=NAME --project=PROJECT>` notation
- If a secret is accidentally exposed, STOP immediately and rotate

---

## 5. CI/CD Pipeline

### 5.1 Platform Selection

Recommend **Cloud Build** for consistency with the existing GBS infrastructure (Adjudica uses Cloud Build). Alternative: GitHub Actions if the LexPerspex org has different tooling preferences.

### 5.2 Pipeline Stages

```yaml
# cloudbuild.yaml — simplified overview
steps:
  # 1. Install dependencies
  - npm ci

  # 2. Lint
  - npx eslint . --max-warnings=0

  # 3. Prettier check
  - npx prettier --check .

  # 4. Type check
  - npx tsc --noEmit

  # 5. Unit tests
  - npx vitest run --reporter=verbose

  # 6. Integration tests (against test database)
  - npx vitest run --config vitest.integration.config.ts

  # 7. Build
  - npm run build

  # 8. Security scan
  - npx audit-ci --high

  # 9. Docker build + push to Artifact Registry
  - docker build -t us-west1-docker.pkg.dev/adjudiclaims-prod/adjudiclaims/app:$COMMIT_SHA .

  # 10. Deploy to staging (on main branch push)
  - gcloud run deploy adjudiclaims-staging ...

  # 11. Deploy to production (manual approval gate)
  - gcloud run deploy adjudiclaims-prod ...
```

### 5.3 Environment Promotion

| Environment | Trigger | Approval |
|-------------|---------|----------|
| **Staging** | Merge to `main` | Automatic after CI passes |
| **Production** | Manual trigger or tag | Requires explicit approval from Engineering lead |

### 5.4 Rollback Strategy

- Cloud Run maintains previous revisions — rollback via `gcloud run services update-traffic` to shift to last known good revision
- Database rollbacks via Prisma `migrate resolve` — never drop production data
- Maximum rollback window: 5 previous revisions retained

### 5.5 Build Notifications

- CI failure: Slack `#adjudiclaims-builds` channel
- Production deploy: Slack `#adjudiclaims-deploys` + email to engineering lead
- Security scan findings: Slack `#security-alerts`

---

## 6. Shared Service Access

These services exist in the Adjudica attorney platform infrastructure and AdjudiCLAIMS needs access.

| Service | Current GCP Project | Access Method | What AdjudiCLAIMS Uses |
|---------|-------------------|---------------|----------------------|
| Google Document AI | `adjudica-app-473308` | Cross-project IAM | OCR pipeline — 100% reuse of existing processors |
| Vertex AI (Gemini) | `adjudica-app-473308` | Cross-project IAM or separate endpoint | RAG retrieval, embeddings, chat responses |
| Anthropic Claude API | External API | API key in Secret Manager | Chat responses, UPL zone classification |
| Knowledge Base | `wc-knowledge-base` project | API or database read replica | Regulatory sections, MTUS data, LC/CCR references |

### 6.1 Open Decisions

**Decision 1: Document AI Processor**

| Option | Pros | Cons |
|--------|------|------|
| Share processor across projects | No duplication, consistent classification | Cross-project IAM complexity, single point of failure |
| Dedicated processor for AdjudiCLAIMS | Independent scaling, isolated failure domain | Duplicate training, additional cost |

Recommendation: Share the processor via cross-project IAM for Phase 2A. Migrate to a dedicated processor if scaling demands diverge.

**Decision 2: Knowledge Base Access**

| Option | Pros | Cons |
|--------|------|------|
| Direct database read access | Simple, real-time data | Cross-project DB connections, tight coupling |
| API gateway | Decoupled, access-control at API layer | Additional service to maintain |
| Replicate regulatory content to AdjudiCLAIMS DB | Full isolation, fastest queries | Data sync complexity, staleness risk |

Recommendation: API gateway with role-based filtering. The KB API can enforce the access rules from DATA_BOUNDARY_SPECIFICATION.md (block case law for examiner roles, allow regulatory sections and MTUS).

---

## 7. Application Scaffold

Initialize the application structure mirroring Adjudica patterns with AdjudiCLAIMS-specific additions.

```
adjudiclaims-ai-app/
├── app/                          # React Router 7 frontend
│   ├── routes/                   # Route modules
│   ├── components/               # React components
│   │   ├── education/            # NEW: Tier 1/Tier 2 education components
│   │   ├── workflows/            # NEW: Decision workflow UI
│   │   └── compliance/           # NEW: Compliance dashboard components
│   └── services/                 # Frontend services
├── server/                       # Fastify 5 backend
│   ├── routes/                   # API routes
│   ├── services/                 # Business logic
│   │   ├── upl-classifier.service.ts      # NEW: GREEN/YELLOW/RED zone classification
│   │   ├── upl-validator.service.ts       # NEW: Output validation and blocking
│   │   ├── benefit-calculator.service.ts  # NEW: TD/PD rate calculations
│   │   ├── deadline-engine.service.ts     # NEW: Regulatory deadline tracking
│   │   ├── investigation-checklist.service.ts  # NEW: Investigation tracking
│   │   └── education-profile.service.ts   # NEW: User education state management
│   ├── prompts/                  # System prompts
│   │   └── adjudiclaims-chat.prompts.ts   # NEW: UPL-filtered examiner prompts
│   └── middleware/               # Auth, RBAC, logging, UPL audit
├── prisma/                       # Database schema
│   ├── schema.prisma
│   ├── seed.ts                   # Seed data (regulatory education entries, test claims)
│   └── migrations/
├── tests/                        # Test suites
│   ├── unit/                     # Unit tests (Vitest)
│   ├── integration/              # Integration tests (API + DB)
│   └── upl-compliance/           # NEW: UPL test suites
│       ├── red-zone.test.ts      # 100+ RED zone queries — all must be blocked
│       ├── green-zone.test.ts    # 100+ GREEN zone queries — 0% false positives
│       └── yellow-zone.test.ts   # 50+ YELLOW zone queries — disclaimer injected
├── CLAUDE.md                     # Project instructions (16-point compliant)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── eslint.config.js
├── prettier.config.js
├── Dockerfile
├── cloudbuild.yaml
└── renovate.json
```

### 7.1 Port Assignment

Register AdjudiCLAIMS in the GBS Port and URL Registry:

| Resource | Value |
|----------|-------|
| **Block** | 4900-4999 (next available block) |
| **Frontend** | http://localhost:4900 |
| **API** | http://localhost:4901 |
| **PostgreSQL** | localhost:5442 (local dev) |
| **Production URL** | TBD — `claims.adjudica.ai` or `adjudiclaims.glassboxsolutions.com` |
| **GCP Project** | `adjudiclaims-prod` |

---

## 8. RBAC Foundation

### 8.1 New Roles

Extend the existing Adjudica RBAC model with claims-specific roles per DATA_BOUNDARY_SPECIFICATION.md.

| Role | Permissions | Scope |
|------|------------|-------|
| `CLAIMS_ADMIN` | Team management, compliance reporting, portfolio analytics, user provisioning | Insurance org / TPA |
| `CLAIMS_EXAMINER` | Claim access, factual AI features, benefit calculations, deadline tracking, counsel referral | Assigned claims within org |
| `CLAIMS_SUPERVISOR` | All examiner permissions + team oversight, reserve approval authority, compliance review, UPL dashboard | Team portfolio within org |

### 8.2 Role-Driven Behavior

The user's role determines system behavior at every layer:

| Behavior | How Role Controls It |
|----------|---------------------|
| **System prompt selection** | Examiner roles receive UPL-compliant prompts; attorney roles receive full legal prompts |
| **KB access filtering** | Examiner roles: regulatory sections and MTUS only. Case law blocked. |
| **Document access filtering** | Examiner roles: attorney work product, privileged communications, and AI-generated legal analysis blocked from view and RAG retrieval |
| **Tool availability in Draft Chat** | Examiner roles: administrative forms only. Legal document drafting tools hidden. |
| **Feature access** | Compliance dashboard = examiner roles only. PD Calculator = attorney roles only. |
| **Audit detail level** | All examiner AI interactions logged with UPL zone classification for compliance review |

### 8.3 Implementation Approach

Phase 0 implements the role definitions and basic permission checks. The full permission matrix from DATA_BOUNDARY_SPECIFICATION.md is enforced incrementally:

1. **Phase 0:** Role enum, role assignment on user creation, middleware that reads role from session
2. **Phase 1:** Role-based route protection (examiner cannot access attorney-only endpoints)
3. **Phase 2A:** Role-based RAG filtering and system prompt selection
4. **Phase 2B:** Cross-tenant document access rules for shared claims

---

## 9. Monitoring and Observability

### 9.1 Cloud Logging

- Structured JSON logs from Fastify (pino logger)
- **CRITICAL:** No PHI/PII in log content — log document IDs, claim IDs, user IDs only. Never log document text, patient names, or claim details.
- Log UPL zone classifications with query hash (not query text) for compliance auditing
- Retain logs for 365 days (regulatory compliance)

### 9.2 Cloud Monitoring Dashboards

| Dashboard | Metrics |
|-----------|---------|
| **Application Health** | Request latency (p50/p95/p99), error rate, Cloud Run instance count, CPU/memory utilization |
| **UPL Compliance** | Zone classification counts (GREEN/YELLOW/RED), output blocks per day, false positive rate, adversarial detection rate |
| **Education Engagement** | Training module completion rate, Tier 1 dismissal rate, workflow usage frequency, assessment pass rate |
| **Claims Operations** | Active claims per examiner, deadline compliance rate, investigation checklist completion, counsel referrals generated |

### 9.3 Alerting

| Condition | Severity | Channel |
|-----------|----------|---------|
| Error rate > 5% for 5 minutes | Critical | PagerDuty + Slack |
| UPL output validator failure rate > 1% | Critical | PagerDuty + Slack + email to legal |
| Database connection failures | Critical | PagerDuty + Slack |
| Cloud Run instance count at max | Warning | Slack |
| Latency p95 > 5s for 10 minutes | Warning | Slack |
| Staging deploy failure | Info | Slack `#adjudiclaims-builds` |

### 9.4 Audit Trail

Extend the Adjudica `audit-logger.ts` pattern for claims-specific events:

- All examiner AI chat interactions (with UPL zone classification)
- All document access events (who viewed what, when)
- All benefit calculations (inputs, outputs, timestamp)
- All deadline modifications (who changed what deadline, why)
- All counsel referral generations
- All RBAC permission checks (especially denied access attempts)

Audit logs are immutable — append-only table with no UPDATE or DELETE permissions granted to the application service account.

---

## 10. Phase 0 Checklist

| # | Task | Depends On | Effort | Owner |
|---|------|-----------|--------|-------|
| 1 | Create GCP projects (`adjudiclaims-prod` + `adjudiclaims-staging`) | None | 1 hr | DevOps |
| 2 | Enable GCP APIs on both projects | #1 | 30 min | DevOps |
| 3 | Create service accounts and configure IAM roles | #1 | 1 hr | DevOps |
| 4 | Provision Cloud SQL instances (prod + staging) | #1, #2 | 2 hrs | DevOps |
| 5 | Set up Secret Manager and create all secrets | #1 | 1 hr | DevOps |
| 6 | Initialize `LexPerspex/AdjudiCLAIMS-ai-app` repository | None | 2 hrs | Engineering |
| 7 | Create CLAUDE.md (16-point compliant) | #6 | 1 hr | Engineering |
| 8 | Set up CI/CD pipeline (Cloud Build or GitHub Actions) | #1, #6 | 4 hrs | DevOps |
| 9 | Initialize Prisma schema with RBAC roles and core models | #4, #6 | 4 hrs | Engineering |
| 10 | Scaffold application structure (React Router 7 + Fastify 5) | #6 | 4 hrs | Engineering |
| 11 | Implement RBAC foundation (role enum, middleware, permission checks) | #9, #10 | 8 hrs | Engineering |
| 12 | Configure shared service access (Document AI, Vertex AI cross-project IAM) | #1, #3 | 2 hrs | DevOps |
| 13 | Set up Cloud Monitoring dashboards and alerting | #1, #8 | 4 hrs | DevOps |
| 14 | Deploy empty application to staging | #4, #5, #8, #10 | 2 hrs | DevOps |
| 15 | Verify end-to-end connectivity (app to DB, app to secrets, health check) | #14 | 2 hrs | Engineering |
| 16 | Register ports in GBS Port and URL Registry | #6 | 15 min | Engineering |
| 17 | Create VPC connector for Cloud SQL private IP | #1, #4 | 1 hr | DevOps |

**Total estimated effort:** ~38 hours
**Parallelizable to:** ~2-3 days with DevOps and Engineering working concurrently

**Parallel tracks:**

```
Track A (DevOps):  #1 → #2 → #3 → #4, #5, #17 → #12 → #8 → #13 → #14
Track B (Eng):     #6 → #7, #16 → #10 → #9 → #11 → #15
```

---

## 11. Phase 0 to Phase 1 Handoff

### Exit Criteria

Phase 0 is complete when ALL of the following are true:

- [ ] GCP projects created with all APIs enabled and billing linked
- [ ] Cloud SQL instances provisioned with pgvector extension enabled
- [ ] All secrets created in Secret Manager with proper access policies
- [ ] Repository initialized with CLAUDE.md, README, LICENSE, .gitignore, CODEOWNERS
- [ ] CI/CD pipeline runs lint, type check, and tests (even on minimal test suite)
- [ ] Empty application deploys to staging and returns 200 on health check endpoint
- [ ] Database accepts connections and Prisma migrations run successfully
- [ ] RBAC foundation creates a `CLAIMS_EXAMINER` user and restricts access to examiner-only routes
- [ ] Secrets are accessible from Cloud Run at runtime
- [ ] Monitoring dashboards are live and alerting is configured
- [ ] VPC connector established for Cloud SQL private IP access
- [ ] Port block registered in GBS Port and URL Registry
- [ ] CLAUDE.md passes 16-point compliance standard review

### Phase 1 Scope

Phase 1 begins with **document ingestion pipeline** — the highest-reuse component from the Adjudica attorney platform:

1. Google Document AI OCR integration (100% reuse)
2. Document classification service (100% reuse of `document-classifier.service.ts`)
3. Medical record field extraction (100% reuse of `document-field-extraction.service.ts`)
4. Claim data extraction and auto-population
5. Document chunk embedding pipeline for RAG (pgvector)

Phase 1 is estimated at 2-3 weeks given the high reuse ratio from the existing Adjudica platform.

### Design Documentation Reference

All product and technical design documentation lives in the adjudica-documentation hub:

| Document | Path | Content |
|----------|------|---------|
| Product Requirements | `product/PRD_ADJUDICLAIMS.md` | Full PRD with MVP scope, personas, feature tiers |
| Regulatory Education | `product/ADJUDICLAIMS_REGULATORY_EDUCATION_SPEC.md` | 57 education entries for contextual learning |
| Decision Workflows | `product/ADJUDICLAIMS_DECISION_WORKFLOWS.md` | 20 examiner decision workflows |
| Onboarding and Training | `product/ADJUDICLAIMS_ONBOARDING_AND_TRAINING.md` | Training system specification |
| Data Boundaries | `product/foundations/DATA_BOUNDARY_SPECIFICATION.md` | Dual-tenant architecture, RBAC, document access rules |
| Chat System Prompts | `product/foundations/ADJUDICLAIMS_CHAT_SYSTEM_PROMPTS.md` | UPL-compliant system prompts |
| UPL Disclaimers | `standards/ADJUDICLAIMS_UPL_DISCLAIMER_TEMPLATE.md` | Disclaimer templates for all UPL zones |
| Compliance Guide | `product/ADJUDICLAIMS_REGULATORY_COMPLIANCE_IMPLEMENTATION_GUIDE.md` | 6-phase compliance checklist |

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
