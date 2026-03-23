# Adjudica AI App — Database & Schema Architecture

**Last Updated:** 2026-02-14
**Source Repos:** `adjudica-ai-app` (staging), `Adjudica-Production` (production)
**Purpose:** Deep reference for the Adjudica AI App's database layer — schema design, migration strategy, connection pooling, CI/CD integration, and operational patterns.

---

## Executive Summary

The Adjudica AI App uses a **PostgreSQL database** managed through Prisma ORM with enterprise-grade operational tooling:

| Metric | Value |
|--------|-------|
| **Models** | 34 |
| **Enums** | 25 |
| **Relations** | 60 |
| **Indexes/Constraints** | 82 |
| **Migrations (staging)** | 75 |
| **Migrations (production)** | 65 |
| **Vector embedding fields** | 2 (pgvector) |
| **Schema lines** | ~1,035 (staging) |

---

## 1. Prisma Configuration

**Schema location:** `prisma/schema.prisma`

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  directUrl  = env("DIRECT_URL")
  extensions = [vector]  // pgvector for AI embeddings
}
```

### Dual URL Pattern

| URL | Purpose | Target |
|-----|---------|--------|
| `DATABASE_URL` | Application queries | PgBouncer (`127.0.0.1:6432`) in production; direct PostgreSQL locally |
| `DIRECT_URL` | Migrations & introspection | Direct Cloud SQL connection (bypasses PgBouncer) |
| `PGBOUNCER_DATABASE_URL` | Explicit pooled override | Same as `DATABASE_URL` in production |

Prisma requires `directUrl` because PgBouncer in transaction mode doesn't support the extended query protocol used by `prisma migrate`.

### Client Instantiation

**`server/lib/db.ts`:**
```typescript
const databaseUrl = process.env.PGBOUNCER_DATABASE_URL || process.env.DATABASE_URL;

