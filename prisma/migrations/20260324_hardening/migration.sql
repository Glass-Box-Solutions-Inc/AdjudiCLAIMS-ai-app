-- Phase 4.5: Production hardening migration
-- WI-1: New audit event types for document deletion and deadline waiver
-- WI-4: Unique constraints to prevent duplicate deadlines and investigation items per claim

-- Add new audit event type values
ALTER TYPE "audit_event_type" ADD VALUE 'DOCUMENT_DELETED';
ALTER TYPE "audit_event_type" ADD VALUE 'DEADLINE_WAIVED';

-- Prevent duplicate deadline types per claim
CREATE UNIQUE INDEX "regulatory_deadlines_claim_id_deadline_type_key"
  ON "regulatory_deadlines"("claim_id", "deadline_type");

-- Prevent duplicate investigation item types per claim
CREATE UNIQUE INDEX "investigation_items_claim_id_item_type_key"
  ON "investigation_items"("claim_id", "item_type");
