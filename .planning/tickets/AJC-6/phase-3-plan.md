# AJC-6 Implementation Plan
## Phase 7: Audit Trail Hardening — Append-Only, PHI Exclusion, 7-Year Retention

---

### Gap Analysis Summary

Three gaps require closure:
1. **Append-only enforcement** — No UPDATE/DELETE on `audit_events` at DB level; currently only design convention
2. **PHI exclusion** — No middleware-level stripping of PHI field names from `eventData`; relies on callers not passing PHI
3. **7-year retention configuration** — `data-retention.service.ts` explicitly skips AuditEvent purge with no tracking of when rows become eligible

---

## Step 1: DB-Level Append-Only Enforcement (Prisma Migration)

**File:** `prisma/migrations/20260420_audit_append_only/migration.sql` (new)
**File:** `prisma/schema.prisma` (add `retentionExpiresAt` field — covered in Step 5)

Add a PostgreSQL rule that rejects UPDATE and DELETE on `audit_events`:

```sql
-- Prevent any UPDATE on audit_events
CREATE OR REPLACE RULE audit_events_no_update AS
  ON UPDATE TO audit_events DO INSTEAD NOTHING;
  
-- Prevent any DELETE on audit_events (retention purge handled by application layer only after 7 years)
CREATE OR REPLACE RULE audit_events_no_delete AS
  ON DELETE TO audit_events DO INSTEAD NOTHING;
```

**Why rule not trigger:** PostgreSQL `RULE` with `DO INSTEAD NOTHING` silently rejects mutations, which is safer than a trigger that raises (which could break the TRANSACTION). Actually, we want it to RAISE so violations are caught in tests. Use a trigger instead:

```sql
CREATE OR REPLACE FUNCTION audit_events_immutable()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_events table is append-only: % operations are not permitted', TG_OP;
END;
$$;

CREATE TRIGGER audit_events_no_update
  BEFORE UPDATE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION audit_events_immutable();

CREATE TRIGGER audit_events_no_delete
  BEFORE DELETE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION audit_events_immutable();
```

This is a **new migration** in `prisma/migrations/20260420_audit_append_only/migration.sql`. No Prisma schema model change needed for the trigger itself (raw SQL migration).

---

## Step 2: Append-Only Codebase Verification Test

**File:** `tests/unit/audit-append-only.test.ts` (new)

Tests:
1. `prisma.auditEvent` mock never exposes `.update()` or `.delete()` — static code analysis via grep
2. Verify no `auditEvent.update` or `auditEvent.delete` calls in `server/` source (shell command or AST check using grep pattern)
3. Verify `logAuditEvent()` only calls `prisma.auditEvent.create()` — inspect the mock call list

The codebase scan test uses Node `fs` + a simple grep to verify no UPDATE/DELETE patterns exist on `auditEvent` in source files (this proves intent at code level; the DB trigger enforces at DB level).

---

## Step 3: PHI Exclusion — `sanitizeEventData()` in `server/middleware/audit.ts`

**File:** `server/middleware/audit.ts` (modify)

Add a `sanitizeEventData()` function that strips known PHI field names from the `eventData` object before it is written. Called inside `logAuditEvent()` before `prisma.auditEvent.create()`.

PHI deny-list (field names only — values are the risk, but stripping keys containing PHI is the defense):
```typescript
const PHI_FIELDS = new Set([
  'claimantName', 'firstName', 'lastName', 'fullName',
  'ssn', 'socialSecurityNumber', 'taxId',
  'dateOfBirth', 'dob', 'birthDate',
  'email', 'phone', 'phoneNumber', 'mobilePhone',
  'address', 'streetAddress', 'homeAddress',
  'medicalContent', 'diagnosis', 'icdCode', 'icd',
  'wpiScore', 'wpi', 'apportionment',
  'treatmentNotes', 'prognosis', 'medicalHistory',
]);
```

`sanitizeEventData()` recursively walks the object and removes keys matching the deny-list (case-insensitive comparison). Does NOT modify values — only removes PHI-named keys.

The function is exported so it can be unit-tested directly.

---

## Step 4: PHI Exclusion Tests

**File:** `tests/unit/audit-phi-exclusion.test.ts` (new)

Tests:
1. `sanitizeEventData` strips `ssn` field
2. `sanitizeEventData` strips `dateOfBirth` field  
3. `sanitizeEventData` strips `claimantName` field
4. `sanitizeEventData` strips nested PHI fields (e.g., `{ patient: { ssn: '123-45-6789' } }`)
5. `sanitizeEventData` preserves safe fields (`claimId`, `documentId`, `action`, `status`, `claimNumber`)
6. `sanitizeEventData` handles null/undefined gracefully
7. `logAuditEvent` with PHI in `eventData` — verify the stored data does not contain PHI field names (mock verify)
8. `logAuditEvent` with safe `eventData` — verify data passes through correctly

---

## Step 5: 7-Year Retention — Schema Update

**File:** `prisma/schema.prisma` (modify `AuditEvent` model)

Add `retentionExpiresAt` field:
```prisma
/// Retention expiry date — 7 years from creation (LC 4903.05 / HIPAA §164.530(j)).
/// After this date the record is eligible for deletion. Records must be KEPT until
/// this date; they may be purged afterward.
retentionExpiresAt DateTime @map("retention_expires_at")
```

Add index:
```prisma
@@index([retentionExpiresAt], map: "idx_audit_events_retention_expires_at")
```