export const db = remember("prisma", () => {
  const client = new PrismaClient({
    datasources: { db: { url: databaseUrl } }
  });
  void client.$connect();
  return client;
});
```

The `remember` utility prevents multiple Prisma clients during hot reload in development.

---

## 2. Data Model Overview (34 Models)

### Authentication & User Management (8 models)

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **User** | Core user with 2FA support | `email`, `role` (UserRole), `twoFactorEnabled` |
| **Account** | OAuth/password auth | `providerId`, `accountId`, `password` |
| **Session** | Session tracking (SOC 2) | `token`, `ipAddress`, `userAgent`, `lastActivity` |
| **TwoFactor** | TOTP secrets & backup codes | `secret`, `backupCodes` |
| **Verification** | Email verification tokens | `identifier`, `value`, `expiresAt` |
| **LawFirm** | Multi-tenant organization | `name`, `slug`, `metadata` (Json) |
| **LawFirmMember** | User↔Firm association | `userId`, `lawFirmId`, `role` (LawFirmRole) |
| **LawFirmInvitation** | Pending invitations | `email`, `role`, `status`, `expiresAt` |

### Case Management (5 models)

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **Matter** | Core case/matter (WC cases) | `caseNumber`, `caseType`, `status`, `lawFirmId`, `attorneyId` |
| **Claim** | Nested claims under matters | `adjNumber`, `claimType`, `claimStatus`, `matterId` |
| **MatterFact** | Key-value case facts | `key`, `value`, `matterId` |
| **FactCitation** | Document citations for facts | `factId`, `documentId`, `pageNumber`, `excerpt` |
| **MatterEvent** | Timeline events with embeddings | `title`, `date`, `embedding` (vector), `matterId` |

### Document Management (3 models)

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **Document** | PDF/DOCX with OCR results | `fileName`, `documentType`, `documentSubtype`, `status`, `ocrText`, `s3Key` (legacy field name; stores GCP Cloud Storage path) |
| **DocumentChunk** | Text chunks with vector embeddings | `content`, `embedding` (vector), `chunkVectorDimension`, `documentId` |
| **EventDocument** | Event↔Document join table | `eventId`, `documentId`, `role` (PRIMARY/SECONDARY) |

### Draft Generation (7 models)

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **Draft** | Traditional form-filling drafts | `name`, `status`, `matterId`, `formId` |
| **DraftAnswer** | Form field answers | `fieldId`, `value`, `source` (AI/HUMAN/MIXED) |
| **AnswerCandidate** | AI-generated answer options | `value`, `confidence`, `reasoning` |
| **Citation** | Document citations for answers | `documentId`, `pageNumber`, `excerpt` |
| **DraftEditHistory** | Audit trail for edits | `fieldId`, `oldValue`, `newValue`, `editedBy` |
| **Template** | Reusable document templates | `name`, `content`, `lawFirmId` |
| **TemplateDraft** | Generated docs from templates | `templateId`, `matterId`, `content` |
| **CustomDraft** | Free-form AI-generated docs | `title`, `content`, `matterId` |

### Background Processing (2 models)

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **Job** | Async job queue with retry | `type`, `status`, `attempts`, `metadata` (Json), `nextRetryAt` |
| **EmailJob** | Email delivery queue | `to`, `subject`, `status` |

### AI Chat System (3 models)

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **ChatSession** | Case or draft chat context | `type` (CASE/DRAFT), `matterId`, `draftId` |
| **ChatMessage** | Individual messages | `role` (USER/ASSISTANT/SYSTEM), `content` |
| **ChatCitation** | Document citations in chat | `messageId`, `documentId`, `excerpt` |

### Workflow Automation (2 models)

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **WorkflowRule** | Document-triggered automation | `triggerType`, `conditions` (Json), `actions` (Json) |
| **WorkflowLog** | Workflow execution history | `ruleId`, `status`, `result` (Json) |

### Integrations (1 model)

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **Integration** | OAuth tokens (MerusCase, etc.) | `provider`, `accessToken`, `refreshToken`, `lawFirmId` |

---

## 3. Enums (25 Total)

### Document Classification

| Enum | Values | Notes |
|------|--------|-------|
| **DocumentType** | 13 values | `ADMINISTRATIVE_COURT`, `MEDICAL`, `OFFICIAL_FORMS`, etc. |
| **DocumentSubtype** | 66 values | Ultra-granular CA Workers' Comp taxonomy |
| **DocumentStatus** | 10 values | `NOT_STARTED` → `QUEUED` → `PROCESSING` → `PENDING_REVIEW` → `IN_REVIEW` → `REVIEWED` / `AI_ACCEPTED` / `REJECTED` / `FAILED` |
| **DocumentSource** | 5 values | `UPLOAD`, `MAILROOM`, `MERUSCASE`, `EMAIL`, `GENERATED` |

### Case Management

| Enum | Values | Notes |
|------|--------|-------|
| **CaseType** | Multiple | `WORKERS_COMP`, `PERSONAL_INJURY`, etc. |
| **CaseStatus** | 5 values | `INTAKE`, `ACTIVE`, `PENDING_SETTLEMENT`, `SETTLED`, `ARCHIVED` |
| **MatterStatus** | 2 values | `GENERATING`, `READY` |
| **ClaimType** | 3 values | `SPECIFIC_INJURY`, `CUMULATIVE_TRAUMA`, `DEATH` |
| **ClaimStatus** | Multiple | `ACTIVE`, `RESOLVED`, `DENIED`, etc. |
| **MedicalStatus** | Multiple | `ONGOING`, `MMI`, `PERMANENT_PARTIAL`, etc. |

### User & Auth

| Enum | Values | Notes |
|------|--------|-------|
| **UserRole** | 2 values | `SUPER_ADMIN`, `STANDARD` |
| **LawFirmRole** | 3 values | `ADMIN`, `ATTORNEY`, `CLERK` |

### Jobs, Workflows & AI

| Enum | Values | Notes |
|------|--------|-------|
| **JobStatus** | 6 values | `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`, `CANCELLED`, `EXPIRED` |
| **DraftStatus** | 3 values | `IN_PROGRESS`, `NEEDS_REVIEW`, `PUBLISHED` |
| **AnswerSource** | 3 values | `AI`, `HUMAN`, `MIXED` |
| **ChatType** | 2 values | `CASE`, `DRAFT` |
| **MessageRole** | 3 values | `USER`, `ASSISTANT`, `SYSTEM` |

---

## 4. Vector Embeddings (pgvector)

Two models store vector embeddings for semantic search:

### DocumentChunk

```prisma
embedding            Unsupported("vector")
chunkVectorAlgorithm String
chunkVectorDimension Int
```

- Uses `text-embedding-004` (Google Gemini, 768 dimensions)
- Every document is split into chunks with individual embeddings
- Enables semantic search across document content

### MatterEvent

```prisma
embedding          Unsupported("vector")?
embeddingModel     String?
embeddingDimension Int?
embeddingUpdatedAt DateTime?
```

- Optional embeddings for timeline events
- Enables semantic timeline search ("find events related to surgery")
- Tracks embedding model and last update for staleness detection

### Why `Unsupported("vector")`?

Prisma doesn't natively support the PostgreSQL `vector` type. The `Unsupported` wrapper tells Prisma to pass raw SQL for these columns. The `postgresqlExtensions` preview feature enables the `CREATE EXTENSION vector` in migrations.

---

## 5. Migration Strategy

### Overview

| Aspect | Detail |
|--------|--------|
| **Tool** | `prisma migrate dev` (development), `prisma migrate deploy` (production) |
| **Migration count** | 75 (staging), 65 (production) |
| **Naming pattern** | `YYYYMMDDHHMMSS_descriptive_name/migration.sql` |
| **Location** | `prisma/migrations/` |
| **First migration** | `20250915041506_init` |
| **Latest (staging)** | `20260212033140_add_document_error_code` |

### Staging vs Production Divergence

Staging runs **10 migrations ahead** of production at any time. These migrations are validated in staging before being promoted to production via the PR process.

**Staging-only migrations (as of 2026-02-14):**

| Migration | Purpose |
|-----------|---------|
| `20260122131931_add_template_draft_primary_reference_document` | Template draft references |
| `20260123082149_update_document_model` | Document model enhancements |
| `20260125124912_add_job_error_code` | Error tracking for jobs |
| `20260129103338_add_matter_status` | Matter status enum |
| `20260130111854_add_document_source` | Document source tracking + backfill |
| `20260202043351_add_two_factor_auth` | 2FA support |
| `20260203000000_update_bulk_approval_to_reviewed` | Status backfill migration |
| `20260205043935_add_session_last_activity` | SOC 2 session tracking |
| `20260210125354_add_indexes` | Performance indexes |
| `20260212033140_add_document_error_code` | Document error codes |

### Data Migrations

Not all migrations are schema-only. Some include SQL backfill logic:

**`20260203000000_update_bulk_approval_to_reviewed`:**
```sql
UPDATE "Document"
SET
  status = 'REVIEWED',
  metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
    'bulkApproved', true,
    'bulkApprovedAt', now()::text
  )
