-- @Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
-- Migration: audit_append_only
-- Adds PostgreSQL triggers that enforce append-only semantics on the audit_events table.
-- No UPDATE or DELETE operations are permitted — audit records are immutable by regulatory requirement.
--
-- Regulatory basis:
-- - HIPAA §164.530(j): audit logs must be retained and must not be altered
-- - Cal. Lab. Code § 4903.05: workers' comp records integrity requirements
-- - SOC 2 CC7.2: system monitoring requires tamper-evident audit trails
--
-- This migration is reversible: drop both triggers and the function to undo.
-- To reverse: DROP TRIGGER audit_events_no_update ON audit_events;
--              DROP TRIGGER audit_events_no_delete ON audit_events;
--              DROP FUNCTION IF EXISTS audit_events_immutable();
--
-- Authorized retention purge:
-- The purgeExpiredAuditEvents() function in data-retention.service.ts is the
-- ONLY authorized path for deleting audit records. It sets the session-local
-- GUC variable 'adjudica.authorized_retention_purge' = 'true' within a
-- transaction before executing the DELETE. This trigger checks for that flag
-- before raising. The SET LOCAL scoping ensures the bypass is transaction-scoped
-- and cannot leak to unrelated operations.

-- Create the trigger function that raises an exception for any unauthorized mutation.
-- Allows deletions only when the authorized retention purge session flag is set.
CREATE OR REPLACE FUNCTION audit_events_immutable()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  -- Allow authorized retention purge: purgeExpiredAuditEvents() sets this flag
  -- within a transaction-scoped SET LOCAL before executing the DELETE.
  IF TG_OP = 'DELETE' AND current_setting('adjudica.authorized_retention_purge', true) = 'true' THEN
    RETURN OLD;  -- Permit this delete
  END IF;

  RAISE EXCEPTION 'audit_events table is append-only: % operations are not permitted. Audit records are immutable by regulatory requirement (HIPAA §164.530(j), SOC 2 CC7.2).', TG_OP;
END;
$$;

-- Prevent UPDATE on any row in audit_events (no bypass — updates are never permitted)
CREATE TRIGGER audit_events_no_update
  BEFORE UPDATE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION audit_events_immutable();

-- Prevent unauthorized DELETE on any row in audit_events.
-- Authorized retention purges (after 7-year window) are permitted via the
-- adjudica.authorized_retention_purge session variable set by purgeExpiredAuditEvents().
CREATE TRIGGER audit_events_no_delete
  BEFORE DELETE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION audit_events_immutable();
