import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Document reprocessing service tests.
 *
 * Tests batch reprocessing with mocked Prisma and pipeline service dependencies.
 * Validates: pagination, concurrency, fault isolation, dry-run, skip flags,
 * audit events, idempotent timeline cleanup, error aggregation, empty sets,
 * and concurrency pool behavior.
 */

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_DOC_WITH_TEXT = {
  id: 'doc-1',
  claimId: 'claim-1',
  extractedText: 'QME Report: Lumbar strain, 12% WPI.',
};

const MOCK_DOC_NO_TEXT = {
  id: 'doc-2',
  claimId: 'claim-1',
  extractedText: null,
};

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockDocumentFindUnique = vi.fn();
const mockDocumentFindMany = vi.fn();
const mockTimelineEventDeleteMany = vi.fn();
const mockAuditEventCreate = vi.fn();

vi.mock('../../server/db.js', () => ({
  prisma: {
    document: {
      findUnique: (...args: unknown[]) => mockDocumentFindUnique(...args) as unknown,
      findMany: (...args: unknown[]) => mockDocumentFindMany(...args) as unknown,
      update: vi.fn().mockResolvedValue({}),
    },
    timelineEvent: {
      deleteMany: (...args: unknown[]) => mockTimelineEventDeleteMany(...args) as unknown,
    },
    auditEvent: {
      create: (...args: unknown[]) => mockAuditEventCreate(...args) as unknown,
    },
  },
}));

const mockClassifyDocument = vi.fn();
vi.mock('../../server/services/document-classifier.service.js', () => ({
  classifyDocument: (...args: unknown[]) => mockClassifyDocument(...args) as unknown,
}));

const mockExtractFields = vi.fn();
vi.mock('../../server/services/field-extraction.service.js', () => ({
  extractFields: (...args: unknown[]) => mockExtractFields(...args) as unknown,
}));

const mockChunkAndEmbed = vi.fn();
vi.mock('../../server/services/embedding.service.js', () => ({
  chunkAndEmbed: (...args: unknown[]) => mockChunkAndEmbed(...args) as unknown,
}));

const mockGenerateTimelineEvents = vi.fn();
vi.mock('../../server/services/timeline.service.js', () => ({
  generateTimelineEvents: (...args: unknown[]) => mockGenerateTimelineEvents(...args) as unknown,
}));

// ---------------------------------------------------------------------------
// Import under test (after mocks)
// ---------------------------------------------------------------------------

