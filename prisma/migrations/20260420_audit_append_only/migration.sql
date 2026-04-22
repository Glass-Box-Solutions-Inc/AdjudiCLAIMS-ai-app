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

-- Create the trigger function that raises an exception for any mutation attempt
CREATE OR REPLACE FUNCTION audit_events_immutable()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_events table is append-only: % operations are not permitted. Audit records are immutable by regulatory requirement (HIPAA §164.530(j), SOC 2 CC7.2).', TG_OP;
END;
$$;

-- Prevent UPDATE on any row in audit_events
CREATE TRIGGER audit_events_no_update
  BEFORE UPDATE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION audit_events_immutable();

-- Prevent DELETE on any row in audit_events
-- NOTE: The application-layer purgeExpiredAuditEvents() function bypasses this
-- trigger by using a direct SQL statement via $executeRaw after 7-year expiry.
-- This trigger blocks all ORM-level deletes, which is the correct behavior.
CREATE TRIGGER audit_events_no_delete
  BEFORE DELETE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION audit_events_immutable();