WHERE status = 'UNVERIFIED';
```

**`20260130111854_add_document_source`:**
```sql
UPDATE "Document" SET "source" = 'MERUSCASE' WHERE "uploadedBy" LIKE 'MerusCase%';
UPDATE "Document" SET "source" = 'EMAIL' WHERE "source" IS NULL AND "uploadedBy" LIKE '%email attachment%';
UPDATE "Document" SET "source" = 'MAILROOM' WHERE "source" IS NULL AND "matterId" IS NULL;
UPDATE "Document" SET "source" = 'UPLOAD' WHERE "source" IS NULL;
```

These data migrations ensure existing rows get correct values when new columns are added, preventing NULL/default mismatches in production data.

---

## 6. PgBouncer Connection Pooling

### Why PgBouncer?

Cloud SQL has a limited number of connections (~100 for standard instances). With a monolith app + 3 Temporal workers + CI/CD pipelines, connection exhaustion is a real risk. PgBouncer multiplexes many app connections over fewer database connections.

### Configuration

**`pgbouncer.ini.template`:**

```ini
[databases]
* = host=/cloudsql/${CLOUD_SQL_INSTANCE_CONNECTION_NAME} port=5432

[pgbouncer]
listen_addr = 127.0.0.1
listen_port = 6432
auth_type = trust
pool_mode = ${PGBOUNCER_POOL_MODE}
max_client_conn = ${PGBOUNCER_MAX_CLIENT_CONN}
default_pool_size = ${PGBOUNCER_DEFAULT_POOL_SIZE}
min_pool_size = ${PGBOUNCER_MIN_POOL_SIZE}
reserve_pool_size = ${PGBOUNCER_RESERVE_POOL_SIZE}
```

### Production Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `pool_mode` | `transaction` | Release connection after each transaction (not session) |
| `max_client_conn` | 200 | Max app-side connections accepted |
| `default_pool_size` | 20 | Active connections to PostgreSQL per pool |
| `min_pool_size` | 5 | Always keep 5 warm connections |
| `reserve_pool_size` | 5 | Extra connections for burst traffic |

### Docker Entrypoint Integration

**`docker-entrypoint.sh`** starts PgBouncer conditionally:

```bash
if [ -n "$CLOUD_SQL_INSTANCE_CONNECTION_NAME" ]; then
  # Generate pgbouncer.ini from template with envsubst
  envsubst < /etc/pgbouncer/pgbouncer.ini.template > /etc/pgbouncer/pgbouncer.ini

  # Start PgBouncer as daemon
  runuser -u pgbouncer -- /usr/sbin/pgbouncer -d /etc/pgbouncer/pgbouncer.ini
