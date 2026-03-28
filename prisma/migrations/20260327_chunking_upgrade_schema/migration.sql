-- Chunking Optimization: extend document_chunks with heading structure,
-- parent-child indexing, atomic preservation flags, and contextual prefix.
-- All columns nullable or have defaults — fully backward-compatible.

-- 3-level heading structure
ALTER TABLE `document_chunks` ADD COLUMN `heading_l1` TEXT NULL;
ALTER TABLE `document_chunks` ADD COLUMN `heading_l2` TEXT NULL;
ALTER TABLE `document_chunks` ADD COLUMN `heading_l3` TEXT NULL;

-- Atomic preservation flags
ALTER TABLE `document_chunks` ADD COLUMN `page_numbers` JSON NULL;
ALTER TABLE `document_chunks` ADD COLUMN `is_continuation` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `document_chunks` ADD COLUMN `has_continuation` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `document_chunks` ADD COLUMN `contains_table` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `document_chunks` ADD COLUMN `contains_procedure` BOOLEAN NOT NULL DEFAULT false;

-- Parent-child indexing
ALTER TABLE `document_chunks` ADD COLUMN `parent_chunk_id` VARCHAR(191) NULL;
ALTER TABLE `document_chunks` ADD COLUMN `is_parent` BOOLEAN NOT NULL DEFAULT false;

-- Contextual prefix (included in embedding, excluded from LLM generation)
ALTER TABLE `document_chunks` ADD COLUMN `context_prefix` TEXT NULL;

-- Token-based metadata
ALTER TABLE `document_chunks` ADD COLUMN `token_count` INTEGER NULL;

-- Indexes for parent-child retrieval
CREATE INDEX `idx_document_chunks_parent_id` ON `document_chunks`(`parent_chunk_id`);
CREATE INDEX `idx_document_chunks_doc_is_parent` ON `document_chunks`(`document_id`, `is_parent`);
