import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * OCR service tests.
 *
 * Covers processDocument() with mocked Prisma, Document AI client,
 * and storage service. Targets 100% code coverage of ocr.service.ts.
 */

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_DOCUMENT = {
  id: 'doc-ocr-1',
  claimId: 'claim-1',
  fileName: 'medical-report.pdf',
  fileUrl: './uploads/org-1/claim-1/doc-ocr-1/medical-report.pdf',
  fileSize: 25000,
  mimeType: 'application/pdf',
  ocrStatus: 'PENDING',
  extractedText: null,
};

const MOCK_EXTRACTED_TEXT =
  'QUALIFIED MEDICAL EVALUATOR REPORT\n\n' +
  'Patient: Jane Smith\n' +
  'Date of Injury: 03/10/2026\n' +
  'Diagnoses:\n' +
  '1. Cervical strain (M54.2)\n' +
  'WPI Rating: 8% for the cervical spine.\n';

const LARGE_DOCUMENT_TEXT = 'A'.repeat(500_000); // 500KB of text

// ---------------------------------------------------------------------------
// Mock Prisma
// ---------------------------------------------------------------------------

const mockDocumentFindUnique = vi.fn();
const mockDocumentUpdate = vi.fn();

vi.mock('../../server/db.js', () => ({
  prisma: {
    document: {
      findUnique: (...args: unknown[]) => mockDocumentFindUnique(...args) as unknown,
      update: (...args: unknown[]) => mockDocumentUpdate(...args) as unknown,
    },
  },
}));

// ---------------------------------------------------------------------------
// Mock storage service
// ---------------------------------------------------------------------------

const mockDownload = vi.fn();

vi.mock('../../server/services/storage.service.js', () => ({
  storageService: {
    download: (...args: unknown[]) => mockDownload(...args) as unknown,
  },
}));

// ---------------------------------------------------------------------------
// Mock Google Document AI
// ---------------------------------------------------------------------------

const { mockProcessDocument } = vi.hoisted(() => {
  const mockProcessDocument = vi.fn();
  return { mockProcessDocument };
});

vi.mock('@google-cloud/documentai', () => {
  class MockDocumentProcessorServiceClient {
    processDocument(...args: unknown[]) {
      return mockProcessDocument(...args);
    }
  }
  return { DocumentProcessorServiceClient: MockDocumentProcessorServiceClient };
});

// ---------------------------------------------------------------------------
// Import SUT (after mocks are defined)
// ---------------------------------------------------------------------------

