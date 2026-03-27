-- MySQL / PlanetScale migration (converted from PostgreSQL)
-- provider: mysql, relationMode: prisma
-- All FK constraints removed — PlanetScale emulates FKs via Prisma client.
-- pgvector extension, CREATE TYPE enums, and FOREIGN KEY constraints omitted.
-- Phase 10 models (GeneratedLetter, CounselReferral, Lien, LienLineItem,
-- WorkflowProgress, TimelineEvent) are included in this baseline init.

-- CreateTable
CREATE TABLE `organizations` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('CARRIER', 'TPA', 'SELF_INSURED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `organization_id` VARCHAR(191) NOT NULL,
    `role` ENUM('CLAIMS_ADMIN', 'CLAIMS_SUPERVISOR', 'CLAIMS_EXAMINER') NOT NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `idx_users_organization_id`(`organization_id`),
    INDEX `idx_users_email`(`email`),
    INDEX `idx_users_role`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `claims` (
    `id` VARCHAR(191) NOT NULL,
    `claim_number` VARCHAR(191) NOT NULL,
    `organization_id` VARCHAR(191) NOT NULL,
    `assigned_examiner_id` VARCHAR(191) NOT NULL,
    `claimant_name` VARCHAR(191) NOT NULL,
    `date_of_injury` DATE NOT NULL,
    `body_parts` JSON NOT NULL,
    `employer` VARCHAR(191) NOT NULL,
    `insurer` VARCHAR(191) NOT NULL,
    `status` ENUM('OPEN', 'UNDER_INVESTIGATION', 'ACCEPTED', 'DENIED', 'CLOSED', 'REOPENED') NOT NULL DEFAULT 'OPEN',
    `current_reserve_indemnity` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `current_reserve_medical` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `current_reserve_legal` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `current_reserve_lien` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `total_paid_indemnity` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `total_paid_medical` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `date_received` DATETIME(3) NOT NULL,
    `date_acknowledged` DATETIME(3),
    `date_determined` DATETIME(3),
    `date_closed` DATETIME(3),
    `is_litigated` TINYINT(1) NOT NULL DEFAULT 0,
    `has_applicant_attorney` TINYINT(1) NOT NULL DEFAULT 0,
    `is_cumulative_trauma` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `claims_claim_number_key`(`claim_number`),
    INDEX `idx_claims_organization_id`(`organization_id`),
    INDEX `idx_claims_assigned_examiner_id`(`assigned_examiner_id`),
    INDEX `idx_claims_status`(`status`),
    INDEX `idx_claims_claim_number`(`claim_number`),
    INDEX `idx_claims_date_of_injury`(`date_of_injury`),
    INDEX `idx_claims_is_litigated`(`is_litigated`),
    INDEX `idx_claims_org_status`(`organization_id`, `status`),
    INDEX `idx_claims_org_examiner`(`organization_id`, `assigned_examiner_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documents` (
    `id` VARCHAR(191) NOT NULL,
    `claim_id` VARCHAR(191) NOT NULL,
    `file_name` VARCHAR(191) NOT NULL,
    `file_url` TEXT NOT NULL,
    `file_size` INT NOT NULL,
    `mime_type` VARCHAR(191) NOT NULL,
    `document_type` ENUM('DWC1_CLAIM_FORM', 'MEDICAL_REPORT', 'BILLING_STATEMENT', 'LEGAL_CORRESPONDENCE', 'EMPLOYER_REPORT', 'INVESTIGATION_REPORT', 'UTILIZATION_REVIEW', 'AME_QME_REPORT', 'DEPOSITION_TRANSCRIPT', 'IMAGING_REPORT', 'PHARMACY_RECORD', 'WAGE_STATEMENT', 'BENEFIT_NOTICE', 'SETTLEMENT_DOCUMENT', 'CORRESPONDENCE', 'OTHER', 'WCAB_FILING', 'LIEN_CLAIM', 'DISCOVERY_REQUEST', 'RETURN_TO_WORK', 'PAYMENT_RECORD', 'DWC_OFFICIAL_FORM', 'WORK_PRODUCT', 'MEDICAL_CHRONOLOGY', 'CLAIM_ADMINISTRATION'),
    `document_subtype` VARCHAR(191),
    `classification_confidence` DOUBLE,
    `access_level` ENUM('SHARED', 'ATTORNEY_ONLY', 'EXAMINER_ONLY') NOT NULL DEFAULT 'EXAMINER_ONLY',
    `contains_legal_analysis` TINYINT(1) NOT NULL DEFAULT 0,
    `contains_work_product` TINYINT(1) NOT NULL DEFAULT 0,
    `contains_privileged` TINYINT(1) NOT NULL DEFAULT 0,
    `ocr_status` ENUM('PENDING', 'PROCESSING', 'COMPLETE', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `extracted_text` LONGTEXT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_documents_claim_id`(`claim_id`),
    INDEX `idx_documents_document_type`(`document_type`),
    INDEX `idx_documents_ocr_status`(`ocr_status`),
    INDEX `idx_documents_access_level`(`access_level`),
    INDEX `idx_documents_claim_type`(`claim_id`, `document_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `document_chunks` (
    `id` VARCHAR(191) NOT NULL,
    `document_id` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `chunk_index` INT NOT NULL,

    INDEX `idx_document_chunks_document_id`(`document_id`),
    INDEX `idx_document_chunks_doc_chunk_idx`(`document_id`, `chunk_index`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `extracted_fields` (
    `id` VARCHAR(191) NOT NULL,
    `document_id` VARCHAR(191) NOT NULL,
    `field_name` VARCHAR(191) NOT NULL,
    `field_value` TEXT NOT NULL,
    `confidence` DOUBLE NOT NULL,
    `source_page` INT,

    INDEX `idx_extracted_fields_document_id`(`document_id`),
    INDEX `idx_extracted_fields_field_name`(`field_name`),
    INDEX `idx_extracted_fields_doc_field`(`document_id`, `field_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `timeline_events` (
    `id` VARCHAR(191) NOT NULL,
    `claim_id` VARCHAR(191) NOT NULL,
    `document_id` VARCHAR(191),
    `event_date` DATETIME(3) NOT NULL,
    `event_type` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `source` VARCHAR(191) NOT NULL,

    INDEX `idx_timeline_events_claim_id`(`claim_id`),
    INDEX `idx_timeline_events_claim_date`(`claim_id`, `event_date`),
    INDEX `idx_timeline_events_event_type`(`event_type`),
    INDEX `idx_timeline_events_document_id`(`document_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `claim_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_chat_sessions_claim_id`(`claim_id`),
    INDEX `idx_chat_sessions_user_id`(`user_id`),
    INDEX `idx_chat_sessions_claim_user`(`claim_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_messages` (
    `id` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'ASSISTANT', 'SYSTEM') NOT NULL,
    `content` TEXT NOT NULL,
    `upl_zone` ENUM('GREEN', 'YELLOW', 'RED'),
    `was_blocked` TINYINT(1) NOT NULL DEFAULT 0,
    `disclaimer_applied` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_chat_messages_session_id`(`session_id`),
    INDEX `idx_chat_messages_session_created`(`session_id`, `created_at`),
    INDEX `idx_chat_messages_upl_zone`(`upl_zone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `regulatory_deadlines` (
    `id` VARCHAR(191) NOT NULL,
    `claim_id` VARCHAR(191) NOT NULL,
    `deadline_type` ENUM('ACKNOWLEDGE_15DAY', 'DETERMINE_40DAY', 'TD_FIRST_14DAY', 'TD_SUBSEQUENT_14DAY', 'DELAY_NOTICE_30DAY', 'UR_PROSPECTIVE_5DAY', 'UR_RETROSPECTIVE_30DAY', 'EMPLOYER_NOTIFY_15DAY') NOT NULL,
    `due_date` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'MET', 'MISSED', 'WAIVED') NOT NULL DEFAULT 'PENDING',
    `statutory_authority` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completed_at` DATETIME(3),

    INDEX `idx_regulatory_deadlines_claim_id`(`claim_id`),
    INDEX `idx_regulatory_deadlines_due_date`(`due_date`),
    INDEX `idx_regulatory_deadlines_status`(`status`),
    INDEX `idx_regulatory_deadlines_claim_status`(`claim_id`, `status`),
    INDEX `idx_regulatory_deadlines_status_due`(`status`, `due_date`),
    UNIQUE INDEX `regulatory_deadlines_claim_id_deadline_type_key`(`claim_id`, `deadline_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `investigation_items` (
    `id` VARCHAR(191) NOT NULL,
    `claim_id` VARCHAR(191) NOT NULL,
    `item_type` ENUM('THREE_POINT_CONTACT_WORKER', 'THREE_POINT_CONTACT_EMPLOYER', 'THREE_POINT_CONTACT_PROVIDER', 'RECORDED_STATEMENT', 'EMPLOYER_REPORT', 'MEDICAL_RECORDS', 'DWC1_ON_FILE', 'INDEX_BUREAU_CHECK', 'AWE_VERIFIED', 'INITIAL_RESERVES_SET') NOT NULL,
    `is_complete` TINYINT(1) NOT NULL DEFAULT 0,
    `completed_at` DATETIME(3),
    `completed_by_id` VARCHAR(191),
    `document_id` VARCHAR(191),

    INDEX `idx_investigation_items_claim_id`(`claim_id`),
    INDEX `idx_investigation_items_is_complete`(`is_complete`),
    INDEX `idx_investigation_items_claim_complete`(`claim_id`, `is_complete`),
    INDEX `idx_investigation_items_completed_by_id`(`completed_by_id`),
    INDEX `idx_investigation_items_document_id`(`document_id`),
    UNIQUE INDEX `investigation_items_claim_id_item_type_key`(`claim_id`, `item_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `benefit_payments` (
    `id` VARCHAR(191) NOT NULL,
    `claim_id` VARCHAR(191) NOT NULL,
    `payment_type` ENUM('TD', 'PD', 'DEATH_BENEFIT', 'SJDB_VOUCHER') NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `payment_date` DATE NOT NULL,
    `period_start` DATE NOT NULL,
    `period_end` DATE NOT NULL,
    `is_late` TINYINT(1) NOT NULL DEFAULT 0,
    `penalty_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `calculation_inputs` JSON,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_benefit_payments_claim_id`(`claim_id`),
    INDEX `idx_benefit_payments_payment_type`(`payment_type`),
    INDEX `idx_benefit_payments_payment_date`(`payment_date`),
    INDEX `idx_benefit_payments_claim_type`(`claim_id`, `payment_type`),
    INDEX `idx_benefit_payments_is_late`(`is_late`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `education_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `dismissed_terms` JSON NOT NULL,
    `training_modules_completed` JSON,
    `is_training_complete` TINYINT(1) NOT NULL DEFAULT 0,
    `learning_mode_expiry` DATETIME(3),
    `acknowledged_changes` JSON NOT NULL,
    `monthly_reviews_completed` JSON,
    `quarterly_refreshers` JSON,
    `audit_training_completed` JSON,
    `last_recertification_date` DATETIME(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `education_profiles_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workflow_progress` (
    `id` VARCHAR(191) NOT NULL,
    `claim_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `workflow_id` VARCHAR(191) NOT NULL,
    `step_statuses` JSON NOT NULL,
    `is_complete` TINYINT(1) NOT NULL DEFAULT 0,
    `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completed_at` DATETIME(3),

    INDEX `idx_workflow_progress_claim_id`(`claim_id`),
    INDEX `idx_workflow_progress_user_id`(`user_id`),
    INDEX `idx_workflow_progress_claim_user`(`claim_id`, `user_id`),
    UNIQUE INDEX `workflow_progress_claim_id_user_id_workflow_id_key`(`claim_id`, `user_id`, `workflow_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_events` (
    `id` VARCHAR(191) NOT NULL,
    `claim_id` VARCHAR(191),
    `user_id` VARCHAR(191) NOT NULL,
    `event_type` ENUM('DOCUMENT_UPLOADED', 'DOCUMENT_CLASSIFIED', 'DOCUMENT_VIEWED', 'DOCUMENT_DELETED', 'CLAIM_CREATED', 'CLAIM_STATUS_CHANGED', 'COVERAGE_DETERMINATION', 'RESERVE_CHANGED', 'BENEFIT_CALCULATED', 'BENEFIT_PAYMENT_ISSUED', 'DEADLINE_CREATED', 'DEADLINE_MET', 'DEADLINE_MISSED', 'DEADLINE_WAIVED', 'CHAT_MESSAGE_SENT', 'CHAT_RESPONSE_GENERATED', 'UPL_ZONE_CLASSIFICATION', 'UPL_OUTPUT_BLOCKED', 'UPL_DISCLAIMER_INJECTED', 'UPL_OUTPUT_VALIDATION_FAIL', 'COUNSEL_REFERRAL_GENERATED', 'UR_DECISION', 'INVESTIGATION_ACTIVITY', 'TRAINING_MODULE_COMPLETED', 'TRAINING_ASSESSMENT_PASSED', 'TIER1_TERM_DISMISSED', 'USER_LOGIN', 'USER_LOGOUT', 'PERMISSION_DENIED', 'LETTER_GENERATED', 'COUNSEL_REFERRAL_CREATED', 'COUNSEL_REFERRAL_STATUS_CHANGED', 'COMPLIANCE_REPORT_GENERATED', 'LIEN_CREATED', 'LIEN_STATUS_CHANGED', 'LIEN_OMFS_COMPARED', 'LIEN_RESOLVED', 'REGULATORY_CHANGE_ACKNOWLEDGED', 'MONTHLY_REVIEW_COMPLETED', 'QUARTERLY_REFRESHER_COMPLETED') NOT NULL,
    `event_data` JSON,
    `upl_zone` ENUM('GREEN', 'YELLOW', 'RED'),
    `ip_address` VARCHAR(191),
    `user_agent` TEXT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_audit_events_claim_id`(`claim_id`),
    INDEX `idx_audit_events_user_id`(`user_id`),
    INDEX `idx_audit_events_event_type`(`event_type`),
    INDEX `idx_audit_events_created_at`(`created_at`),
    INDEX `idx_audit_events_claim_event_type`(`claim_id`, `event_type`),
    INDEX `idx_audit_events_user_event_type`(`user_id`, `event_type`),
    INDEX `idx_audit_events_upl_zone`(`upl_zone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: Phase 10 — GeneratedLetter
CREATE TABLE `generated_letters` (
    `id` VARCHAR(191) NOT NULL,
    `claim_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `letter_type` ENUM('TD_BENEFIT_EXPLANATION', 'TD_PAYMENT_SCHEDULE', 'WAITING_PERIOD_NOTICE', 'EMPLOYER_NOTIFICATION_LC3761', 'BENEFIT_ADJUSTMENT_NOTICE') NOT NULL,
    `content` LONGTEXT NOT NULL,
    `template_id` VARCHAR(191) NOT NULL,
    `populated_data` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_generated_letters_claim_type`(`claim_id`, `letter_type`),
    INDEX `idx_generated_letters_user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: Phase 10 — CounselReferral
CREATE TABLE `counsel_referrals` (
    `id` VARCHAR(191) NOT NULL,
    `claim_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `legal_issue` VARCHAR(191) NOT NULL,
    `summary` TEXT NOT NULL,
    `status` ENUM('PENDING', 'SENT', 'RESPONDED', 'CLOSED') NOT NULL DEFAULT 'PENDING',
    `counsel_email` VARCHAR(191),
    `counsel_response` TEXT,
    `responded_at` DATETIME(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_counsel_referrals_claim_status`(`claim_id`, `status`),
    INDEX `idx_counsel_referrals_user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: Phase 10 — Lien
CREATE TABLE `liens` (
    `id` VARCHAR(191) NOT NULL,
    `claim_id` VARCHAR(191) NOT NULL,
    `lien_claimant` VARCHAR(191) NOT NULL,
    `lien_type` ENUM('MEDICAL_PROVIDER', 'ATTORNEY_FEE', 'EDD', 'EXPENSE', 'CHILD_SUPPORT', 'OTHER') NOT NULL,
    `total_amount_claimed` DECIMAL(12, 2) NOT NULL,
    `total_omfs_allowed` DECIMAL(12, 2),
    `discrepancy_amount` DECIMAL(12, 2),
    `filing_date` DATE NOT NULL,
    `filing_fee_status` ENUM('PAID', 'NOT_PAID', 'EXEMPT', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
    `status` ENUM('RECEIVED', 'UNDER_REVIEW', 'OMFS_COMPARED', 'NEGOTIATING', 'PAID_IN_FULL', 'PAID_REDUCED', 'DISPUTED', 'WITHDRAWN', 'WCAB_HEARING', 'RESOLVED_BY_ORDER') NOT NULL DEFAULT 'RECEIVED',
    `resolved_amount` DECIMAL(12, 2),
    `resolved_at` DATETIME(3),
    `wcab_case_number` VARCHAR(191),
    `notes` TEXT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_liens_claim_status`(`claim_id`, `status`),
    INDEX `idx_liens_lien_type`(`lien_type`),
    INDEX `idx_liens_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: Phase 10 — LienLineItem
CREATE TABLE `lien_line_items` (
    `id` VARCHAR(191) NOT NULL,
    `lien_id` VARCHAR(191) NOT NULL,
    `service_date` DATE NOT NULL,
    `cpt_code` VARCHAR(191),
    `description` VARCHAR(191) NOT NULL,
    `amount_claimed` DECIMAL(10, 2) NOT NULL,
    `omfs_rate` DECIMAL(10, 2),
    `is_overcharge` TINYINT(1) NOT NULL DEFAULT 0,
    `overcharge_amount` DECIMAL(10, 2),

    INDEX `idx_lien_line_items_lien_id`(`lien_id`),
    INDEX `idx_lien_line_items_cpt_code`(`cpt_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
