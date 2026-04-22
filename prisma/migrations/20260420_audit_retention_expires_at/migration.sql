-- @Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
-- Migration: audit_retention_expires_at
-- Adds the retention_expires_at column to audit_events.
--
-- Regulatory basis:
-- - HIPAA §164.530(j): audit logs must be retained for a minimum of 6 years
--   from the date of creation or the date when it was last in effect.
--   We apply 7 years for additional safety margin (consistent with Cal. Lab. Code § 3762
--   and the existing data-retention policy).
-- - Cal. Lab. Code § 4903.05: records related to workers' comp adjudication.
--
-- Retention semantics:
-- - Records MUST be kept until retention_expires_at.
-- - Records are ELIGIBLE for deletion after retention_expires_at.
-- - The application purgeExpiredAuditEvents() function enforces this window.
--
-- This migration is reversible:
-- To reverse: ALTER TABLE "audit_events" DROP COLUMN "retention_expires_at";
--             DROP INDEX IF EXISTS "idx_audit_events_retention_expires_at";

-- Add retention_expires_at column with default of 7 years from creation.
-- Existing rows (all dev artifacts at this stage) receive 7 years from NOW().
ALTER TABLE "audit_events"
  ADD COLUMN "retention_expires_at" TIMESTAMP(3) NOT NULL
  DEFAULT (NOW() + INTERVAL '7 years');

-- Index for efficient retention sweep queries (find all rows past their expiry)
CREATE INDEX "idx_audit_events_retention_expires_at"
  ON "audit_events"("retention_expires_at");
