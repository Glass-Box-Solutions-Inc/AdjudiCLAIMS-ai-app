/**
 * Document reprocessing service — batch re-processes existing documents
 * after a data migration (e.g., PostgreSQL → PlanetScale + Voyage Large).
 *
 * Designed for the Part B migration step: all documents that already have
 * OCR text are re-classified, re-extracted, re-embedded with Voyage Large,
 * and re-indexed for timeline events. OCR is intentionally skipped because
 * `extractedText` is already present on every targeted document.
 *
 * Processing model:
 *   - Paginated batch fetches (configurable batchSize, default 50)
 *   - Configurable concurrency within each batch (default 5 parallel)
 *   - Fault-tolerant: a failure on any step or any document is logged and
 *     skipped — processing continues to the next document
 *   - Idempotent: existing chunks, fields, and timeline events are deleted
 *     before each document is re-processed (the individual services handle
 *     this for chunks/fields; this service handles timeline events explicitly)
 *   - Dry-run mode: logs what would be done without writing any data
 *
 * Usage:
 *   import { reprocessDocuments } from './document-reprocessing.service.js';
 *   const result = await reprocessDocuments({ batchSize: 100, concurrency: 10 });
 *   console.log(result);
 */

import { prisma } from '../db.js';
import { classifyDocument } from './document-classifier.service.js';
import { extractFields } from './field-extraction.service.js';
import { chunkAndEmbed } from './embedding.service.js';
import { generateTimelineEvents } from './timeline.service.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/**
 * Options controlling batch reprocessing behaviour.
 *
 * All fields are optional — safe defaults apply when omitted.
 */
export interface ReprocessingOptions {
  /**
   * Number of documents fetched per database page.
   * Larger values reduce round-trips but increase peak memory usage.
   * Default: 50.
   */
  batchSize?: number;

  /**
   * Number of documents processed in parallel within each batch.
   * Bounded by batchSize. Default: 5.
   */
  concurrency?: number;

  /**
   * Skip re-classification (Step 2).
   * Useful when only re-embedding is needed and the existing documentType
   * values are already correct.
   * Default: false.
   */
  skipClassification?: boolean;

  /**
   * Skip field extraction (Step 3).
   * Default: false.
   */
  skipExtraction?: boolean;

  /**
   * Skip chunking and embedding (Step 4).
   * Default: false.
   */
  skipEmbedding?: boolean;

  /**
   * Skip timeline event generation (Step 5).
   * Default: false.
   */
  skipTimeline?: boolean;

  /**
   * Restrict processing to a specific set of document IDs.
   * When empty or omitted, all documents with extractedText are processed.
   */
  documentIds?: string[];

  /**
   * Log what would be processed without writing any data.
   * Useful for estimating scope before a full run.
   * Default: false.
   */
  dryRun?: boolean;
}

/**
 * Summary returned after a reprocessing run.
 *
 * `processed` = documents attempted (succeeded + failed).
 * `skipped` = documents that had no extractedText and were bypassed.
 * `errors` contains one entry per failed step per document, so a document
 * that fails classification AND embedding will produce two entries.
 */