fi
```

PgBouncer only starts when `CLOUD_SQL_INSTANCE_CONNECTION_NAME` is set (production/staging). Local development connects directly to PostgreSQL.

### Connection Flow

```
Production:
  App (port 3000) → PgBouncer (127.0.0.1:6432) → Cloud SQL Proxy (Unix socket) → Cloud SQL

Local Development:
  App (port 3000) → PostgreSQL (localhost:5432)
```

---

## 7. CI/CD Database Operations

### Migration Deployment Pipeline

```
Push to main/staging
  → GitHub Actions: deployment.yml
    → Build Docker image
    → Push to Artifact Registry
    → Install Cloud SQL Proxy
    → Start proxy on port 5432
    → Wait 10s for proxy readiness
    → npx prisma migrate status
    → npx prisma migrate deploy
      → If P3009 error → auto-resolve → retry
    → Deploy Cloud Run services
    → Deploy Temporal workers
```

### Cloud SQL Proxy in CI/CD

GitHub Actions can't connect to Cloud SQL directly. The Cloud SQL Proxy creates a local TCP tunnel:

```yaml
- name: Install Cloud SQL Proxy
  run: |
    curl -o cloud-sql-proxy https://storage.googleapis.com/.../cloud-sql-proxy.linux.amd64
    chmod +x cloud-sql-proxy

- name: Run migrations
  run: |
    ./cloud-sql-proxy ${{ secrets.CLOUD_SQL_INSTANCE_CONNECTION_NAME }} --port 5432 &
    PROXY_PID=$!
    sleep 10
    npx prisma migrate deploy
    kill $PROXY_PID
```

### P3009 Error Auto-Resolution

**What is P3009?** A Prisma error meaning "a previously failed migration is blocking deployment." This happens when a migration ran partially and left the database in an inconsistent state.

**Automated handling in `deployment.yml`:**

```yaml
DEPLOY_OUTPUT=$(npx prisma migrate deploy 2>&1 || echo "DEPLOY_FAILED")

if echo "$DEPLOY_OUTPUT" | grep -q "P3009"; then
  # Extract failed migration name from error output
  FAILED_MIGRATION=$(echo "$DEPLOY_OUTPUT" | grep "migration started at.*failed" |
                     sed -E 's/.*`([0-9]{14}_[^`]+)`.*/\1/' | head -1)

  if [[ -n "$FAILED_MIGRATION" && "$FAILED_MIGRATION" =~ ^[0-9]{14}_ ]]; then
    # Mark as rolled back (tells Prisma to skip it)
    npx prisma migrate resolve --rolled-back "$FAILED_MIGRATION"

    # Retry deployment
    npx prisma migrate deploy
  fi
fi
```

This eliminates manual intervention for the most common migration failure mode.

### Database Seeding (`db-seed.yml`)

A separate workflow seeds test data into staging:

```yaml
- name: Seed database
  run: |
    ./cloud-sql-proxy "${{ secrets.CLOUD_SQL_INSTANCE_CONNECTION_NAME }}" --port 5432 &
    sleep 10

    # Safety check: refuse to seed if migrations aren't current
    migrate_output=$(npx prisma migrate status 2>&1 || true)
    if echo "${migrate_output}" | grep -q "Database schema is up to date"; then
      npm run db:seed
    else
      echo "Schema not up to date. Refusing to seed."
      exit 1
    fi
