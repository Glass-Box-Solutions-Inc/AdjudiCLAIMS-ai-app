// @Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
/**
 * Data retention service.
 *
 * Enforces the 7-year data retention policy for California Workers'
 * Compensation claim records AND audit event records.
 *
 * Regulatory basis:
 * - Cal. Lab. Code § 3762: insurers must retain claim files for minimum 5 years
 *   after claim closure date or final payment, whichever is later.
 * - HIPAA §164.530(j): audit documentation must be retained for 6 years from
 *   creation date or last effective date, whichever is later.
 * - Cal. Lab. Code § 4903.05: workers' compensation adjudication records.
 * - We use 7 years (plus a 90-day grace period) for an additional safety margin.
 *
 * Claim retention logic:
 * - Only closed claims (dateClosed != null) are eligible for purge.
 * - The claim's closedAt date must be older than retentionYears.
 * - Claims already soft-deleted (deletedAt != null) are excluded.
 * - A 90-day grace period (gracePeriodDays) is applied before purge executes.
 *
 * Audit event retention logic:
 * - Each AuditEvent has a retentionExpiresAt field set 7 years from creation.
 * - Records MUST be retained until retentionExpiresAt.
 * - Records are ELIGIBLE for purge after retentionExpiresAt.
 * - purgeExpiredAuditEvents() re-validates expiry before any deletion (race guard).
 * - NOTE: The DB-level append-only trigger (20260420_audit_append_only) blocks
 *   normal ORM DELETE operations. purgeExpiredAuditEvents() uses $executeRaw
 *   to bypass the trigger with explicit authorization (authorized retention purge only).
 *
 * What is purged (hard-delete) for claims:
 * - DocumentChunks → Documents → ChatSessions for the eligible claims
 * - The Claim records themselves
 *
 * What is retained regardless of claim purge:
 * - RegulatoryDeadline records (compliance evidence)
 * - BenefitPayment records (financial records)
 *
 * What is purged separately (audit events only, after 7-year window):
 * - AuditEvent records past their retentionExpiresAt date
 */

import { prisma } from '../db.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RetentionPolicy {
  /** Number of years after claim closure before records are eligible for purge. Default: 7 */
  retentionYears: number;
  /** Days of grace period after retention date before purge is authorized. Default: 90 */
  gracePeriodDays: number;
}

export interface ExpiredRecordSet {
  claims: string[];
  documents: string[];
  chatSessions: string[];
}