export interface ReprocessingResult {
  /** Total documents found matching the query (including skipped). */
  totalDocuments: number;
  /** Documents where at least one step was attempted. */
  processed: number;
  /** Documents where all attempted steps completed without error. */
  succeeded: number;
  /** Documents where at least one step threw an error. */
  failed: number;
  /**
   * Documents skipped because extractedText was null.
   * (Should be zero when targeting the correct population, but reported
   * for transparency in case the caller's filter is broader than expected.)
   */
  skipped: number;
  /** Per-step error details for failed documents. */
  errors: Array<{ documentId: string; step: string; error: string }>;
  /** Wall-clock duration of the entire run in milliseconds. */
  durationMs: number;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Resolved options with all defaults applied. */
interface ResolvedOptions {
  batchSize: number;
  concurrency: number;
  skipClassification: boolean;
  skipExtraction: boolean;
  skipEmbedding: boolean;
  skipTimeline: boolean;
  documentIds: string[];
  dryRun: boolean;
}

function resolveOptions(opts: ReprocessingOptions | undefined): ResolvedOptions {
  return {
    batchSize: opts?.batchSize ?? 50,
    concurrency: opts?.concurrency ?? 5,
    skipClassification: opts?.skipClassification ?? false,
    skipExtraction: opts?.skipExtraction ?? false,
    skipEmbedding: opts?.skipEmbedding ?? false,
    skipTimeline: opts?.skipTimeline ?? false,
    documentIds: opts?.documentIds ?? [],
    dryRun: opts?.dryRun ?? false,
  };
}

/** Mutable accumulator threaded through batch processing. */
interface RunState {
  totalDocuments: number;
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
  errors: Array<{ documentId: string; step: string; error: string }>;
}

/**
 * Process a single document through the re-processing pipeline.
 *
 * Steps run independently — a failure in classification does not prevent
 * extraction, embedding, or timeline generation (matching the fault-tolerance
 * model of document-pipeline.service.ts).
 *
 * Timeline events require an explicit deleteMany before generateTimelineEvents
 * because the timeline service uses createMany without prior cleanup (unlike
 * the embedding and field-extraction services which delete before re-creating).
 */
async function reprocessSingleDocument(
  documentId: string,
  opts: ResolvedOptions,
  state: RunState,
): Promise<void> {
  // Verify the document exists and has extracted text.
  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    select: { id: true, claimId: true, extractedText: true },
  });

  if (!doc) {
    state.errors.push({
      documentId,
      step: 'preflight',
      error: `Document not found: ${documentId}`,
    });
    state.processed++;
    state.failed++;
    return;
  }

  if (!doc.extractedText) {
    console.log(`[reprocessing] SKIP ${documentId} — no extractedText`);
    state.skipped++;
    return;
  }

  state.processed++;

  if (opts.dryRun) {
    const steps = [
      !opts.skipClassification && 'classify',
      !opts.skipExtraction && 'extract',
      !opts.skipEmbedding && 'embed',
      !opts.skipTimeline && 'timeline',
    ]
      .filter(Boolean)
      .join(', ');
    console.log(`[reprocessing] DRY-RUN ${documentId} — would run: ${steps}`);
    state.succeeded++;
    return;
  }

  let documentFailed = false;

  // --- Step 2: Re-classify ---
  if (!opts.skipClassification) {
    try {
      await classifyDocument(documentId);
      console.log(`[reprocessing] ${documentId} classification OK`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[reprocessing] ${documentId} classification FAILED: ${message}`);
      state.errors.push({ documentId, step: 'classification', error: message });
      documentFailed = true;
      // Non-fatal — continue to next step
    }
  }

  // --- Step 3: Re-extract fields ---
  if (!opts.skipExtraction) {
    try {
      const fields = await extractFields(documentId);
      console.log(`[reprocessing] ${documentId} extraction OK (${String(fields.length)} fields)`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[reprocessing] ${documentId} extraction FAILED: ${message}`);
      state.errors.push({ documentId, step: 'extraction', error: message });
      documentFailed = true;
    }
  }

  // --- Step 4: Re-chunk + re-embed ---
  if (!opts.skipEmbedding) {
    try {
      const chunks = await chunkAndEmbed(documentId);
      console.log(`[reprocessing] ${documentId} embedding OK (${String(chunks)} chunks)`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[reprocessing] ${documentId} embedding FAILED: ${message}`);
      state.errors.push({ documentId, step: 'embedding', error: message });
      documentFailed = true;
    }
  }

  // --- Step 5: Re-generate timeline events ---
  if (!opts.skipTimeline) {
    try {
      // The timeline service appends without deduplication — delete first for idempotency.
      await prisma.timelineEvent.deleteMany({ where: { documentId } });

      const events = await generateTimelineEvents(documentId);
      console.log(`[reprocessing] ${documentId} timeline OK (${String(events)} events)`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[reprocessing] ${documentId} timeline FAILED: ${message}`);
      state.errors.push({ documentId, step: 'timeline', error: message });
      documentFailed = true;
    }
  }

  // --- Audit event ---
  try {
    const retentionExpiry = new Date();
    retentionExpiry.setFullYear(retentionExpiry.getFullYear() + 7);
    await prisma.auditEvent.create({
      data: {
        userId: 'system',
        claimId: doc.claimId,
        eventType: 'DOCUMENT_CLASSIFIED',
        eventData: {
          documentId,
          trigger: 'reprocessing',
          skipClassification: opts.skipClassification,
          skipExtraction: opts.skipExtraction,
          skipEmbedding: opts.skipEmbedding,
          skipTimeline: opts.skipTimeline,
          dryRun: opts.dryRun,
          errors: state.errors
            .filter((e) => e.documentId === documentId)
            .map((e) => `${e.step}: ${e.error}`),
        },
        retentionExpiresAt: retentionExpiry,
      },
    });
  } catch {
    // Audit failure must never abort the pipeline.
  }

  if (documentFailed) {
    state.failed++;
  } else {
    state.succeeded++;
  }
}

