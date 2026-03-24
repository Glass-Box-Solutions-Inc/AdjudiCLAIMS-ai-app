-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "public";

-- CreateEnum
CREATE TYPE "organization_type" AS ENUM ('CARRIER', 'TPA', 'SELF_INSURED');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('CLAIMS_ADMIN', 'CLAIMS_SUPERVISOR', 'CLAIMS_EXAMINER');

-- CreateEnum
CREATE TYPE "claim_status" AS ENUM ('OPEN', 'UNDER_INVESTIGATION', 'ACCEPTED', 'DENIED', 'CLOSED', 'REOPENED');

-- CreateEnum
CREATE TYPE "document_type" AS ENUM ('DWC1_CLAIM_FORM', 'MEDICAL_REPORT', 'BILLING_STATEMENT', 'LEGAL_CORRESPONDENCE', 'EMPLOYER_REPORT', 'INVESTIGATION_REPORT', 'UTILIZATION_REVIEW', 'AME_QME_REPORT', 'DEPOSITION_TRANSCRIPT', 'IMAGING_REPORT', 'PHARMACY_RECORD', 'WAGE_STATEMENT', 'BENEFIT_NOTICE', 'SETTLEMENT_DOCUMENT', 'CORRESPONDENCE', 'OTHER');

-- CreateEnum
CREATE TYPE "access_level" AS ENUM ('SHARED', 'ATTORNEY_ONLY', 'EXAMINER_ONLY');

-- CreateEnum
CREATE TYPE "ocr_status" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETE', 'FAILED');

-- CreateEnum
CREATE TYPE "chat_role" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "upl_zone" AS ENUM ('GREEN', 'YELLOW', 'RED');

-- CreateEnum
CREATE TYPE "deadline_type" AS ENUM ('ACKNOWLEDGE_15DAY', 'DETERMINE_40DAY', 'TD_FIRST_14DAY', 'TD_SUBSEQUENT_14DAY', 'DELAY_NOTICE_30DAY', 'UR_PROSPECTIVE_5DAY', 'UR_RETROSPECTIVE_30DAY', 'EMPLOYER_NOTIFY_15DAY');

-- CreateEnum
CREATE TYPE "deadline_status" AS ENUM ('PENDING', 'MET', 'MISSED', 'WAIVED');

-- CreateEnum
CREATE TYPE "investigation_item_type" AS ENUM ('THREE_POINT_CONTACT_WORKER', 'THREE_POINT_CONTACT_EMPLOYER', 'THREE_POINT_CONTACT_PROVIDER', 'RECORDED_STATEMENT', 'EMPLOYER_REPORT', 'MEDICAL_RECORDS', 'DWC1_ON_FILE', 'INDEX_BUREAU_CHECK', 'AWE_VERIFIED', 'INITIAL_RESERVES_SET');

-- CreateEnum
CREATE TYPE "payment_type" AS ENUM ('TD', 'PD', 'DEATH_BENEFIT', 'SJDB_VOUCHER');

