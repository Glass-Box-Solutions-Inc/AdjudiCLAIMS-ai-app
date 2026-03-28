import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Field extraction service tests.
 *
 * Covers extractFields() with both regex and LLM extraction paths,
 * deduplication, and persistence.
 */

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockDocumentFindUnique = vi.fn();
const mockExtractedFieldDeleteMany = vi.fn();
const mockExtractedFieldCreateMany = vi.fn();
const mockGenerate = vi.fn();

vi.mock('../../server/db.js', () => ({
  prisma: {
    document: {
      findUnique: (...args: unknown[]) => mockDocumentFindUnique(...args) as unknown,
    },
    extractedField: {
      deleteMany: (...args: unknown[]) => mockExtractedFieldDeleteMany(...args) as unknown,
      createMany: (...args: unknown[]) => mockExtractedFieldCreateMany(...args) as unknown,
    },
  },
}));

vi.mock('../../server/lib/llm/index.js', () => ({
  getLLMAdapter: vi.fn(() => ({
    provider: 'gemini',
    modelId: 'gemini-2.0-flash-lite',
    generate: mockGenerate,
    generateStructured: vi.fn(),
    classify: vi.fn(),
  })),
}));

const { extractFields } = await import('../../server/services/field-extraction.service.js');

describe('Field Extraction Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExtractedFieldDeleteMany.mockResolvedValue({ count: 0 });
    mockExtractedFieldCreateMany.mockResolvedValue({ count: 0 });
  });

  // -------------------------------------------------------------------------
  // Error cases
  // -------------------------------------------------------------------------

  it('throws when document not found', async () => {
    mockDocumentFindUnique.mockResolvedValueOnce(null);
    await expect(extractFields('doc-missing')).rejects.toThrow('Document not found');
  });

  it('throws when document has no extracted text', async () => {
    mockDocumentFindUnique.mockResolvedValueOnce({
      extractedText: null,
      documentType: null,
    });
    await expect(extractFields('doc-notext')).rejects.toThrow('has no extracted text');
  });

  // -------------------------------------------------------------------------
  // Regex extraction — dates
  // -------------------------------------------------------------------------

  it('extracts dates in MM/DD/YYYY format', async () => {
    mockDocumentFindUnique.mockResolvedValueOnce({
      extractedText: 'Date of injury: 01/15/2026. Follow up on 2026-03-20.',
      documentType: null,
    });
    mockGenerate.mockResolvedValueOnce({
      content: '', finishReason: 'STUB',
      provider: 'gemini', model: 'test', usage: { inputTokens: 0, outputTokens: 0 },
    });

    const fields = await extractFields('doc-dates');
    const dateFields = fields.filter(f => f.fieldName === 'date');
    expect(dateFields.length).toBeGreaterThanOrEqual(2);
    expect(dateFields.some(f => f.fieldValue === '01/15/2026')).toBe(true);
    expect(dateFields.some(f => f.fieldValue === '2026-03-20')).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Regex extraction — dollar amounts
  // -------------------------------------------------------------------------

  it('extracts dollar amounts', async () => {
    mockDocumentFindUnique.mockResolvedValueOnce({
      extractedText: 'Total charges: $1,250.00 and copay $50.00',
      documentType: null,
    });
    mockGenerate.mockResolvedValueOnce({
      content: '', finishReason: 'STUB',
      provider: 'gemini', model: 'test', usage: { inputTokens: 0, outputTokens: 0 },
    });

    const fields = await extractFields('doc-dollars');
    const dollarFields = fields.filter(f => f.fieldName === 'dollarAmount');
    expect(dollarFields.length).toBeGreaterThanOrEqual(2);
    expect(dollarFields.some(f => f.fieldValue === '1,250.00')).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Regex extraction — claim numbers
  // -------------------------------------------------------------------------

  it('extracts claim numbers', async () => {
    mockDocumentFindUnique.mockResolvedValueOnce({
      extractedText: 'Claim #06349136 was filed. ADJ12345678 assigned.',
      documentType: null,
    });
    mockGenerate.mockResolvedValueOnce({
      content: '', finishReason: 'STUB',
      provider: 'gemini', model: 'test', usage: { inputTokens: 0, outputTokens: 0 },
    });

    const fields = await extractFields('doc-claims');
    const claimFields = fields.filter(f => f.fieldName === 'claimNumber');
    expect(claimFields.length).toBeGreaterThanOrEqual(2);
  });

  // -------------------------------------------------------------------------
  // Regex extraction — SSN masked
  // -------------------------------------------------------------------------

  it('masks SSN in hyphenated format', async () => {
    mockDocumentFindUnique.mockResolvedValueOnce({
      extractedText: 'SSN: 123-45-6789',
      documentType: null,
    });
    mockGenerate.mockResolvedValueOnce({
      content: '', finishReason: 'STUB',
      provider: 'gemini', model: 'test', usage: { inputTokens: 0, outputTokens: 0 },
    });

    const fields = await extractFields('doc-ssn');
    const ssnFields = fields.filter(f => f.fieldName === 'ssnMasked');
    expect(ssnFields.length).toBeGreaterThanOrEqual(1);
    expect(ssnFields[0]!.fieldValue).toBe('XXX-XX-6789');
  });

  // -------------------------------------------------------------------------
  // Regex extraction — person names
  // -------------------------------------------------------------------------

  it('extracts person names', async () => {
    mockDocumentFindUnique.mockResolvedValueOnce({
      extractedText: 'Patient: John Smith was seen by Dr. Jane Wilson.',
      documentType: null,
    });
    mockGenerate.mockResolvedValueOnce({
      content: '', finishReason: 'STUB',
      provider: 'gemini', model: 'test', usage: { inputTokens: 0, outputTokens: 0 },
    });

    const fields = await extractFields('doc-names');
    const nameFields = fields.filter(f => f.fieldName === 'personName');
    expect(nameFields.length).toBeGreaterThanOrEqual(1);
  });

  // -------------------------------------------------------------------------
  // LLM extraction — STUB mode (no API key)
  // -------------------------------------------------------------------------

  it('skips LLM extraction when adapter returns STUB', async () => {
    mockDocumentFindUnique.mockResolvedValueOnce({
      extractedText: 'Simple text with date 03/20/2026.',
      documentType: 'MEDICAL_REPORT',
    });
    mockGenerate.mockResolvedValueOnce({
      content: '', finishReason: 'STUB',
      provider: 'gemini', model: 'test', usage: { inputTokens: 0, outputTokens: 0 },
    });

    const fields = await extractFields('doc-stub');
    // Only regex fields should be present
    expect(fields.length).toBeGreaterThan(0);
    expect(mockExtractedFieldCreateMany).toHaveBeenCalledOnce();
  });

  // -------------------------------------------------------------------------
  // LLM extraction — valid response
  // -------------------------------------------------------------------------

  it('merges LLM fields with regex fields and deduplicates', async () => {
    mockDocumentFindUnique.mockResolvedValueOnce({
      extractedText: 'Date of injury: 01/15/2026',
      documentType: 'DWC1_CLAIM_FORM',
    });
    mockGenerate.mockResolvedValueOnce({
      content: JSON.stringify([
        { fieldName: 'date', fieldValue: '01/15/2026', confidence: 0.95, sourcePage: 1 },
        { fieldName: 'claimantName', fieldValue: 'John Doe', confidence: 0.90, sourcePage: 1 },
      ]),
      finishReason: 'stop',
      provider: 'gemini', model: 'test', usage: { inputTokens: 100, outputTokens: 50 },
    });

    const fields = await extractFields('doc-merge');
    // Should have deduped date (LLM higher confidence wins) + claimantName
    const dateFields = fields.filter(f => f.fieldName === 'date' && f.fieldValue === '01/15/2026');
    expect(dateFields).toHaveLength(1);
    expect(dateFields[0]!.confidence).toBe(0.95); // LLM wins over regex 0.85
    expect(fields.some(f => f.fieldName === 'claimantName')).toBe(true);
  });

  // -------------------------------------------------------------------------
  // LLM extraction — error handling
  // -------------------------------------------------------------------------

  it('falls back to regex-only when LLM throws', async () => {
    mockDocumentFindUnique.mockResolvedValueOnce({
      extractedText: 'Date: 03/20/2026 Amount: $500.00',
      documentType: 'BILLING_STATEMENT',
    });
    mockGenerate.mockRejectedValueOnce(new Error('Rate limit exceeded'));

    const fields = await extractFields('doc-llm-error');
    // Should still have regex fields
    expect(fields.length).toBeGreaterThan(0);
    expect(fields.some(f => f.fieldName === 'date')).toBe(true);
    expect(fields.some(f => f.fieldName === 'dollarAmount')).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Persistence
  // -------------------------------------------------------------------------

  it('does not persist when no fields extracted', async () => {
    mockDocumentFindUnique.mockResolvedValueOnce({
      extractedText: 'no extractable content here',
      documentType: null,
    });
    mockGenerate.mockResolvedValueOnce({
      content: '', finishReason: 'STUB',
      provider: 'gemini', model: 'test', usage: { inputTokens: 0, outputTokens: 0 },
    });

    const fields = await extractFields('doc-nopersist');
    expect(fields).toEqual([]);
    expect(mockExtractedFieldDeleteMany).not.toHaveBeenCalled();
    expect(mockExtractedFieldCreateMany).not.toHaveBeenCalled();
  });

  it('deletes existing fields before creating new ones', async () => {
    mockDocumentFindUnique.mockResolvedValueOnce({
      extractedText: 'Date: 01/01/2026',
      documentType: null,
    });
    mockGenerate.mockResolvedValueOnce({
      content: '', finishReason: 'STUB',
      provider: 'gemini', model: 'test', usage: { inputTokens: 0, outputTokens: 0 },
    });

    await extractFields('doc-persist');

    expect(mockExtractedFieldDeleteMany).toHaveBeenCalledWith({
      where: { documentId: 'doc-persist' },
    });
    expect(mockExtractedFieldCreateMany).toHaveBeenCalledOnce();
  });

  // -------------------------------------------------------------------------
  // LLM extraction — invalid response items filtered
  // -------------------------------------------------------------------------

  it('filters out invalid items from LLM response', async () => {
    mockDocumentFindUnique.mockResolvedValueOnce({
      extractedText: 'text',
      documentType: null,
    });
    mockGenerate.mockResolvedValueOnce({
      content: JSON.stringify([
        { fieldName: 'valid', fieldValue: 'yes', confidence: 0.9, sourcePage: null },
        { badField: 'invalid' },
        'not an object',
        null,
      ]),
      finishReason: 'stop',
      provider: 'gemini', model: 'test', usage: { inputTokens: 100, outputTokens: 50 },
    });

    const fields = await extractFields('doc-filter');
    const llmFields = fields.filter(f => f.fieldName === 'valid');
    expect(llmFields).toHaveLength(1);
  });

  // -------------------------------------------------------------------------
  // LLM extraction — non-array response
  // -------------------------------------------------------------------------

  it('throws when LLM returns non-array JSON', async () => {
    mockDocumentFindUnique.mockResolvedValueOnce({
      extractedText: 'Date: 01/01/2026',
      documentType: null,
    });
    mockGenerate.mockResolvedValueOnce({
      content: '{"not": "an array"}',
      finishReason: 'stop',
      provider: 'gemini', model: 'test', usage: { inputTokens: 100, outputTokens: 50 },
    });

    // Non-array response causes throw in extractWithClaude, but caught
    // in extractFields — falls back to regex-only
    const fields = await extractFields('doc-nonarray');
    // Should still have regex fields
    expect(fields.some(f => f.fieldName === 'date')).toBe(true);
  });

  // -------------------------------------------------------------------------
  // LLM extraction — empty content
  // -------------------------------------------------------------------------

  it('falls back to regex when LLM returns empty content', async () => {
    mockDocumentFindUnique.mockResolvedValueOnce({
      extractedText: 'Date: 01/01/2026',
      documentType: null,
    });
    mockGenerate.mockResolvedValueOnce({
      content: '',
      finishReason: 'stop',
      provider: 'gemini', model: 'test', usage: { inputTokens: 100, outputTokens: 50 },
    });

    // Empty content causes throw, caught by extractFields
    const fields = await extractFields('doc-empty');
    expect(fields.some(f => f.fieldName === 'date')).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Document type-specific extraction prompts
  // -------------------------------------------------------------------------

  it('generates document-type-specific extraction prompt for MEDICAL_REPORT', async () => {
    mockDocumentFindUnique.mockResolvedValueOnce({
      extractedText: 'WPI rating of 12% for lumbar spine. Date: 01/15/2026',
      documentType: 'MEDICAL_REPORT',
    });
    mockGenerate.mockResolvedValueOnce({
      content: JSON.stringify([
        { fieldName: 'wpiRating', fieldValue: '12%', confidence: 0.95, sourcePage: null },
      ]),
      finishReason: 'stop',
      provider: 'gemini', model: 'test', usage: { inputTokens: 100, outputTokens: 50 },
    });

    const fields = await extractFields('doc-medical');
    // The LLM was called (for non-STUB response)
    expect(mockGenerate).toHaveBeenCalledOnce();
    expect(fields.some(f => f.fieldName === 'wpiRating')).toBe(true);
  });
});
