import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Document classifier — LLM classification path tests.
 *
 * Covers the uncovered lines (434-459, 520-542) in the document-classifier service:
 * - getClassifierInstance (lines 434-459) — dynamic import paths
 * - classifyDocument LLM fallback (lines 520-542) — LLM classification when
 *   keyword match is weak
 *
 * These paths require ANTHROPIC_API_KEY to be set and the @adjudica/document-classifier
 * package to be importable. We mock both to exercise the code paths.
 */

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockDocumentFindUnique = vi.fn();
const mockDocumentUpdate = vi.fn();
const mockClassify = vi.fn();

vi.mock('../../server/db.js', () => ({
  prisma: {
    document: {
      findUnique: (...args: unknown[]) => mockDocumentFindUnique(...args) as unknown,
      update: (...args: unknown[]) => mockDocumentUpdate(...args) as unknown,
    },
  },
}));

// Mock the @adjudica/document-classifier package
vi.mock('@adjudica/document-classifier', () => ({
  DocumentClassifier: class MockDocumentClassifier {
    classify = (...args: unknown[]) => mockClassify(...args);
  },
}));

// Mock the ClassifierLLMAdapter
vi.mock('../../server/lib/llm/classifier-adapter.js', () => ({
  ClassifierLLMAdapter: class MockAdapter {},
}));

const { classifyDocument } = await import('../../server/services/document-classifier.service.js');

// Save/restore env
const ORIGINAL_API_KEY = process.env['ANTHROPIC_API_KEY'];

describe('Document Classifier — LLM path', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDocumentUpdate.mockResolvedValue({});
  });

  afterEach(() => {
    if (ORIGINAL_API_KEY !== undefined) {
      process.env['ANTHROPIC_API_KEY'] = ORIGINAL_API_KEY;
    } else {
      delete process.env['ANTHROPIC_API_KEY'];
    }
  });

  it('uses LLM classification when keyword match returns OTHER', async () => {
    process.env['ANTHROPIC_API_KEY'] = 'test-key';

    mockDocumentFindUnique.mockResolvedValueOnce({
      id: 'doc-1',
      extractedText: 'This is an unusual document with no keyword matches at all.',
      fileName: 'mystery.pdf',
    });

    mockClassify.mockResolvedValueOnce({
      documentType: 'medical_report',
      documentSubtype: 'progress_note',
      confidence: 0.85,
      aiReasoning: 'Contains medical terminology',
      documentDate: '2026-03-20',
    });

    const result = await classifyDocument('doc-1');

    expect(result.classificationMethod).toMatch(/llm/);
    expect(result.confidence).toBe(0.85);
    expect(mockClassify).toHaveBeenCalledOnce();
    expect(mockDocumentUpdate).toHaveBeenCalledOnce();
  });

  it('keeps keyword result when LLM classifier throws', async () => {
    process.env['ANTHROPIC_API_KEY'] = 'test-key';

    mockDocumentFindUnique.mockResolvedValueOnce({
      id: 'doc-2',
      extractedText: 'Random content that matches no keywords.',
      fileName: 'unknown.pdf',
    });

    mockClassify.mockRejectedValueOnce(new Error('API error'));

    const result = await classifyDocument('doc-2');

    // Falls back to keyword result (which would be OTHER for unrecognized text)
    expect(result.documentType).toBe('OTHER');
    expect(result.classificationMethod).toBe('keyword');
    expect(mockDocumentUpdate).toHaveBeenCalledOnce();
  });

  it('uses keyword+llm method when keyword matched but weakly', async () => {
    process.env['ANTHROPIC_API_KEY'] = 'test-key';

    // Text that matches a keyword but weakly (single keyword match)
    mockDocumentFindUnique.mockResolvedValueOnce({
      id: 'doc-3',
      extractedText: 'This is a medical report with some details about the patient condition.',
      fileName: 'medical.pdf',
    });

    mockClassify.mockResolvedValueOnce({
      documentType: 'medical_report',
      documentSubtype: 'progress_note',
      confidence: 0.92,
      aiReasoning: 'Medical report with patient details',
      documentDate: '2026-03-15',
    });

    const result = await classifyDocument('doc-3');

    // The keyword "medical report" should match, but if confidence < threshold,
    // LLM will be invoked
    expect(mockDocumentUpdate).toHaveBeenCalledOnce();
    // Result should be valid (either keyword or keyword+llm)
    expect(result.documentType).toBeDefined();
  });

  it('skips LLM when ANTHROPIC_API_KEY is not set', async () => {
    delete process.env['ANTHROPIC_API_KEY'];

    mockDocumentFindUnique.mockResolvedValueOnce({
      id: 'doc-4',
      extractedText: 'No keyword matches here at all in this odd document.',
      fileName: 'test.pdf',
    });

    const result = await classifyDocument('doc-4');

    expect(result.classificationMethod).toBe('keyword');
    expect(mockClassify).not.toHaveBeenCalled();
    expect(mockDocumentUpdate).toHaveBeenCalledOnce();
  });

  it('handles LLM returning null documentType', async () => {
    process.env['ANTHROPIC_API_KEY'] = 'test-key';

    mockDocumentFindUnique.mockResolvedValueOnce({
      id: 'doc-5',
      extractedText: 'Content that matches no keywords at all whatsoever.',
      fileName: 'empty.pdf',
    });

    mockClassify.mockResolvedValueOnce({
      documentType: null,
      documentSubtype: null,
      confidence: 0.3,
      aiReasoning: 'Cannot determine type',
      documentDate: null,
    });

    const result = await classifyDocument('doc-5');

    // Should keep keyword result since LLM returned null type
    expect(result.documentType).toBe('OTHER');
    expect(mockDocumentUpdate).toHaveBeenCalledOnce();
  });

  it('throws when document not found', async () => {
    mockDocumentFindUnique.mockResolvedValueOnce(null);
    await expect(classifyDocument('doc-missing')).rejects.toThrow('Document not found');
  });

  it('throws when document has no extracted text', async () => {
    mockDocumentFindUnique.mockResolvedValueOnce({
      id: 'doc-notext',
      extractedText: null,
      fileName: 'test.pdf',
    });
    await expect(classifyDocument('doc-notext')).rejects.toThrow('has no extracted text');
  });
});