**File:** `server/middleware/audit.ts` (modify `logAuditEvent`)

Compute `retentionExpiresAt` at creation time:
```typescript
const retentionExpiresAt = new Date(Date.now());
retentionExpiresAt.setFullYear(retentionExpiresAt.getFullYear() + 7);
```

Pass to `prisma.auditEvent.create()` call.

---

## Step 6: 7-Year Retention Migration

**File:** `prisma/migrations/20260420_audit_retention_expires_at/migration.sql` (new)

```sql
-- Add retention_expires_at column to audit_events
ALTER TABLE "audit_events" 
  ADD COLUMN "retention_expires_at" TIMESTAMP(3) NOT NULL 
  DEFAULT (NOW() + INTERVAL '7 years');

-- Index for efficient retention sweeps
CREATE INDEX "idx_audit_events_retention_expires_at" 
  ON "audit_events"("retention_expires_at");
```

The DEFAULT ensures existing rows get 7 years from current time (conservative — all existing rows are dev artifacts).

---

## Step 7: `identifyExpiredAuditEvents()` in `data-retention.service.ts`

**File:** `server/services/data-retention.service.ts` (modify)

Remove or update the "AuditEvents — NEVER purged" comment to reflect the 7-year policy: retained FOR 7 years, then eligible for deletion.

Add two new exported functions:

```typescript
/**
 * Identify audit event records that have passed their 7-year retention expiry.
 * These records are ELIGIBLE for deletion but not automatically purged.
 */
export async function identifyExpiredAuditEvents(asOfDate?: Date): Promise<string[]>

/**
 * Purge audit event records whose retentionExpiresAt has passed.
 * MUST be authorized by CLAIMS_ADMIN or automated retention system.
 * Returns count of deleted records.
 */
export async function purgeExpiredAuditEvents(auditEventIds: string[]): Promise<number>
```

The purge function validates each ID still has `retentionExpiresAt < now` before deleting (race condition guard). Since this contradicts the "never purge" policy in the existing code, we update that comment to clarify: audit events are NOT purged before 7 years, but ARE eligible after 7 years.

---

## Step 8: Retention Tests

**File:** `tests/unit/audit-retention.test.ts` (new)

Tests:
1. `identifyExpiredAuditEvents` returns IDs with `retentionExpiresAt` in the past
2. `identifyExpiredAuditEvents` excludes IDs with `retentionExpiresAt` in the future
3. `identifyExpiredAuditEvents` returns empty array when no expired records
4. `purgeExpiredAuditEvents` with empty array returns 0
5. `purgeExpiredAuditEvents` re-validates expiry before delete (no premature purge)
6. `logAuditEvent` creates record with `retentionExpiresAt` set ~7 years from now
7. Schema field `retentionExpiresAt` is indexed (verify index exists in schema)

---

## Files to Change

| Path | Change Type | Why |
|------|-------------|-----|
| `server/middleware/audit.ts` | Modify | Add `sanitizeEventData()` + `retentionExpiresAt` computation |
| `server/services/data-retention.service.ts` | Modify | Add `identifyExpiredAuditEvents()` + `purgeExpiredAuditEvents()` |
| `prisma/schema.prisma` | Modify | Add `retentionExpiresAt` field + index to `AuditEvent` model |
| `prisma/migrations/20260420_audit_append_only/migration.sql` | Create | DB trigger for append-only enforcement |
| `prisma/migrations/20260420_audit_retention_expires_at/migration.sql` | Create | Add `retention_expires_at` column + index |
| `tests/unit/audit-append-only.test.ts` | Create | Verify no UPDATE/DELETE paths on AuditEvent |
| `tests/unit/audit-phi-exclusion.test.ts` | Create | Verify PHI fields are stripped from eventData |
| `tests/unit/audit-retention.test.ts` | Create | Verify 7-year retention identification + purge |

---

## Tests to Write

| Test Name | Type | Coverage |
|-----------|------|---------|
| audit-append-only.test.ts | Unit | No update/delete code paths on auditEvent; immutable by convention |
| audit-phi-exclusion.test.ts | Unit | sanitizeEventData strips PHI fields; logAuditEvent does not persist PHI |
| audit-retention.test.ts | Unit | identifyExpiredAuditEvents; purgeExpiredAuditEvents; retentionExpiresAt set at creation |

---

## Risk Flags

1. **Migration irreversibility**: DB triggers can be dropped; `retention_expires_at` column can be dropped. Both reversible.
2. **Existing test impact**: The `audit.test.ts` and `soc2-compliance/audit-trail.test.ts` mock `prisma.auditEvent.create` — adding `retentionExpiresAt` to the create call will require updating the mock shape in those tests to include `retention_expires_at` in the mock return. The mocks return `{ id: 'ae-new' }` which is fine — mock returns don't need the full shape.
3. **`purgeExpiredAuditEvents` vs. existing "never purge" design**: The existing comment says "AuditEvents — NEVER purged (immutable by law)". The corrected position is: retained FOR 7 years (HIPAA §164.530(j) minimum), eligible for deletion after. Update the comment, not the logic — function is gated by expiry check.
4. **No existing `retentionExpiresAt` on existing rows**: The migration DEFAULT clause (`NOW() + INTERVAL '7 years'`) handles this for dev/staging. Production would need all existing rows dated correctly — acceptable since system has no production users.