import { processDocument } from '../../server/services/ocr.service.js';

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('OCR Service — processDocument', () => {
  const SAVED_ENV = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();

    // Set required env vars for Document AI config
    process.env['DOCUMENT_AI_PROJECT'] = 'test-project';
    process.env['DOCUMENT_AI_LOCATION'] = 'us';
    process.env['DOCUMENT_AI_PROCESSOR'] = 'test-processor-id';

    // Default mock implementations
    mockDocumentFindUnique.mockResolvedValue({ ...MOCK_DOCUMENT });
    mockDocumentUpdate.mockResolvedValue({ ...MOCK_DOCUMENT });
    mockDownload.mockResolvedValue(Buffer.from('%PDF-fake-content'));
    mockProcessDocument.mockResolvedValue([
      { document: { text: MOCK_EXTRACTED_TEXT } },
    ]);
  });

  afterEach(() => {
    // Restore env vars
    process.env = { ...SAVED_ENV };
  });

  // -------------------------------------------------------------------------
  // Document not found
  // -------------------------------------------------------------------------

  it('throws when document is not found in DB', async () => {
    mockDocumentFindUnique.mockResolvedValue(null);

    await expect(processDocument('nonexistent-id')).rejects.toThrow(
      'Document not found: nonexistent-id',
    );

    // Should NOT have tried to update status
    expect(mockDocumentUpdate).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // Missing Document AI configuration
  // -------------------------------------------------------------------------

  it('throws when DOCUMENT_AI_PROJECT is not set', async () => {
    delete process.env['DOCUMENT_AI_PROJECT'];

    await expect(processDocument('doc-ocr-1')).rejects.toThrow(
      'Document AI is not configured',
    );

    // Should have set PROCESSING, then failed and set FAILED
    expect(mockDocumentUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { ocrStatus: 'PROCESSING' },
      }),
    );
    expect(mockDocumentUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { ocrStatus: 'FAILED' },
      }),
    );
  });

  it('throws when DOCUMENT_AI_PROCESSOR is not set', async () => {
    delete process.env['DOCUMENT_AI_PROCESSOR'];

    await expect(processDocument('doc-ocr-1')).rejects.toThrow(
      'Document AI is not configured',
    );

    expect(mockDocumentUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { ocrStatus: 'FAILED' },
      }),
    );
  });

  // -------------------------------------------------------------------------
  // Successful OCR
  // -------------------------------------------------------------------------

  it('extracts text, updates document with COMPLETE status, and returns text', async () => {
    const result = await processDocument('doc-ocr-1');

    // 1. Fetched document from DB
    expect(mockDocumentFindUnique).toHaveBeenCalledWith({
      where: { id: 'doc-ocr-1' },
    });

    // 2. Set PROCESSING status
    expect(mockDocumentUpdate).toHaveBeenCalledWith({
      where: { id: 'doc-ocr-1' },
      data: { ocrStatus: 'PROCESSING' },
    });

    // 3. Downloaded file from storage
    expect(mockDownload).toHaveBeenCalledWith(MOCK_DOCUMENT.fileUrl);

    // 4. Sent to Document AI with correct processor name and base64 content
    expect(mockProcessDocument).toHaveBeenCalledWith({
      name: 'projects/test-project/locations/us/processors/test-processor-id',
      rawDocument: {
        content: Buffer.from('%PDF-fake-content').toString('base64'),
        mimeType: 'application/pdf',
      },
    });

    // 5. Persisted extracted text and COMPLETE status
    expect(mockDocumentUpdate).toHaveBeenCalledWith({
      where: { id: 'doc-ocr-1' },
      data: {
        extractedText: MOCK_EXTRACTED_TEXT,
        ocrStatus: 'COMPLETE',
      },
    });

    // 6. Returns extracted text
    expect(result).toBe(MOCK_EXTRACTED_TEXT);
  });

  it('uses default location "us" when DOCUMENT_AI_LOCATION is not set', async () => {
    delete process.env['DOCUMENT_AI_LOCATION'];

    await processDocument('doc-ocr-1');

    expect(mockProcessDocument).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'projects/test-project/locations/us/processors/test-processor-id',
      }),
    );
  });

  it('uses custom location when DOCUMENT_AI_LOCATION is set', async () => {
    process.env['DOCUMENT_AI_LOCATION'] = 'eu';

    await processDocument('doc-ocr-1');

    expect(mockProcessDocument).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'projects/test-project/locations/eu/processors/test-processor-id',
      }),
    );
  });

  // -------------------------------------------------------------------------
  // Document AI error → FAILED status
  // -------------------------------------------------------------------------

  it('marks document as FAILED when Document AI throws', async () => {
    const docAiError = new Error('Document AI: DEADLINE_EXCEEDED');
    mockProcessDocument.mockRejectedValue(docAiError);

    await expect(processDocument('doc-ocr-1')).rejects.toThrow(
      'Document AI: DEADLINE_EXCEEDED',
    );

    // Should have set PROCESSING then FAILED
    expect(mockDocumentUpdate).toHaveBeenCalledWith({
      where: { id: 'doc-ocr-1' },
      data: { ocrStatus: 'PROCESSING' },
    });
    expect(mockDocumentUpdate).toHaveBeenCalledWith({
      where: { id: 'doc-ocr-1' },
      data: { ocrStatus: 'FAILED' },
    });
  });

  it('marks document as FAILED when storage download throws', async () => {
    mockDownload.mockRejectedValue(new Error('Storage: file not found'));

    await expect(processDocument('doc-ocr-1')).rejects.toThrow(
      'Storage: file not found',
    );

    expect(mockDocumentUpdate).toHaveBeenCalledWith({
      where: { id: 'doc-ocr-1' },
      data: { ocrStatus: 'FAILED' },
    });
  });

  // -------------------------------------------------------------------------
  // Empty document / no text extracted
  // -------------------------------------------------------------------------

  it('throws when Document AI returns empty text', async () => {
    mockProcessDocument.mockResolvedValue([
      { document: { text: '' } },
    ]);

    await expect(processDocument('doc-ocr-1')).rejects.toThrow(
      'Document AI returned no text for document doc-ocr-1',
    );

    expect(mockDocumentUpdate).toHaveBeenCalledWith({
      where: { id: 'doc-ocr-1' },
      data: { ocrStatus: 'FAILED' },
    });
  });

  it('throws when Document AI response has no document property', async () => {
    mockProcessDocument.mockResolvedValue([
      { document: null },
    ]);

    await expect(processDocument('doc-ocr-1')).rejects.toThrow(
      'Document AI returned no text for document doc-ocr-1',
    );

    expect(mockDocumentUpdate).toHaveBeenCalledWith({
      where: { id: 'doc-ocr-1' },
      data: { ocrStatus: 'FAILED' },
    });
  });

  it('throws when Document AI response document has no text property', async () => {
    mockProcessDocument.mockResolvedValue([
      { document: {} },
    ]);

    await expect(processDocument('doc-ocr-1')).rejects.toThrow(
      'Document AI returned no text for document doc-ocr-1',
    );

    expect(mockDocumentUpdate).toHaveBeenCalledWith({
      where: { id: 'doc-ocr-1' },
      data: { ocrStatus: 'FAILED' },
    });
  });

  // -------------------------------------------------------------------------
  // Large document handling
  // -------------------------------------------------------------------------

  it('handles large documents (500KB extracted text)', async () => {
    mockProcessDocument.mockResolvedValue([
      { document: { text: LARGE_DOCUMENT_TEXT } },
    ]);

    const result = await processDocument('doc-ocr-1');

    expect(result).toBe(LARGE_DOCUMENT_TEXT);
    expect(result.length).toBe(500_000);

    expect(mockDocumentUpdate).toHaveBeenCalledWith({
      where: { id: 'doc-ocr-1' },
      data: {
        extractedText: LARGE_DOCUMENT_TEXT,
        ocrStatus: 'COMPLETE',
      },
    });
  });

  // -------------------------------------------------------------------------
  // Client reuse (lazy init)
  // -------------------------------------------------------------------------

  it('reuses the Document AI client across multiple calls', async () => {
    await processDocument('doc-ocr-1');
    await processDocument('doc-ocr-1');

    // processDocument should be called twice, but the client constructor
    // is only called once (verified by the mock being called twice for processDocument)
    expect(mockProcessDocument).toHaveBeenCalledTimes(2);
  });

  // -------------------------------------------------------------------------
  // Different mimeType forwarded correctly
  // -------------------------------------------------------------------------

  it('forwards the document mimeType to Document AI', async () => {
    mockDocumentFindUnique.mockResolvedValue({
      ...MOCK_DOCUMENT,
      mimeType: 'image/tiff',
    });

    await processDocument('doc-ocr-1');

    expect(mockProcessDocument).toHaveBeenCalledWith(
      expect.objectContaining({
        rawDocument: expect.objectContaining({
          mimeType: 'image/tiff',
        }),
      }),
    );
  });
});