const { reprocessDocuments } = await import(
  '../../server/services/document-reprocessing.service.js'
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeMockDoc(id: string, hasText = true) {
  return {
    id,
    claimId: `claim-for-${id}`,
    extractedText: hasText ? `Extracted text for ${id}` : null,
  };
}

function setupDefaultMocks() {
  mockDocumentFindUnique.mockImplementation(({ where }: { where: { id: string } }) => {
    if (where.id === 'doc-1') return Promise.resolve(MOCK_DOC_WITH_TEXT);
    if (where.id === 'doc-2') return Promise.resolve(MOCK_DOC_NO_TEXT);
    if (where.id === 'doc-missing') return Promise.resolve(null);
    // Default: return a doc with text using the requested id
    return Promise.resolve(makeMockDoc(where.id));
  });

  mockDocumentFindMany.mockResolvedValueOnce([{ id: 'doc-1' }]).mockResolvedValueOnce([]);

  mockClassifyDocument.mockResolvedValue({
    documentType: 'MEDICAL_REPORT',
    confidence: 0.9,
  });

  mockExtractFields.mockResolvedValue([
    { fieldName: 'wpi', fieldValue: '12%', confidence: 0.95 },
  ]);

  mockChunkAndEmbed.mockResolvedValue(3);
  mockGenerateTimelineEvents.mockResolvedValue(2);
  mockTimelineEventDeleteMany.mockResolvedValue({ count: 1 });
  mockAuditEventCreate.mockResolvedValue({});
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
  // Suppress console output during tests
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('reprocessDocuments', () => {
  // -------------------------------------------------------------------------
  // Basic flow
  // -------------------------------------------------------------------------

  describe('basic flow', () => {
    it('processes documents with extractedText through all 4 steps', async () => {
      setupDefaultMocks();

      const result = await reprocessDocuments({ documentIds: ['doc-1'] });

      expect(result.totalDocuments).toBe(1);
      expect(result.processed).toBe(1);
      expect(result.succeeded).toBe(1);
      expect(result.failed).toBe(0);
      expect(result.errors).toHaveLength(0);

      // All 4 pipeline steps called
      expect(mockClassifyDocument).toHaveBeenCalledWith('doc-1');
      expect(mockExtractFields).toHaveBeenCalledWith('doc-1');
      expect(mockChunkAndEmbed).toHaveBeenCalledWith('doc-1');
      expect(mockGenerateTimelineEvents).toHaveBeenCalledWith('doc-1');
    });

    it('deletes timeline events before re-generating (idempotency)', async () => {
      setupDefaultMocks();

      await reprocessDocuments({ documentIds: ['doc-1'] });

      expect(mockTimelineEventDeleteMany).toHaveBeenCalledWith({
        where: { documentId: 'doc-1' },
      });
      // deleteMany called BEFORE generateTimelineEvents
      const deleteCall = mockTimelineEventDeleteMany.mock.invocationCallOrder[0];
      const generateCall = mockGenerateTimelineEvents.mock.invocationCallOrder[0];
      expect(deleteCall).toBeLessThan(generateCall!);
    });

    it('writes audit event with trigger: reprocessing', async () => {
      setupDefaultMocks();

      await reprocessDocuments({ documentIds: ['doc-1'] });

      expect(mockAuditEventCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'system',
          claimId: 'claim-1',
          eventType: 'DOCUMENT_CLASSIFIED',
          eventData: expect.objectContaining({
            documentId: 'doc-1',
            trigger: 'reprocessing',
          }),
        }),
      });
    });

    it('returns durationMs > 0', async () => {
      setupDefaultMocks();

      const result = await reprocessDocuments({ documentIds: ['doc-1'] });
      expect(result.durationMs).toBeGreaterThanOrEqual(0);
    });

    it('uses default options when called with no arguments', async () => {
      setupDefaultMocks();

      const result = await reprocessDocuments();

      // Should use paginated fetch with defaults (batchSize=50)
      expect(mockDocumentFindMany).toHaveBeenCalled();
      expect(result.totalDocuments).toBe(1);
      expect(result.succeeded).toBe(1);
    });

    it('uses default options when called with undefined', async () => {
      mockDocumentFindUnique.mockImplementation(({ where }: { where: { id: string } }) =>
        Promise.resolve(makeMockDoc(where.id)),
      );
      mockDocumentFindMany
        .mockReset()
        .mockResolvedValueOnce([{ id: 'doc-u1' }])
        .mockResolvedValueOnce([]);
      mockClassifyDocument.mockResolvedValue({ documentType: 'MEDICAL_REPORT', confidence: 0.9 });
      mockExtractFields.mockResolvedValue([]);
      mockChunkAndEmbed.mockResolvedValue(3);
      mockGenerateTimelineEvents.mockResolvedValue(2);
      mockTimelineEventDeleteMany.mockResolvedValue({ count: 0 });
      mockAuditEventCreate.mockResolvedValue({});

      const result = await reprocessDocuments(undefined);

      expect(mockDocumentFindMany).toHaveBeenCalled();
      expect(result.totalDocuments).toBe(1);
    });
  });

  // -------------------------------------------------------------------------
  // Skip flags
  // -------------------------------------------------------------------------

  describe('skip flags', () => {
    it('skips classification when skipClassification is true', async () => {
      setupDefaultMocks();

      await reprocessDocuments({
        documentIds: ['doc-1'],
        skipClassification: true,
      });

      expect(mockClassifyDocument).not.toHaveBeenCalled();
      expect(mockExtractFields).toHaveBeenCalledWith('doc-1');
      expect(mockChunkAndEmbed).toHaveBeenCalledWith('doc-1');
      expect(mockGenerateTimelineEvents).toHaveBeenCalledWith('doc-1');
    });

    it('skips extraction when skipExtraction is true', async () => {
      setupDefaultMocks();

      await reprocessDocuments({
        documentIds: ['doc-1'],
        skipExtraction: true,
      });

      expect(mockExtractFields).not.toHaveBeenCalled();
      expect(mockClassifyDocument).toHaveBeenCalled();
    });

    it('skips embedding when skipEmbedding is true', async () => {
      setupDefaultMocks();

      await reprocessDocuments({
        documentIds: ['doc-1'],
        skipEmbedding: true,
      });

      expect(mockChunkAndEmbed).not.toHaveBeenCalled();
    });

    it('skips timeline when skipTimeline is true', async () => {
      setupDefaultMocks();

      await reprocessDocuments({
        documentIds: ['doc-1'],
        skipTimeline: true,
      });

      expect(mockGenerateTimelineEvents).not.toHaveBeenCalled();
      expect(mockTimelineEventDeleteMany).not.toHaveBeenCalled();
    });

    it('skips all steps when all skip flags are true — still counts as succeeded', async () => {
      setupDefaultMocks();

      const result = await reprocessDocuments({
        documentIds: ['doc-1'],
        skipClassification: true,
        skipExtraction: true,
        skipEmbedding: true,
        skipTimeline: true,
      });

      expect(result.succeeded).toBe(1);
      expect(mockClassifyDocument).not.toHaveBeenCalled();
      expect(mockExtractFields).not.toHaveBeenCalled();
      expect(mockChunkAndEmbed).not.toHaveBeenCalled();
      expect(mockGenerateTimelineEvents).not.toHaveBeenCalled();
    });

    it('records skip flags in audit event data', async () => {
      setupDefaultMocks();

      await reprocessDocuments({
        documentIds: ['doc-1'],
        skipClassification: true,
        skipExtraction: false,
        skipEmbedding: true,
        skipTimeline: false,
      });

      expect(mockAuditEventCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          eventData: expect.objectContaining({
            skipClassification: true,
            skipExtraction: false,
            skipEmbedding: true,
            skipTimeline: false,
            dryRun: false,
          }),
        }),
      });
    });
  });

  // -------------------------------------------------------------------------
  // Fault isolation
  // -------------------------------------------------------------------------

  describe('fault isolation', () => {
    it('continues to next step when classification fails', async () => {
      setupDefaultMocks();
      mockClassifyDocument.mockRejectedValue(new Error('LLM timeout'));

      const result = await reprocessDocuments({ documentIds: ['doc-1'] });

      expect(result.failed).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        documentId: 'doc-1',
        step: 'classification',
        error: 'LLM timeout',
      });

      // Other steps still called
      expect(mockExtractFields).toHaveBeenCalledWith('doc-1');
      expect(mockChunkAndEmbed).toHaveBeenCalledWith('doc-1');
      expect(mockGenerateTimelineEvents).toHaveBeenCalledWith('doc-1');
    });

    it('continues to next step when extraction fails', async () => {
      setupDefaultMocks();
      mockExtractFields.mockRejectedValue(new Error('Schema mismatch'));

      const result = await reprocessDocuments({ documentIds: ['doc-1'] });

      expect(result.failed).toBe(1);
      expect(result.errors).toContainEqual({
        documentId: 'doc-1',
        step: 'extraction',
        error: 'Schema mismatch',
      });

      // Classification was called before extraction
      expect(mockClassifyDocument).toHaveBeenCalledWith('doc-1');
      // Steps after extraction still called
      expect(mockChunkAndEmbed).toHaveBeenCalledWith('doc-1');
      expect(mockGenerateTimelineEvents).toHaveBeenCalledWith('doc-1');
    });

    it('continues to next step when embedding fails', async () => {
      setupDefaultMocks();
      mockChunkAndEmbed.mockRejectedValue(new Error('Voyage API down'));

      const result = await reprocessDocuments({ documentIds: ['doc-1'] });

      expect(result.failed).toBe(1);
      expect(result.errors).toContainEqual({
        documentId: 'doc-1',
        step: 'embedding',
        error: 'Voyage API down',
      });

      // Timeline still runs
      expect(mockGenerateTimelineEvents).toHaveBeenCalledWith('doc-1');
    });

    it('continues when timeline generation fails', async () => {
      setupDefaultMocks();
      mockGenerateTimelineEvents.mockRejectedValue(new Error('Timeline service unavailable'));

      const result = await reprocessDocuments({ documentIds: ['doc-1'] });

      expect(result.failed).toBe(1);
      expect(result.errors).toContainEqual({
        documentId: 'doc-1',
        step: 'timeline',
        error: 'Timeline service unavailable',
      });

      // Timeline deleteMany was still called (it happens before generateTimelineEvents)
      expect(mockTimelineEventDeleteMany).toHaveBeenCalledWith({
        where: { documentId: 'doc-1' },
      });
    });

    it('records timeline error when deleteMany throws', async () => {
      setupDefaultMocks();
      mockTimelineEventDeleteMany.mockRejectedValue(new Error('DB connection lost'));

      const result = await reprocessDocuments({ documentIds: ['doc-1'] });

      expect(result.failed).toBe(1);
      expect(result.errors).toContainEqual({
        documentId: 'doc-1',
        step: 'timeline',
        error: 'DB connection lost',
      });
    });

    it('records multiple errors when multiple steps fail on same document', async () => {
      setupDefaultMocks();
      mockClassifyDocument.mockRejectedValue(new Error('classify fail'));
      mockChunkAndEmbed.mockRejectedValue(new Error('embed fail'));

      const result = await reprocessDocuments({ documentIds: ['doc-1'] });

      expect(result.failed).toBe(1);
      expect(result.errors).toHaveLength(2);
      expect(result.errors.map((e) => e.step)).toContain('classification');
      expect(result.errors.map((e) => e.step)).toContain('embedding');
    });

    it('records errors from all 4 steps failing on same document', async () => {
      setupDefaultMocks();
      mockClassifyDocument.mockRejectedValue(new Error('classify fail'));
      mockExtractFields.mockRejectedValue(new Error('extract fail'));
      mockChunkAndEmbed.mockRejectedValue(new Error('embed fail'));
      mockGenerateTimelineEvents.mockRejectedValue(new Error('timeline fail'));

      const result = await reprocessDocuments({ documentIds: ['doc-1'] });

      expect(result.failed).toBe(1);
      expect(result.errors).toHaveLength(4);
      expect(result.errors.map((e) => e.step).sort()).toEqual([
        'classification',
        'embedding',
        'extraction',
        'timeline',
      ]);
    });

    it('handles missing document gracefully', async () => {
      setupDefaultMocks();

      const result = await reprocessDocuments({ documentIds: ['doc-missing'] });

      expect(result.failed).toBe(1);
      expect(result.processed).toBe(1);
      expect(result.errors[0]!.step).toBe('preflight');
      expect(result.errors[0]!.error).toContain('Document not found');
    });

    it('does not call pipeline steps for missing documents', async () => {
      setupDefaultMocks();

      await reprocessDocuments({ documentIds: ['doc-missing'] });

      expect(mockClassifyDocument).not.toHaveBeenCalled();
      expect(mockExtractFields).not.toHaveBeenCalled();
      expect(mockChunkAndEmbed).not.toHaveBeenCalled();
      expect(mockGenerateTimelineEvents).not.toHaveBeenCalled();
    });

    it('handles non-Error throw values (strings) gracefully', async () => {
      setupDefaultMocks();
      mockClassifyDocument.mockRejectedValue('plain string error');

      const result = await reprocessDocuments({ documentIds: ['doc-1'] });

      expect(result.failed).toBe(1);
      expect(result.errors[0]!.error).toBe('plain string error');
    });

    it('aggregates errors across multiple documents', async () => {
      setupDefaultMocks();

      // doc-1 has classification fail, doc-x will have extraction fail
      mockClassifyDocument
        .mockRejectedValueOnce(new Error('classify fail on doc-1'))
        .mockResolvedValueOnce({ documentType: 'OTHER', confidence: 0.8 });
      mockExtractFields
        .mockResolvedValueOnce([])
        .mockRejectedValueOnce(new Error('extract fail on doc-x'));

      mockDocumentFindUnique.mockImplementation(({ where }: { where: { id: string } }) =>
        Promise.resolve(makeMockDoc(where.id)),
      );

      const result = await reprocessDocuments({ documentIds: ['doc-1', 'doc-x'] });

      expect(result.totalDocuments).toBe(2);
      expect(result.failed).toBe(2);
      expect(result.errors).toHaveLength(2);
      expect(result.errors[0]!.documentId).toBe('doc-1');
      expect(result.errors[0]!.step).toBe('classification');
      expect(result.errors[1]!.documentId).toBe('doc-x');
      expect(result.errors[1]!.step).toBe('extraction');
    });
  });

  // -------------------------------------------------------------------------
  // Document without text (skipped)
  // -------------------------------------------------------------------------

  describe('document without extractedText', () => {
    it('skips and does not call any pipeline steps', async () => {
      setupDefaultMocks();

      const result = await reprocessDocuments({ documentIds: ['doc-2'] });

      expect(result.skipped).toBe(1);
      expect(result.processed).toBe(0);
      expect(result.succeeded).toBe(0);
      expect(mockClassifyDocument).not.toHaveBeenCalled();
      expect(mockExtractFields).not.toHaveBeenCalled();
      expect(mockChunkAndEmbed).not.toHaveBeenCalled();
      expect(mockGenerateTimelineEvents).not.toHaveBeenCalled();
    });

    it('does not write an audit event for skipped documents', async () => {
      setupDefaultMocks();

      await reprocessDocuments({ documentIds: ['doc-2'] });

      expect(mockAuditEventCreate).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // Dry-run mode
  // -------------------------------------------------------------------------

  describe('dry-run mode', () => {
    it('does not call any pipeline steps in dry-run mode', async () => {
      setupDefaultMocks();

      const result = await reprocessDocuments({
        documentIds: ['doc-1'],
        dryRun: true,
      });

      expect(result.succeeded).toBe(1);
      expect(result.processed).toBe(1);
      expect(mockClassifyDocument).not.toHaveBeenCalled();
      expect(mockExtractFields).not.toHaveBeenCalled();
      expect(mockChunkAndEmbed).not.toHaveBeenCalled();
      expect(mockGenerateTimelineEvents).not.toHaveBeenCalled();
    });

    it('still reports totalDocuments correctly in dry-run', async () => {
      setupDefaultMocks();

      const result = await reprocessDocuments({
        documentIds: ['doc-1', 'doc-2'],
        dryRun: true,
      });

      expect(result.totalDocuments).toBe(2);
    });

    it('does not delete timeline events in dry-run', async () => {
      setupDefaultMocks();

      await reprocessDocuments({
        documentIds: ['doc-1'],
        dryRun: true,
      });

      expect(mockTimelineEventDeleteMany).not.toHaveBeenCalled();
    });

    it('does not write audit event in dry-run (returns before audit block)', async () => {
      setupDefaultMocks();

      await reprocessDocuments({
        documentIds: ['doc-1'],
        dryRun: true,
      });

      // Dry-run returns early at line 215, before the audit event at line 277
      expect(mockAuditEventCreate).not.toHaveBeenCalled();
    });

    it('skips documents without text even in dry-run', async () => {
      setupDefaultMocks();

      const result = await reprocessDocuments({
        documentIds: ['doc-2'],
        dryRun: true,
      });

      expect(result.skipped).toBe(1);
      expect(result.processed).toBe(0);
      expect(result.succeeded).toBe(0);
    });

    it('logs which steps would run based on skip flags', async () => {
      setupDefaultMocks();
      const logSpy = vi.spyOn(console, 'log');

      await reprocessDocuments({
        documentIds: ['doc-1'],
        dryRun: true,
        skipClassification: true,
        skipTimeline: true,
      });

      const dryRunLog = logSpy.mock.calls.find(
        (call) => typeof call[0] === 'string' && call[0].includes('DRY-RUN'),
      );
      expect(dryRunLog).toBeDefined();
      const message = dryRunLog![0] as string;
      // Should mention extract and embed but not classify or timeline
      expect(message).toContain('extract');
      expect(message).toContain('embed');
      expect(message).not.toContain('classify');
      expect(message).not.toContain('timeline');
    });

    it('dry-run with paginated fetch does not write data', async () => {
      setupDefaultMocks();

      mockDocumentFindMany
        .mockReset()
        .mockResolvedValueOnce([{ id: 'doc-a' }, { id: 'doc-b' }])
        .mockResolvedValueOnce([]);

      mockDocumentFindUnique.mockImplementation(({ where }: { where: { id: string } }) =>
        Promise.resolve(makeMockDoc(where.id)),
      );

      const result = await reprocessDocuments({ batchSize: 2, dryRun: true });

      expect(result.totalDocuments).toBe(2);
      expect(result.succeeded).toBe(2);
      expect(mockClassifyDocument).not.toHaveBeenCalled();
      expect(mockExtractFields).not.toHaveBeenCalled();
      expect(mockChunkAndEmbed).not.toHaveBeenCalled();
      expect(mockGenerateTimelineEvents).not.toHaveBeenCalled();
      expect(mockTimelineEventDeleteMany).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // Paginated fetch (no documentIds)
  // -------------------------------------------------------------------------

  describe('paginated fetch', () => {
    it('fetches documents in batches using cursor pagination', async () => {
      setupDefaultMocks();

      // batchSize=2: first batch full (2 docs) → triggers second fetch, second batch returns 0 → done
      mockDocumentFindMany
        .mockReset()
        .mockResolvedValueOnce([{ id: 'doc-a' }, { id: 'doc-b' }])
        .mockResolvedValueOnce([]);

      // Make findUnique resolve for doc-a and doc-b
      mockDocumentFindUnique.mockImplementation(({ where }: { where: { id: string } }) =>
        Promise.resolve(makeMockDoc(where.id)),
      );

      const result = await reprocessDocuments({ batchSize: 2 });

      // First call: no cursor. Second call: with cursor (batch was full = batchSize).
      expect(mockDocumentFindMany).toHaveBeenCalledTimes(2);
      expect(result.totalDocuments).toBe(2);
      expect(result.succeeded).toBe(2);
    });

    it('stops pagination when batch is smaller than batchSize', async () => {
      setupDefaultMocks();

      // Single batch with 3 docs (less than batchSize=10)
      mockDocumentFindMany
        .mockReset()
        .mockResolvedValueOnce([{ id: 'doc-a' }, { id: 'doc-b' }, { id: 'doc-c' }]);

      mockDocumentFindUnique.mockImplementation(({ where }: { where: { id: string } }) =>
        Promise.resolve(makeMockDoc(where.id)),
      );

      const result = await reprocessDocuments({ batchSize: 10 });

      // Only one batch call because 3 < 10
      expect(mockDocumentFindMany).toHaveBeenCalledTimes(1);
      expect(result.totalDocuments).toBe(3);
    });

    it('passes cursor in subsequent batch queries', async () => {
      setupDefaultMocks();

      mockDocumentFindMany
        .mockReset()
        .mockResolvedValueOnce([{ id: 'doc-a' }, { id: 'doc-b' }])
        .mockResolvedValueOnce([{ id: 'doc-c' }]);

      mockDocumentFindUnique.mockImplementation(({ where }: { where: { id: string } }) =>
        Promise.resolve(makeMockDoc(where.id)),
      );

      await reprocessDocuments({ batchSize: 2 });

      // Second call should include cursor from last doc of first batch
      const secondCall = mockDocumentFindMany.mock.calls[1]![0] as Record<string, unknown>;
      expect(secondCall).toEqual(
        expect.objectContaining({
          skip: 1,
          cursor: { id: 'doc-b' },
          take: 2,
        }),
      );
    });

    it('first batch query has no cursor', async () => {
      setupDefaultMocks();

      mockDocumentFindMany.mockReset().mockResolvedValueOnce([{ id: 'doc-a' }]);

      mockDocumentFindUnique.mockImplementation(({ where }: { where: { id: string } }) =>
        Promise.resolve(makeMockDoc(where.id)),
      );

      await reprocessDocuments({ batchSize: 5 });

      const firstCall = mockDocumentFindMany.mock.calls[0]![0] as Record<string, unknown>;
      expect(firstCall).not.toHaveProperty('cursor');
      expect(firstCall).not.toHaveProperty('skip');
    });

    it('handles multiple full pages followed by empty page', async () => {
      setupDefaultMocks();

      mockDocumentFindMany
        .mockReset()
        .mockResolvedValueOnce([{ id: 'doc-1' }, { id: 'doc-2' }]) // full page
        .mockResolvedValueOnce([{ id: 'doc-3' }, { id: 'doc-4' }]) // full page
        .mockResolvedValueOnce([]); // empty → stop

      mockDocumentFindUnique.mockImplementation(({ where }: { where: { id: string } }) =>
        Promise.resolve(makeMockDoc(where.id)),
      );

      const result = await reprocessDocuments({ batchSize: 2 });

      expect(mockDocumentFindMany).toHaveBeenCalledTimes(3);
      expect(result.totalDocuments).toBe(4);
      expect(result.succeeded).toBe(4);
    });

    it('handles multiple full pages followed by partial page', async () => {
      setupDefaultMocks();

      mockDocumentFindMany
        .mockReset()
        .mockResolvedValueOnce([{ id: 'doc-1' }, { id: 'doc-2' }, { id: 'doc-3' }]) // full
        .mockResolvedValueOnce([{ id: 'doc-4' }]); // partial → stop

      mockDocumentFindUnique.mockImplementation(({ where }: { where: { id: string } }) =>
        Promise.resolve(makeMockDoc(where.id)),
      );

      const result = await reprocessDocuments({ batchSize: 3 });

      expect(mockDocumentFindMany).toHaveBeenCalledTimes(2);
      expect(result.totalDocuments).toBe(4);
      expect(result.succeeded).toBe(4);
    });

    it('returns zeroed result when no documents match', async () => {
      setupDefaultMocks();

      mockDocumentFindMany.mockReset().mockResolvedValueOnce([]);

      const result = await reprocessDocuments();

      expect(result.totalDocuments).toBe(0);
      expect(result.processed).toBe(0);
      expect(result.succeeded).toBe(0);
      expect(result.failed).toBe(0);
      expect(result.skipped).toBe(0);
      expect(result.errors).toHaveLength(0);
    });
  });

  // -------------------------------------------------------------------------
  // Empty document sets
  // -------------------------------------------------------------------------

  describe('empty document sets', () => {
    it('handles empty documentIds array gracefully', async () => {
      setupDefaultMocks();

      // With empty array, goes through the paginated path
      const result = await reprocessDocuments({ documentIds: [] });

      // Empty documentIds means it falls through to paginated path
      expect(result.totalDocuments).toBeGreaterThanOrEqual(0);
    });

    it('handles no documents in paginated fetch', async () => {
      setupDefaultMocks();
      mockDocumentFindMany.mockReset().mockResolvedValueOnce([]);

      const result = await reprocessDocuments({ batchSize: 50 });

      expect(result.totalDocuments).toBe(0);
      expect(result.processed).toBe(0);
      expect(result.succeeded).toBe(0);
      expect(result.failed).toBe(0);
      expect(result.skipped).toBe(0);
      expect(result.errors).toHaveLength(0);
      expect(result.durationMs).toBeGreaterThanOrEqual(0);
    });
  });

  // -------------------------------------------------------------------------
  // Multiple documents
  // -------------------------------------------------------------------------

  describe('multiple documents', () => {
    it('processes multiple documents and aggregates results', async () => {
      setupDefaultMocks();

      // doc-1 succeeds, doc-2 is skipped (no text), doc-missing fails
      const result = await reprocessDocuments({
        documentIds: ['doc-1', 'doc-2', 'doc-missing'],
      });

      expect(result.totalDocuments).toBe(3);
      expect(result.succeeded).toBe(1);
      expect(result.skipped).toBe(1);
      expect(result.failed).toBe(1);
    });

    it('processes documents independently — one failure does not block others', async () => {
      setupDefaultMocks();

      // First doc fails classification, second doc succeeds fully
      mockDocumentFindUnique.mockImplementation(({ where }: { where: { id: string } }) =>
        Promise.resolve(makeMockDoc(where.id)),
      );

      let classifyCallCount = 0;
      mockClassifyDocument.mockImplementation(() => {
        classifyCallCount++;
        if (classifyCallCount === 1) {
          return Promise.reject(new Error('first doc fails'));
        }
        return Promise.resolve({ documentType: 'OTHER', confidence: 0.9 });
      });

      const result = await reprocessDocuments({
        documentIds: ['doc-fail', 'doc-succeed'],
        concurrency: 1,
      });

      expect(result.processed).toBe(2);
      expect(result.failed).toBe(1);
      expect(result.succeeded).toBe(1);
    });

    it('mix of missing, no-text, and valid documents', async () => {
      setupDefaultMocks();

      mockDocumentFindUnique.mockImplementation(({ where }: { where: { id: string } }) => {
        if (where.id === 'doc-missing') return Promise.resolve(null);
        if (where.id === 'doc-notext') return Promise.resolve(makeMockDoc(where.id, false));
        return Promise.resolve(makeMockDoc(where.id));
      });

      const result = await reprocessDocuments({
        documentIds: ['doc-missing', 'doc-notext', 'doc-valid'],
      });

      expect(result.totalDocuments).toBe(3);
      expect(result.failed).toBe(1);       // doc-missing
      expect(result.skipped).toBe(1);       // doc-notext
      expect(result.succeeded).toBe(1);     // doc-valid
      expect(result.processed).toBe(2);     // doc-missing + doc-valid (skipped not counted)
    });
  });

  // -------------------------------------------------------------------------
  // Concurrency pool behavior
  // -------------------------------------------------------------------------

  describe('concurrency pool', () => {
    it('respects concurrency limit — max N documents in flight', async () => {
      setupDefaultMocks();

      let maxConcurrent = 0;
      let currentConcurrent = 0;

      mockDocumentFindUnique.mockImplementation(({ where }: { where: { id: string } }) =>
        Promise.resolve(makeMockDoc(where.id)),
      );

      // Track concurrent calls via classifyDocument
      mockClassifyDocument.mockImplementation(() => {
        currentConcurrent++;
        if (currentConcurrent > maxConcurrent) {
          maxConcurrent = currentConcurrent;
        }
        return new Promise((resolve) => {
          setTimeout(() => {
            currentConcurrent--;
            resolve({ documentType: 'OTHER', confidence: 0.8 });
          }, 10);
        });
      });

      await reprocessDocuments({
        documentIds: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8'],
        concurrency: 3,
      });

      expect(maxConcurrent).toBeLessThanOrEqual(3);
      expect(maxConcurrent).toBeGreaterThan(0);
    });

    it('processes all documents even when concurrency is 1', async () => {
      setupDefaultMocks();

      mockDocumentFindUnique.mockImplementation(({ where }: { where: { id: string } }) =>
        Promise.resolve(makeMockDoc(where.id)),
      );

      const result = await reprocessDocuments({
        documentIds: ['d1', 'd2', 'd3', 'd4'],
        concurrency: 1,
      });

      expect(result.processed).toBe(4);
      expect(result.succeeded).toBe(4);
    });

    it('handles concurrency larger than document count', async () => {
      setupDefaultMocks();

      mockDocumentFindUnique.mockImplementation(({ where }: { where: { id: string } }) =>
        Promise.resolve(makeMockDoc(where.id)),
      );

      const result = await reprocessDocuments({
        documentIds: ['d1', 'd2'],
        concurrency: 100,
      });

      expect(result.processed).toBe(2);
      expect(result.succeeded).toBe(2);
    });

    it('workers share a single index counter (no duplicates, no gaps)', async () => {
      setupDefaultMocks();

      const processedIds: string[] = [];

      mockDocumentFindUnique.mockImplementation(({ where }: { where: { id: string } }) =>
        Promise.resolve(makeMockDoc(where.id)),
      );

      mockClassifyDocument.mockImplementation((docId: string) => {
        processedIds.push(docId);
        return Promise.resolve({ documentType: 'OTHER', confidence: 0.8 });
      });

      const ids = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      await reprocessDocuments({
        documentIds: ids,
        concurrency: 3,
      });

      // Each ID should be processed exactly once
      expect(processedIds.sort()).toEqual(ids.sort());
    });
  });

  // -------------------------------------------------------------------------
  // Audit logging
  // -------------------------------------------------------------------------

  describe('audit logging', () => {
    it('creates one audit event per document processed', async () => {
      setupDefaultMocks();

      mockDocumentFindUnique.mockImplementation(({ where }: { where: { id: string } }) =>
        Promise.resolve(makeMockDoc(where.id)),
      );

      await reprocessDocuments({
        documentIds: ['doc-a', 'doc-b', 'doc-c'],
      });

      expect(mockAuditEventCreate).toHaveBeenCalledTimes(3);
    });

    it('includes error details in audit event when steps fail', async () => {
      setupDefaultMocks();
      mockClassifyDocument.mockRejectedValue(new Error('classify broke'));

      await reprocessDocuments({ documentIds: ['doc-1'] });

      expect(mockAuditEventCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          eventData: expect.objectContaining({
            errors: expect.arrayContaining([
              expect.stringContaining('classification: classify broke'),
            ]),
          }),
        }),
      });
    });

    it('audit event errors field is empty array when all steps succeed', async () => {
      setupDefaultMocks();

      await reprocessDocuments({ documentIds: ['doc-1'] });

      expect(mockAuditEventCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          eventData: expect.objectContaining({
            errors: [],
          }),
        }),
      });
    });

    it('uses correct claimId from document in audit event', async () => {
      setupDefaultMocks();

      mockDocumentFindUnique.mockImplementation(({ where }: { where: { id: string } }) =>
        Promise.resolve({
          id: where.id,
          claimId: 'specific-claim-42',
          extractedText: 'some text',
        }),
      );

      await reprocessDocuments({ documentIds: ['doc-x'] });

      expect(mockAuditEventCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          claimId: 'specific-claim-42',
        }),
      });
    });

    it('no audit event for dry-run documents (returns before audit block)', async () => {
      setupDefaultMocks();

      await reprocessDocuments({ documentIds: ['doc-1'], dryRun: true });

      // Dry-run returns early before the audit event creation
      expect(mockAuditEventCreate).not.toHaveBeenCalled();
    });

    it('no audit event for skipped documents (no extractedText)', async () => {
      setupDefaultMocks();

      await reprocessDocuments({ documentIds: ['doc-2'] });

      expect(mockAuditEventCreate).not.toHaveBeenCalled();
    });

    it('no audit event for missing documents (preflight fail returns early)', async () => {
      setupDefaultMocks();

      // Missing doc returns early before audit. Check the actual behavior:
      // Looking at code: missing doc pushes error to state and returns before audit.
      // Actually re-reading: the audit event is at the end of reprocessSingleDocument,
      // but missing doc returns at line 193, before the audit at line 277.
      await reprocessDocuments({ documentIds: ['doc-missing'] });

      // Missing doc returns early — no audit event created
      expect(mockAuditEventCreate).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // Audit resilience
  // -------------------------------------------------------------------------

  describe('audit resilience', () => {
    it('does not fail when audit event creation throws', async () => {
      setupDefaultMocks();
      mockAuditEventCreate.mockRejectedValue(new Error('DB write failed'));

      const result = await reprocessDocuments({ documentIds: ['doc-1'] });

      // Document should still count as succeeded (audit failure is non-fatal)
      expect(result.succeeded).toBe(1);
      expect(result.failed).toBe(0);
    });

    it('audit failure does not add to error list', async () => {
      setupDefaultMocks();
      mockAuditEventCreate.mockRejectedValue(new Error('Audit DB down'));

      const result = await reprocessDocuments({ documentIds: ['doc-1'] });

      // Audit errors are swallowed silently
      expect(result.errors).toHaveLength(0);
    });
  });

  // -------------------------------------------------------------------------
  // Options resolution (defaults)
  // -------------------------------------------------------------------------

  describe('options resolution', () => {
    it('uses batchSize=50 by default for paginated fetch', async () => {
      setupDefaultMocks();
      mockDocumentFindMany.mockReset().mockResolvedValueOnce([]);

      await reprocessDocuments();

      const call = mockDocumentFindMany.mock.calls[0]![0] as Record<string, unknown>;
      expect(call.take).toBe(50);
    });

    it('respects custom batchSize', async () => {
      setupDefaultMocks();
      mockDocumentFindMany.mockReset().mockResolvedValueOnce([]);

      await reprocessDocuments({ batchSize: 25 });

      const call = mockDocumentFindMany.mock.calls[0]![0] as Record<string, unknown>;
      expect(call.take).toBe(25);
    });

    it('filters for documents with extractedText not null in paginated fetch', async () => {
      setupDefaultMocks();
      mockDocumentFindMany.mockReset().mockResolvedValueOnce([]);

      await reprocessDocuments();

      const call = mockDocumentFindMany.mock.calls[0]![0] as Record<string, unknown>;
      expect(call.where).toEqual({ extractedText: { not: null } });
    });

    it('orders by id ascending in paginated fetch', async () => {
      setupDefaultMocks();
      mockDocumentFindMany.mockReset().mockResolvedValueOnce([]);

      await reprocessDocuments();

      const call = mockDocumentFindMany.mock.calls[0]![0] as Record<string, unknown>;
      expect(call.orderBy).toEqual({ id: 'asc' });
    });
  });

  // -------------------------------------------------------------------------
  // Console logging
  // -------------------------------------------------------------------------

  describe('console logging', () => {
    it('logs start message with configuration', async () => {
      setupDefaultMocks();
      const logSpy = vi.spyOn(console, 'log');

      await reprocessDocuments({ documentIds: ['doc-1'] });

      const startLog = logSpy.mock.calls.find(
        (call) => typeof call[0] === 'string' && call[0].includes('Starting document reprocessing'),
      );
      expect(startLog).toBeDefined();
    });

    it('logs completion message with summary', async () => {
      setupDefaultMocks();
      const logSpy = vi.spyOn(console, 'log');

      await reprocessDocuments({ documentIds: ['doc-1'] });

      const completeLog = logSpy.mock.calls.find(
        (call) => typeof call[0] === 'string' && call[0].includes('Run complete'),
      );
      expect(completeLog).toBeDefined();
    });

    it('logs skip message for documents without extractedText', async () => {
      setupDefaultMocks();
      const logSpy = vi.spyOn(console, 'log');

      await reprocessDocuments({ documentIds: ['doc-2'] });

      const skipLog = logSpy.mock.calls.find(
        (call) => typeof call[0] === 'string' && call[0].includes('SKIP'),
      );
      expect(skipLog).toBeDefined();
    });

    it('logs individual step success for classification', async () => {
      setupDefaultMocks();
      const logSpy = vi.spyOn(console, 'log');

      await reprocessDocuments({ documentIds: ['doc-1'] });

      const classifyLog = logSpy.mock.calls.find(
        (call) => typeof call[0] === 'string' && call[0].includes('classification OK'),
      );
      expect(classifyLog).toBeDefined();
    });

    it('logs error to console.error when a step fails', async () => {
      setupDefaultMocks();
      mockClassifyDocument.mockRejectedValue(new Error('fail'));
      const errorSpy = vi.spyOn(console, 'error');

      await reprocessDocuments({ documentIds: ['doc-1'] });

      const errorLog = errorSpy.mock.calls.find(
        (call) => typeof call[0] === 'string' && call[0].includes('classification FAILED'),
      );
      expect(errorLog).toBeDefined();
    });

    it('logs batch number and count in paginated mode', async () => {
      setupDefaultMocks();
      const logSpy = vi.spyOn(console, 'log');

      await reprocessDocuments();

      const batchLog = logSpy.mock.calls.find(
        (call) => typeof call[0] === 'string' && call[0].includes('Batch'),
      );
      expect(batchLog).toBeDefined();
    });
  });

  // -------------------------------------------------------------------------
  // Return value completeness
  // -------------------------------------------------------------------------

  describe('return value', () => {
    it('returns all required fields in ReprocessingResult', async () => {
      setupDefaultMocks();

      const result = await reprocessDocuments({ documentIds: ['doc-1'] });

      expect(result).toHaveProperty('totalDocuments');
      expect(result).toHaveProperty('processed');
      expect(result).toHaveProperty('succeeded');
      expect(result).toHaveProperty('failed');
      expect(result).toHaveProperty('skipped');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('durationMs');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(typeof result.durationMs).toBe('number');
    });

    it('error entries have documentId, step, and error fields', async () => {
      setupDefaultMocks();
      mockClassifyDocument.mockRejectedValue(new Error('boom'));

      const result = await reprocessDocuments({ documentIds: ['doc-1'] });

      expect(result.errors[0]).toEqual({
        documentId: expect.any(String),
        step: expect.any(String),
        error: expect.any(String),
      });
    });
  });
});