```

---

## 8. Seeding

**Location:** `prisma/seed.ts`
**Command:** `npm run db:seed`

### Seed Data

| Entity | Count | Details |
|--------|-------|---------|
| Users | 4 | 3 attorneys + 1 clerk |
| Law Firm | 1 | "Smith & Associates" |
| Memberships | 4 | ADMIN, ATTORNEY, CLERK roles |
| Matters | 3 | CA Workers' Comp cases |
| Claims | Per matter | Linked to matters |
| Documents | Per matter | Linked to matters |
| Events | 18 + 5 + 0 | Matter 1: 18, Matter 2: 5, Matter 3: 0 |

**Notable behaviors:**
- Creates users via BetterAuth API (not raw Prisma inserts) for proper password hashing
- Forces `emailVerified: true` to skip verification in dev
- Initializes GCS bucket before seeding documents
- Environment variable `SKIP_EMAIL_VERIFICATION=true` suppresses email sending

---

## 9. Indexing Strategy

### Performance-Critical Indexes

The `20260210125354_add_indexes` migration added targeted composite indexes:

```sql
-- Document queries by status + source (mailroom, review queues)
CREATE INDEX "Document_status_source_idx" ON "Document"("status", "source");

-- Job worker polling (most critical for background processing)
CREATE INDEX "Job_type_status_updatedAt_idx" ON "Job"("type", "status", "updatedAt");
CREATE INDEX "Job_type_status_nextRetryAt_idx" ON "Job"("type", "status", "nextRetryAt");
CREATE INDEX "Job_status_attempts_idx" ON "Job"("status", "attempts");
```

### Most-Indexed Tables

| Table | Index Count | Reason |
|-------|-------------|--------|
| **Job** | 6 | Worker polling optimization — queries run every few seconds |
| **Document** | 7 | High-volume table, filtered by status/type/firm |
| **ChatSession** | 3 | Pagination and lookup by matter/draft |
| **WorkflowRule** | 3 | Trigger matching on document events |

### Total: 82 indexes/constraints across all tables

Includes `@@index`, `@@unique`, and `@@map` directives in the Prisma schema.

---

## 10. Schema Design Patterns

### Multi-Tenancy via `lawFirmId`

Every tenant-scoped model includes a `lawFirmId` foreign key:

```prisma
model Matter {
  lawFirmId String
  lawFirm   LawFirm @relation(fields: [lawFirmId], references: [id], onDelete: Cascade)
}
```

All queries filter by `lawFirmId` at the application layer. There is no row-level security in PostgreSQL — isolation is enforced in Fastify middleware.

### Status Enums Instead of Soft Deletes

No `deletedAt` timestamps. Records transition through status enums:

```prisma
status DocumentStatus @default(PROCESSING)  // FAILED = effectively deleted
status JobStatus       @default(PENDING)    // CANCELLED = effectively deleted
```

This simplifies queries (no `WHERE deletedAt IS NULL` everywhere) and provides richer lifecycle tracking.

### Cascade Deletes for Referential Integrity

```prisma
// Deleting a law firm cascades to all its data
lawFirm LawFirm @relation(fields: [lawFirmId], references: [id], onDelete: Cascade)

// Deleting a matter cascades to documents, events, drafts
matter Matter @relation(fields: [matterId], references: [id], onDelete: Cascade)

// Removing an attorney sets the reference to null (doesn't delete the matter)
attorney LawFirmMember? @relation(fields: [attorneyId], references: [id], onDelete: SetNull)
```

### JSON Metadata for Flexibility

```prisma
metadata Json?  // Used on Matter, Document, Job, Integration
```

- `Matter.metadata` — MerusCase IDs, custom fields from integrations
- `Document.metadata` — Bulk approval timestamps, OCR confidence scores
- `Job.metadata` — Temporal workflow IDs, retry context, parameters

Avoids schema changes for integration-specific or evolving data.

---

## 11. Temporal Integration

### Architecture

Temporal Cloud manages workflow orchestration **outside** the app database. The app DB only stores job metadata that links to Temporal workflows.

```
App DB (PostgreSQL)          Temporal Cloud
┌─────────────┐             ┌──────────────────┐
│ Job table    │─ metadata ─→│ Workflow History  │
│ (status,     │  contains   │ (execution state, │
│  attempts,   │  workflowId │  retries, signals)│
│  metadata)   │             │                   │
└─────────────┘             └──────────────────┘
```

### Worker Pools

| Worker | Cloud Run Service | Resources | Purpose |
|--------|-------------------|-----------|---------|
| MerusCase Import | `temporal-worker-meruscase` | 1Gi RAM, 1 CPU | Sync cases from MerusCase |
| OCR Processing | `temporal-worker-ocr` | 2Gi RAM, 2 CPU | Document AI OCR extraction |
| Event Generation | `temporal-worker-events` | 1Gi RAM, 1 CPU | Timeline event generation |

Each worker is a separate Cloud Run service with its own scaling configuration, all connecting to the same PostgreSQL database via PgBouncer.

### Worker Source Structure

```
server/temporal/
├── meruscase/
│   ├── worker.ts
│   ├── workflows.ts
│   └── activities.ts
├── ocr/
│   ├── worker.ts
│   ├── workflows.ts
│   └── activities.ts
└── events/
    ├── worker.ts
    ├── workflows.ts
    └── activities.ts