/**
 * Run a fixed-concurrency pool over an array of document IDs.
 *
 * Spawns up to `concurrency` promises at once. Each slot is refilled
 * as soon as the previous promise settles (resolved or rejected). All
 * errors are handled inside reprocessSingleDocument, so this pool never
 * rejects — it always waits for all work to complete.
 */
async function runWithConcurrency(
  documentIds: string[],
  concurrency: number,
  opts: ResolvedOptions,
  state: RunState,
): Promise<void> {
  let index = 0;

  async function worker(): Promise<void> {
    while (index < documentIds.length) {
      const currentIndex = index;
      index++;
      const documentId = documentIds[currentIndex];
      if (!documentId) continue;
      // Errors are caught inside reprocessSingleDocument — never throws.
      await reprocessSingleDocument(documentId, opts, state);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, documentIds.length) }, () =>
    worker(),
  );
  await Promise.all(workers);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Re-process all documents that have OCR text, skipping the OCR step.
 *
 * Called after a data migration to rebuild classifier labels, structured
 * fields, Voyage Large embeddings, and timeline events under the new schema.
 *
 * @param options - Optional tuning parameters (see ReprocessingOptions).
 * @returns A summary of the run (see ReprocessingResult).
 *
 * @example
 * // Re-embed everything — skip re-classification and re-extraction
 * const result = await reprocessDocuments({
 *   skipClassification: true,
 *   skipExtraction: true,
 *   batchSize: 100,
 *   concurrency: 10,
 * });
 * console.log(`Done: ${result.succeeded} succeeded, ${result.failed} failed`);
 *
 * @example
 * // Dry run to estimate scope
 * const preview = await reprocessDocuments({ dryRun: true });
 * console.log(`Would process ${preview.totalDocuments} documents`);
 */
export async function reprocessDocuments(
  options?: ReprocessingOptions,
): Promise<ReprocessingResult> {
  const startTime = Date.now();
  const opts = resolveOptions(options);

  const state: RunState = {
    totalDocuments: 0,
    processed: 0,
    succeeded: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  console.log('[reprocessing] Starting document reprocessing run', {
    batchSize: opts.batchSize,
    concurrency: opts.concurrency,
    skipClassification: opts.skipClassification,
    skipExtraction: opts.skipExtraction,
    skipEmbedding: opts.skipEmbedding,
    skipTimeline: opts.skipTimeline,
    targetDocumentCount: opts.documentIds.length > 0 ? opts.documentIds.length : 'all',
    dryRun: opts.dryRun,
  });

  // --- Specific document IDs provided: process exactly those ---
  if (opts.documentIds.length > 0) {
    state.totalDocuments = opts.documentIds.length;

    console.log(
      `[reprocessing] Processing ${String(state.totalDocuments)} specified documents`,
    );

    await runWithConcurrency(opts.documentIds, opts.concurrency, opts, state);
  } else {
    // --- Process all documents with extractedText, paginated ---
    let cursor: string | undefined;
    let batchNumber = 0;

    for (;;) {
      const batch = await prisma.document.findMany({
        where: { extractedText: { not: null } },
        select: { id: true },
        orderBy: { id: 'asc' },
        take: opts.batchSize,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      });

      if (batch.length === 0) {
        break;
      }

      batchNumber++;
      state.totalDocuments += batch.length;

      console.log(
        `[reprocessing] Batch ${String(batchNumber)}: ${String(batch.length)} documents` +
          (cursor ? ` (cursor: ${cursor})` : ''),
      );

      const batchIds = batch.map((d) => d.id).filter((id): id is string => typeof id === 'string');
      cursor = batchIds[batchIds.length - 1];

      await runWithConcurrency(batchIds, opts.concurrency, opts, state);

      // Stop if the batch was smaller than the page size — we're on the last page.
      if (batch.length < opts.batchSize) {
        break;
      }
    }
  }

  const durationMs = Date.now() - startTime;

  const result: ReprocessingResult = {
    totalDocuments: state.totalDocuments,
    processed: state.processed,
    succeeded: state.succeeded,
    failed: state.failed,
    skipped: state.skipped,
    errors: state.errors,
    durationMs,
  };

  console.log('[reprocessing] Run complete', {
    totalDocuments: result.totalDocuments,
    processed: result.processed,
    succeeded: result.succeeded,
    failed: result.failed,
    skipped: result.skipped,
    errorCount: result.errors.length,
    durationMs: result.durationMs,
  });

  return result;
}
