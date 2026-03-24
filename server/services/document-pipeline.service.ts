/**
 * Document processing pipeline orchestrator.
 *
 * Orchestrates the full document lifecycle after upload:
 *   1. OCR  — Extract text via Document AI
 *   2. Classify — Determine document type (stub classifier)
 *   3. Extract fields — Pull structured data from text
 *   4. Chunk + Embed — Create vector embeddings for RAG
 *   5. Timeline — Extract date-based events
 *
 * Each step is independent and fault-tolerant — a failure in one step
 * does not prevent subsequent steps from running (where possible).
 * Status is tracked on the Document record via ocrStatus.
 */

import { prisma } from '../db.js';
import { processDocument } from './ocr.service.js';
import { classifyDocument } from './document-classifier.service.js';
import { extractFields } from './field-extraction.service.js';
import { chunkAndEmbed } from './embedding.service.js';
import { generateTimelineEvents } from './timeline.service.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PipelineResult {
  documentId: string;
  ocrSuccess: boolean;
  classificationSuccess: boolean;
  extractionSuccess: boolean;
  embeddingSuccess: boolean;
  timelineSuccess: boolean;
  chunksCreated: number;
  fieldsExtracted: number;
  timelineEventsCreated: number;
  errors: string[];
}

// ---------------------------------------------------------------------------
// Pipeline
// ---------------------------------------------------------------------------

/**
 * Run the full document processing pipeline for a single document.
 *
 * This is designed to be called asynchronously after document upload.
 * It runs each step sequentially since later steps depend on earlier
 * outputs (e.g., classification needs OCR text).
 *
 * @param documentId - The document to process.
 * @returns Summary of what succeeded and what failed.
 */
export async function processDocumentPipeline(
  documentId: string,
): Promise<PipelineResult> {
  const result: PipelineResult = {
    documentId,
    ocrSuccess: false,
    classificationSuccess: false,
    extractionSuccess: false,
    embeddingSuccess: false,
    timelineSuccess: false,
    chunksCreated: 0,
    fieldsExtracted: 0,
    timelineEventsCreated: 0,
    errors: [],
  };

  // --- Step 1: OCR ---
  try {
    await processDocument(documentId);
    result.ocrSuccess = true;
  } catch (err) {
    result.errors.push(`OCR failed: ${err instanceof Error ? err.message : String(err)}`);
    // Cannot continue without text — mark and return early
    return result;
  }

  // --- Step 2: Classification ---
  try {
    await classifyDocument(documentId);
    result.classificationSuccess = true;
  } catch (err) {
    result.errors.push(`Classification failed: ${err instanceof Error ? err.message : String(err)}`);
    // Non-fatal — continue with extraction
  }

  // --- Step 3: Field extraction ---
  try {
    const fields = await extractFields(documentId);
    result.fieldsExtracted = fields.length;
    result.extractionSuccess = true;
  } catch (err) {
    result.errors.push(`Field extraction failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  // --- Step 4: Chunking + Embedding ---
  try {
    const chunks = await chunkAndEmbed(documentId);
    result.chunksCreated = chunks;
    result.embeddingSuccess = true;
  } catch (err) {
    result.errors.push(`Chunking/embedding failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  // --- Step 5: Timeline events ---
  try {
    const events = await generateTimelineEvents(documentId);
    result.timelineEventsCreated = events;
    result.timelineSuccess = true;
  } catch (err) {
    result.errors.push(`Timeline generation failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Log audit event for pipeline completion
  try {
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      select: { claimId: true },
    });

    if (doc) {
      await prisma.auditEvent.create({
        data: {
          userId: 'system',
          claimId: doc.claimId,
          eventType: 'DOCUMENT_CLASSIFIED',
          eventData: {
            documentId,
            ocrSuccess: result.ocrSuccess,
            classificationSuccess: result.classificationSuccess,
            fieldsExtracted: result.fieldsExtracted,
            chunksCreated: result.chunksCreated,
            timelineEventsCreated: result.timelineEventsCreated,
            errors: result.errors,
          },
        },
      });
    }
  } catch {
    // Audit failure should never fail the pipeline
  }

  return result;
}
