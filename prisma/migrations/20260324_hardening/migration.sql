-- Phase 4.5: Production hardening migration (converted from PostgreSQL to MySQL/PlanetScale)
-- WI-1: New audit event types for document deletion and deadline waiver
--        NOTE: In MySQL, enum values are inline on the column. ALTER TYPE is a no-op here —
--        DOCUMENT_DELETED and DEADLINE_WAIVED are already included in the init migration's
--        audit_events.event_type ENUM definition. No ALTER TABLE needed.
-- WI-4: Unique constraints to prevent duplicate deadlines and investigation items per claim
--        NOTE: These unique indexes are already included in the init migration's table definitions.
--        They are retained here as no-ops for historical record accuracy.

-- Prevent duplicate deadline types per claim
-- (already created in init migration; retained for migration history)
-- CREATE UNIQUE INDEX `regulatory_deadlines_claim_id_deadline_type_key`
--   ON `regulatory_deadlines`(`claim_id`, `deadline_type`);

-- Prevent duplicate investigation item types per claim
-- (already created in init migration; retained for migration history)
-- CREATE UNIQUE INDEX `investigation_items_claim_id_item_type_key`
--   ON `investigation_items`(`claim_id`, `item_type`);

-- This migration is a no-op for MySQL/PlanetScale: all changes are folded into the init migration.
-- Kept as a placeholder to preserve the migration history chain.
SELECT 1;