```

---

## 12. Infrastructure Per Environment

### Production

| Resource | Value |
|----------|-------|
| GCP Project | `adjudica-production` |
| Region | us-west2 |
| Cloud SQL Instance | `adjudica-prod-postgres` |
| Cloud Run (app) | 8Gi RAM, 4 CPU, min 1 / max 20 instances |
| Cloud Run (workers) | 1-2Gi RAM, 1-2 CPU, fixed 1 instance each |
| PgBouncer | Transaction mode, 200 max connections, 20 pool size |

### Staging

| Resource | Value |
|----------|-------|
| GCP Project | `adjudica-app-473308` |
| Region | us-west2 |
| Cloud SQL Instance | `adjudica-staging-postgres` |
| Cloud Run (app) | Same config as production |
| Cloud Run (workers) | Same config as production |

### Local Development

| Resource | Value |
|----------|-------|
| Database | Docker: `pgvector/pgvector:pg16` on port 5432 |
| Object Storage | GCS (via service account credentials) |
| Temporal | Separate docker-compose (`temporal:up`) |
| PgBouncer | Not used (direct connection) |

---

## 13. Secrets Management

### Production Secrets (22+)

Stored in **GCP Secret Manager**, injected at deploy time via `gcloud run deploy --set-secrets`:

| Category | Secrets |
|----------|---------|
| **Database** | `DATABASE_URL`, `DIRECT_URL`, `PGBOUNCER_DATABASE_URL` |
| **Auth** | `BETTER_AUTH_SECRET` |
| **AI Providers** | `GEMINI_API_KEY`, `GOOGLE_API_KEY` |
| **Storage** | `GCS_BUCKET`, `GOOGLE_APPLICATION_CREDENTIALS` |
| **Integrations** | `MERUSCASE_CLIENT_ID`, `MERUSCASE_CLIENT_SECRET`, `TEMPORAL_API_KEY` |
| **Observability** | `LANGFUSE_SECRET_KEY`, `LANGFUSE_PUBLIC_KEY`, `SENTRY_AUTH_TOKEN` |
| **Email** | `RESEND_API_KEY` |

Secret **names** are committed to git in `.github/environments/{env}.secrets`. Secret **values** never touch git.

---

## 14. Docker Compose (Local Development)

```yaml
services:
  postgres:
    image: pgvector/pgvector:pg16
    ports: ["5432:5432"]
    volumes: [adjudica_ai_app_postgres_data:/var/lib/postgresql/data]

  pgbouncer:              # Available but not used in local dev
    image: pgbouncer/pgbouncer:latest
    ports: ["6432:6432"]

  # Note: Production uses GCP Cloud Storage directly.
  # Local dev uses GCS emulator or direct GCS access with service account credentials.

  adjudica-app:           # Optional (profile: app)
    build: .
    ports: ["3000:3000"]
```

**Typical local workflow:**
```bash
docker-compose up -d           # Start postgres
npm run dev                    # App outside Docker (hot reload)
npm run temporal:up            # Temporal server (separate compose)
npm run workers                # All 3 Temporal workers
```

---

## Summary

The Adjudica AI App's database layer is built for a production legal SaaS platform handling sensitive case data. Key architectural choices:

1. **Prisma with versioned migrations** — Full audit trail, CI validation, automated rollback
2. **pgvector** — AI-native with semantic search over documents and timeline events
3. **PgBouncer** — Connection pooling for Cloud Run's ephemeral instances + Temporal workers
4. **Dual URL pattern** — Pooled connections for app queries, direct connections for migrations
5. **Status enums over soft deletes** — Simpler queries, richer lifecycle tracking
6. **JSON metadata** — Flexible extension points without schema changes
7. **Cascade deletes** — Referential integrity with firm-level data isolation
8. **P3009 auto-resolution** — Self-healing migration pipeline in CI/CD
9. **Temporal Cloud** — Workflow state external to app DB, linked via Job metadata
10. **10-migration staging buffer** — Migrations validated in staging before production promotion

---

@Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