-- CreateEnum
CREATE TYPE "audit_event_type" AS ENUM ('DOCUMENT_UPLOADED', 'DOCUMENT_CLASSIFIED', 'DOCUMENT_VIEWED', 'CLAIM_CREATED', 'CLAIM_STATUS_CHANGED', 'COVERAGE_DETERMINATION', 'RESERVE_CHANGED', 'BENEFIT_CALCULATED', 'BENEFIT_PAYMENT_ISSUED', 'DEADLINE_CREATED', 'DEADLINE_MET', 'DEADLINE_MISSED', 'CHAT_MESSAGE_SENT', 'CHAT_RESPONSE_GENERATED', 'UPL_ZONE_CLASSIFICATION', 'UPL_OUTPUT_BLOCKED', 'UPL_DISCLAIMER_INJECTED', 'UPL_OUTPUT_VALIDATION_FAIL', 'COUNSEL_REFERRAL_GENERATED', 'UR_DECISION', 'INVESTIGATION_ACTIVITY', 'TRAINING_MODULE_COMPLETED', 'TRAINING_ASSESSMENT_PASSED', 'TIER1_TERM_DISMISSED', 'USER_LOGIN', 'USER_LOGOUT', 'PERMISSION_DENIED');

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "organization_type" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "role" "user_role" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claims" (
    "id" TEXT NOT NULL,
    "claim_number" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "assigned_examiner_id" TEXT NOT NULL,
    "claimant_name" TEXT NOT NULL,
    "date_of_injury" DATE NOT NULL,
    "body_parts" TEXT[],
    "employer" TEXT NOT NULL,
    "insurer" TEXT NOT NULL,
    "status" "claim_status" NOT NULL DEFAULT 'OPEN',
    "current_reserve_indemnity" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "current_reserve_medical" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "current_reserve_legal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "current_reserve_lien" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_paid_indemnity" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_paid_medical" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "date_received" TIMESTAMP(3) NOT NULL,
    "date_acknowledged" TIMESTAMP(3),
    "date_determined" TIMESTAMP(3),
    "date_closed" TIMESTAMP(3),
    "is_litigated" BOOLEAN NOT NULL DEFAULT false,
    "has_applicant_attorney" BOOLEAN NOT NULL DEFAULT false,
    "is_cumulative_trauma" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "document_type" "document_type",
    "document_subtype" TEXT,
    "classification_confidence" DOUBLE PRECISION,
    "access_level" "access_level" NOT NULL DEFAULT 'EXAMINER_ONLY',
    "contains_legal_analysis" BOOLEAN NOT NULL DEFAULT false,
    "contains_work_product" BOOLEAN NOT NULL DEFAULT false,
    "contains_privileged" BOOLEAN NOT NULL DEFAULT false,
    "ocr_status" "ocr_status" NOT NULL DEFAULT 'PENDING',
    "extracted_text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_chunks" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "chunk_index" INTEGER NOT NULL,
    "embedding" vector(768),

    CONSTRAINT "document_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extracted_fields" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "field_name" TEXT NOT NULL,
    "field_value" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "source_page" INTEGER,

    CONSTRAINT "extracted_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_events" (
    "id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "document_id" TEXT,
    "event_date" TIMESTAMP(3) NOT NULL,
    "event_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "role" "chat_role" NOT NULL,
    "content" TEXT NOT NULL,
    "upl_zone" "upl_zone",
    "was_blocked" BOOLEAN NOT NULL DEFAULT false,
    "disclaimer_applied" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_deadlines" (
    "id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "deadline_type" "deadline_type" NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" "deadline_status" NOT NULL DEFAULT 'PENDING',
    "statutory_authority" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "regulatory_deadlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investigation_items" (
    "id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "item_type" "investigation_item_type" NOT NULL,
    "is_complete" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "completed_by_id" TEXT,
    "document_id" TEXT,

    CONSTRAINT "investigation_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benefit_payments" (
    "id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "payment_type" "payment_type" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_date" DATE NOT NULL,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "is_late" BOOLEAN NOT NULL DEFAULT false,
    "penalty_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "calculation_inputs" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "benefit_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "dismissed_terms" TEXT[],
    "training_modules_completed" JSONB,
    "is_training_complete" BOOLEAN NOT NULL DEFAULT false,
    "learning_mode_expiry" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "education_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "id" TEXT NOT NULL,
    "claim_id" TEXT,
    "user_id" TEXT NOT NULL,
    "event_type" "audit_event_type" NOT NULL,
    "event_data" JSONB,
    "upl_zone" "upl_zone",
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_organization_id" ON "users"("organization_id");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_role" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "claims_claim_number_key" ON "claims"("claim_number");

-- CreateIndex
CREATE INDEX "idx_claims_organization_id" ON "claims"("organization_id");

-- CreateIndex
CREATE INDEX "idx_claims_assigned_examiner_id" ON "claims"("assigned_examiner_id");

-- CreateIndex
CREATE INDEX "idx_claims_status" ON "claims"("status");

-- CreateIndex
CREATE INDEX "idx_claims_claim_number" ON "claims"("claim_number");

-- CreateIndex
CREATE INDEX "idx_claims_date_of_injury" ON "claims"("date_of_injury");

-- CreateIndex
CREATE INDEX "idx_claims_is_litigated" ON "claims"("is_litigated");

-- CreateIndex
CREATE INDEX "idx_claims_org_status" ON "claims"("organization_id", "status");

-- CreateIndex
CREATE INDEX "idx_claims_org_examiner" ON "claims"("organization_id", "assigned_examiner_id");

-- CreateIndex
CREATE INDEX "idx_documents_claim_id" ON "documents"("claim_id");

-- CreateIndex
CREATE INDEX "idx_documents_document_type" ON "documents"("document_type");

-- CreateIndex
CREATE INDEX "idx_documents_ocr_status" ON "documents"("ocr_status");

-- CreateIndex
CREATE INDEX "idx_documents_access_level" ON "documents"("access_level");

-- CreateIndex
CREATE INDEX "idx_documents_claim_type" ON "documents"("claim_id", "document_type");

-- CreateIndex
CREATE INDEX "idx_document_chunks_document_id" ON "document_chunks"("document_id");

-- CreateIndex
CREATE INDEX "idx_document_chunks_doc_chunk_idx" ON "document_chunks"("document_id", "chunk_index");

-- CreateIndex
CREATE INDEX "idx_extracted_fields_document_id" ON "extracted_fields"("document_id");

-- CreateIndex
CREATE INDEX "idx_extracted_fields_field_name" ON "extracted_fields"("field_name");

-- CreateIndex
CREATE INDEX "idx_extracted_fields_doc_field" ON "extracted_fields"("document_id", "field_name");

-- CreateIndex
CREATE INDEX "idx_timeline_events_claim_id" ON "timeline_events"("claim_id");

-- CreateIndex
CREATE INDEX "idx_timeline_events_claim_date" ON "timeline_events"("claim_id", "event_date");

-- CreateIndex
CREATE INDEX "idx_timeline_events_event_type" ON "timeline_events"("event_type");

-- CreateIndex
CREATE INDEX "idx_chat_sessions_claim_id" ON "chat_sessions"("claim_id");

-- CreateIndex
CREATE INDEX "idx_chat_sessions_user_id" ON "chat_sessions"("user_id");

-- CreateIndex
CREATE INDEX "idx_chat_sessions_claim_user" ON "chat_sessions"("claim_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_chat_messages_session_id" ON "chat_messages"("session_id");

-- CreateIndex
CREATE INDEX "idx_chat_messages_session_created" ON "chat_messages"("session_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_chat_messages_upl_zone" ON "chat_messages"("upl_zone");

-- CreateIndex
CREATE INDEX "idx_regulatory_deadlines_claim_id" ON "regulatory_deadlines"("claim_id");

-- CreateIndex
CREATE INDEX "idx_regulatory_deadlines_due_date" ON "regulatory_deadlines"("due_date");

-- CreateIndex
CREATE INDEX "idx_regulatory_deadlines_status" ON "regulatory_deadlines"("status");

-- CreateIndex
CREATE INDEX "idx_regulatory_deadlines_claim_status" ON "regulatory_deadlines"("claim_id", "status");

-- CreateIndex
CREATE INDEX "idx_regulatory_deadlines_status_due" ON "regulatory_deadlines"("status", "due_date");

-- CreateIndex
CREATE INDEX "idx_investigation_items_claim_id" ON "investigation_items"("claim_id");

-- CreateIndex
CREATE INDEX "idx_investigation_items_is_complete" ON "investigation_items"("is_complete");

-- CreateIndex
CREATE INDEX "idx_investigation_items_claim_complete" ON "investigation_items"("claim_id", "is_complete");

-- CreateIndex
CREATE INDEX "idx_benefit_payments_claim_id" ON "benefit_payments"("claim_id");

-- CreateIndex
CREATE INDEX "idx_benefit_payments_payment_type" ON "benefit_payments"("payment_type");

-- CreateIndex
CREATE INDEX "idx_benefit_payments_payment_date" ON "benefit_payments"("payment_date");

-- CreateIndex
CREATE INDEX "idx_benefit_payments_claim_type" ON "benefit_payments"("claim_id", "payment_type");

-- CreateIndex
CREATE INDEX "idx_benefit_payments_is_late" ON "benefit_payments"("is_late");

-- CreateIndex
CREATE UNIQUE INDEX "education_profiles_user_id_key" ON "education_profiles"("user_id");

-- CreateIndex
CREATE INDEX "idx_audit_events_claim_id" ON "audit_events"("claim_id");

-- CreateIndex
CREATE INDEX "idx_audit_events_user_id" ON "audit_events"("user_id");

-- CreateIndex
CREATE INDEX "idx_audit_events_event_type" ON "audit_events"("event_type");

-- CreateIndex
CREATE INDEX "idx_audit_events_created_at" ON "audit_events"("created_at");

-- CreateIndex
CREATE INDEX "idx_audit_events_claim_event_type" ON "audit_events"("claim_id", "event_type");

-- CreateIndex
CREATE INDEX "idx_audit_events_user_event_type" ON "audit_events"("user_id", "event_type");

-- CreateIndex
CREATE INDEX "idx_audit_events_upl_zone" ON "audit_events"("upl_zone");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_assigned_examiner_id_fkey" FOREIGN KEY ("assigned_examiner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_chunks" ADD CONSTRAINT "document_chunks_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extracted_fields" ADD CONSTRAINT "extracted_fields_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_deadlines" ADD CONSTRAINT "regulatory_deadlines_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investigation_items" ADD CONSTRAINT "investigation_items_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investigation_items" ADD CONSTRAINT "investigation_items_completed_by_id_fkey" FOREIGN KEY ("completed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investigation_items" ADD CONSTRAINT "investigation_items_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefit_payments" ADD CONSTRAINT "benefit_payments_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education_profiles" ADD CONSTRAINT "education_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