export interface PurgeResult {
  purgedClaims: number;
  purgedDocuments: number;
  purgedChunks: number;
  purgedChatSessions: number;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_POLICY: RetentionPolicy = {
  retentionYears: 7,
  gracePeriodDays: 90,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Compute the cutoff date before which a closed claim is eligible for purge.
 * cutoff = now - retentionYears - gracePeriodDays
 */
function computeCutoffDate(policy: RetentionPolicy): Date {
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - policy.retentionYears);
  cutoff.setDate(cutoff.getDate() - policy.gracePeriodDays);
  return cutoff;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Identify records that have exceeded the retention window and are eligible
 * for purge. Does NOT perform any deletion.
 *
 * Eligible claims must satisfy ALL of:
 * 1. dateClosed is not null (claim must be formally closed)
 * 2. dateClosed < cutoff date (past retention + grace period)
 * 3. deletedAt is null (not already soft-deleted)
 */
export async function identifyExpiredRecords(
  policy?: Partial<RetentionPolicy>,
): Promise<ExpiredRecordSet> {
  const resolvedPolicy: RetentionPolicy = { ...DEFAULT_POLICY, ...policy };
  const cutoffDate = computeCutoffDate(resolvedPolicy);

  // Find eligible claims
  const expiredClaims = await prisma.claim.findMany({
    where: {
      dateClosed: {
        not: null,
        lt: cutoffDate,
      },
      deletedAt: null,
    },
    select: { id: true },
  });

  const claimIds = expiredClaims.map((c) => c.id);

  if (claimIds.length === 0) {
    return { claims: [], documents: [], chatSessions: [] };
  }

  // Find documents on those claims
  const expiredDocuments = await prisma.document.findMany({
    where: { claimId: { in: claimIds } },
    select: { id: true },
  });

  // Find chat sessions on those claims
  const expiredChatSessions = await prisma.chatSession.findMany({
    where: { claimId: { in: claimIds } },
    select: { id: true },
  });

  return {
    claims: claimIds,
    documents: expiredDocuments.map((d) => d.id),
    chatSessions: expiredChatSessions.map((s) => s.id),
  };
}

/**
 * Hard-purge expired claim records.
 *
 * Purge order respects referential integrity:
 * 1. DocumentChunks (FK → Document)
 * 2. Documents
 * 3. ChatMessages (FK → ChatSession, cascade-deleted with session)
 * 4. ChatSessions
 * 5. InvestigationItems (FK → Claim)
 * 6. WorkflowProgress (FK → Claim)
 * 7. TimelineEvents (FK → Claim)
 * 8. RegulatoryDeadlines — SKIPPED (compliance evidence, retained)
 * 9. BenefitPayments — SKIPPED (financial records, retained)
 * 10. AuditEvents — NEVER purged (immutable by law)
 * 11. Claims
 *
 * @param claimIds - Array of claim IDs returned by identifyExpiredRecords()
 */
export async function purgeExpiredRecords(claimIds: string[]): Promise<PurgeResult> {
  if (claimIds.length === 0) {
    return {
      purgedClaims: 0,
      purgedDocuments: 0,
      purgedChunks: 0,
      purgedChatSessions: 0,
    };
  }

  // Validate: re-check that all claims still meet eligibility criteria.
  // This guards against race conditions between identify and purge calls.
  const cutoffDate = computeCutoffDate(DEFAULT_POLICY);
  const eligibleClaims = await prisma.claim.findMany({
    where: {
      id: { in: claimIds },
      dateClosed: {
        not: null,
        lt: cutoffDate,
      },
      deletedAt: null,
    },
    select: { id: true },
  });

  const eligibleIds = eligibleClaims.map((c) => c.id);
  if (eligibleIds.length === 0) {
    return {
      purgedClaims: 0,
      purgedDocuments: 0,
      purgedChunks: 0,
      purgedChatSessions: 0,
    };
  }

  // Find document IDs so we can purge chunks first
  const documents = await prisma.document.findMany({
    where: { claimId: { in: eligibleIds } },
    select: { id: true },
  });
  const documentIds = documents.map((d) => d.id);

  // Purge in dependency order using a transaction
  const [chunksResult, docsResult, chatSessionsResult, , , claimsResult] =
    await prisma.$transaction([
      // 1. Document chunks
      prisma.documentChunk.deleteMany({
        where: { documentId: { in: documentIds } },
      }),
      // 2. Documents (extracted fields and timeline events cascade via FK)
      prisma.document.deleteMany({
        where: { id: { in: documentIds } },
      }),
      // 3. Chat sessions (messages cascade via FK onDelete: Cascade)
      prisma.chatSession.deleteMany({
        where: { claimId: { in: eligibleIds } },
      }),
      // 4. Investigation items
      prisma.investigationItem.deleteMany({
        where: { claimId: { in: eligibleIds } },
      }),
      // 5. Workflow progress
      prisma.workflowProgress.deleteMany({
        where: { claimId: { in: eligibleIds } },
      }),
      // 6. Claims
      // NOTE: AuditEvent, RegulatoryDeadline, BenefitPayment are intentionally
      //       NOT included — they are retained per legal requirements.
      prisma.claim.deleteMany({
        where: { id: { in: eligibleIds } },
      }),
    ]);

  return {
    purgedClaims: claimsResult.count,
    purgedDocuments: docsResult.count,
    purgedChunks: chunksResult.count,
    purgedChatSessions: chatSessionsResult.count,
  };
}

// ---------------------------------------------------------------------------
// Audit Event Retention (AJC-6 — Phase 7 hardening)
// ---------------------------------------------------------------------------

/**
 * Identify audit event IDs whose 7-year retention window has expired.
 *
 * These records are ELIGIBLE for deletion — they have been retained for the
 * required minimum period under HIPAA §164.530(j) and Cal. Lab. Code § 4903.05.
 *
 * This function does NOT perform any deletions. Call purgeExpiredAuditEvents()
 * with the returned IDs to execute the actual purge (requires explicit authorization).
 *
 * @param asOfDate - The reference date for the expiry check. Defaults to now().
 * @returns Array of AuditEvent IDs whose retentionExpiresAt < asOfDate
 */
export async function identifyExpiredAuditEvents(asOfDate?: Date): Promise<string[]> {
  const referenceDate = asOfDate ?? new Date();

  const expiredEvents = await prisma.auditEvent.findMany({
    where: {
      retentionExpiresAt: {
        lt: referenceDate,
      },
    },
    select: { id: true },
    orderBy: { retentionExpiresAt: 'asc' },
  });

  return expiredEvents.map((e) => e.id);
}

/**
 * Purge audit event records whose 7-year retention window has expired.
 *
 * IMPORTANT: The audit_events table has a DB-level append-only trigger
 * (migration 20260420_audit_append_only) that blocks all DELETE operations by
 * default. This function unlocks the trigger for its transaction by setting the
 * session-local GUC variable 'adjudica.authorized_retention_purge' = 'true'
 * before executing the DELETE. The trigger function checks this flag and permits
 * the delete only when it is set. SET LOCAL scoping ensures the bypass is confined
 * to the current transaction and cannot leak to unrelated operations.
 *
 * The double-check on retention_expires_at < NOW() in the WHERE clause prevents
 * premature deletion in race conditions where identifyExpiredAuditEvents()
 * was called before the clock crossed the expiry boundary.
 *
 * Records are processed in batches of PURGE_BATCH_SIZE to avoid exceeding
 * PostgreSQL's maximum of 65,535 bind parameters per statement.
 *
 * This function MUST only be called by an authorized retention schedule or
 * a CLAIMS_ADMIN-authenticated request. Callers are responsible for authorization.
 *
 * Regulatory basis: HIPAA §164.530(j), Cal. Lab. Code § 4903.05.
 *
 * @param auditEventIds - Array of AuditEvent IDs returned by identifyExpiredAuditEvents()
 * @returns Count of records actually deleted
 */

/** Maximum IDs per DELETE batch — keeps parameterized queries well below PostgreSQL's 65,535 limit. */
const PURGE_BATCH_SIZE = 1000;

export async function purgeExpiredAuditEvents(auditEventIds: string[]): Promise<number> {
  if (auditEventIds.length === 0) {
    return 0;
  }

  let totalDeleted = 0;

  // Process in batches to stay within PostgreSQL's bind parameter limit.
  // Each batch runs in its own transaction: the authorized_retention_purge flag
  // is SET LOCAL (transaction-scoped) so it cannot leak between batches.
  for (let i = 0; i < auditEventIds.length; i += PURGE_BATCH_SIZE) {
    const batch = auditEventIds.slice(i, i + PURGE_BATCH_SIZE);

    // Build parameterized placeholders ($1, $2, ..., $N) for the batch IDs.
    const placeholders = batch.map((_, j) => `$${j + 1}`).join(', ');

    // Execute within a transaction so SET LOCAL is scoped to this batch only.
    // SET LOCAL sets adjudica.authorized_retention_purge for the duration of
    // this transaction, signaling the audit_events_immutable() trigger to permit
    // these deletes. The trigger re-validates retention_expires_at < NOW()
    // at the row level as an additional guard.
    const deleted = await prisma.$transaction(async (tx) => {
      // Unlock the append-only trigger for this transaction only.
      await tx.$executeRawUnsafe(`SET LOCAL "adjudica.authorized_retention_purge" = 'true'`);

      // DELETE with re-validation: only records whose retention has genuinely
      // expired at purge time are deleted. This guards against race conditions
      // where identifyExpiredAuditEvents() was called just before the expiry boundary.
      return tx.$executeRawUnsafe(
        `DELETE FROM audit_events
         WHERE id IN (${placeholders})
           AND retention_expires_at < NOW()`,
        ...batch,
      );
    });

    totalDeleted += deleted;
  }

  return totalDeleted;
}
