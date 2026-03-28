import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * UPL Classifier — LLM pipeline tests.
 *
 * Tests the async classifyQuery() function and the internal parseLlmResponse
 * / classifyByLlm code paths (lines 267-376) that are NOT covered by the
 * keyword-only classifyQuerySync tests in upl-classifier.test.ts.
 *
 * Mocks: server/lib/llm/index.js (getLLMAdapter)
 */

// ---------------------------------------------------------------------------
// Mock LLM adapter
// ---------------------------------------------------------------------------

const mockGenerate = vi.fn();

vi.mock('../../server/lib/llm/index.js', () => ({
  getLLMAdapter: vi.fn(() => ({
    provider: 'gemini',
    modelId: 'gemini-2.0-flash-lite',
    generate: mockGenerate,
    generateStructured: vi.fn(),
    classify: vi.fn(),
  })),
}));

// Dynamic import after mocks
const { classifyQuery } = await import('../../server/services/upl-classifier.service.js');

describe('UPL Classifier — LLM pipeline (classifyQuery)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // Keyword fast-path (no LLM call)
  // -------------------------------------------------------------------------

  it('returns keyword result without LLM call when regex matches (RED)', async () => {
    const result = await classifyQuery('Should I deny this claim?');
    expect(result.zone).toBe('RED');
    expect(result.confidence).toBeGreaterThan(0.8);
    expect(mockGenerate).not.toHaveBeenCalled();
  });

  it('returns keyword result without LLM call when regex matches (GREEN)', async () => {
    const result = await classifyQuery('What WPI did the doctor find?');
    expect(result.zone).toBe('GREEN');
    expect(mockGenerate).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // LLM classification (Stage 2) — stub mode
  // -------------------------------------------------------------------------

  it('falls back to classifyQuerySync when LLM returns STUB', async () => {
    mockGenerate.mockResolvedValueOnce({
      content: '',
      finishReason: 'STUB',
      provider: 'gemini',
      model: 'gemini-2.0-flash-lite',
      usage: { inputTokens: 0, outputTokens: 0 },
    });

    // This query matches no regex pattern
    const result = await classifyQuery('Tell me about the weather in Sacramento.');
    expect(result.zone).toBe('YELLOW');
    expect(result.reason).toContain('keyword-only mode');
    expect(mockGenerate).toHaveBeenCalledOnce();
  });

  // -------------------------------------------------------------------------
  // LLM classification — valid JSON response
  // -------------------------------------------------------------------------

  it('parses valid GREEN LLM response', async () => {
    mockGenerate.mockResolvedValueOnce({
      content: '{"zone": "GREEN", "reason": "Factual data query", "confidence": 0.92}',
      finishReason: 'stop',
      provider: 'gemini',
      model: 'gemini-2.0-flash-lite',
      usage: { inputTokens: 100, outputTokens: 50 },
    });

    const result = await classifyQuery('Some novel query that no regex matches');
    expect(result.zone).toBe('GREEN');
    expect(result.reason).toBe('Factual data query');
    expect(result.confidence).toBe(0.92);
    expect(result.isAdversarial).toBe(false);
  });

  it('parses valid RED LLM response', async () => {
    mockGenerate.mockResolvedValueOnce({
      content: '{"zone": "RED", "reason": "Legal analysis requested", "confidence": 0.95}',
      finishReason: 'stop',
      provider: 'gemini',
      model: 'gemini-2.0-flash-lite',
      usage: { inputTokens: 100, outputTokens: 50 },
    });

    const result = await classifyQuery('Some novel RED query');
    expect(result.zone).toBe('RED');
    expect(result.reason).toBe('Legal analysis requested');
    expect(result.confidence).toBe(0.95);
  });

  it('parses valid YELLOW LLM response', async () => {
    mockGenerate.mockResolvedValueOnce({
      content: '{"zone": "YELLOW", "reason": "Borderline query", "confidence": 0.7}',
      finishReason: 'stop',
      provider: 'gemini',
      model: 'gemini-2.0-flash-lite',
      usage: { inputTokens: 100, outputTokens: 50 },
    });

    const result = await classifyQuery('Some novel YELLOW query');
    expect(result.zone).toBe('YELLOW');
    expect(result.reason).toBe('Borderline query');
  });

  // -------------------------------------------------------------------------
  // LLM classification — JSON embedded in markdown code block
  // -------------------------------------------------------------------------

  it('extracts JSON from markdown code blocks', async () => {
    mockGenerate.mockResolvedValueOnce({
      content: '```json\n{"zone": "GREEN", "reason": "safe query", "confidence": 0.88}\n```',
      finishReason: 'stop',
      provider: 'gemini',
      model: 'gemini-2.0-flash-lite',
      usage: { inputTokens: 100, outputTokens: 50 },
    });

    const result = await classifyQuery('A novel query');
    expect(result.zone).toBe('GREEN');
    expect(result.reason).toBe('safe query');
  });

  // -------------------------------------------------------------------------
  // LLM classification — parse failure cases (conservative RED default)
  // -------------------------------------------------------------------------

  it('returns RED when LLM response has no JSON', async () => {
    mockGenerate.mockResolvedValueOnce({
      content: 'I think this is a GREEN query because it asks for factual data.',
      finishReason: 'stop',
      provider: 'gemini',
      model: 'gemini-2.0-flash-lite',
      usage: { inputTokens: 100, outputTokens: 50 },
    });

    const result = await classifyQuery('A novel query no regex');
    expect(result.zone).toBe('RED');
    expect(result.reason).toContain('could not be parsed');
  });

  it('returns RED when LLM response JSON is missing required fields', async () => {
    mockGenerate.mockResolvedValueOnce({
      content: '{"zone": "GREEN"}',
      finishReason: 'stop',
      provider: 'gemini',
      model: 'gemini-2.0-flash-lite',
      usage: { inputTokens: 100, outputTokens: 50 },
    });

    const result = await classifyQuery('A novel query no regex');
    expect(result.zone).toBe('RED');
    expect(result.reason).toContain('missing required fields');
  });

  it('returns RED when LLM response has invalid zone value', async () => {
    mockGenerate.mockResolvedValueOnce({
      content: '{"zone": "BLUE", "reason": "test", "confidence": 0.9}',
      finishReason: 'stop',
      provider: 'gemini',
      model: 'gemini-2.0-flash-lite',
      usage: { inputTokens: 100, outputTokens: 50 },
    });

    const result = await classifyQuery('A novel query no regex');
    expect(result.zone).toBe('RED');
    expect(result.reason).toContain('invalid field types');
  });

  it('returns RED when confidence is not a number', async () => {
    mockGenerate.mockResolvedValueOnce({
      content: '{"zone": "GREEN", "reason": "test", "confidence": "high"}',
      finishReason: 'stop',
      provider: 'gemini',
      model: 'gemini-2.0-flash-lite',
      usage: { inputTokens: 100, outputTokens: 50 },
    });

    const result = await classifyQuery('A novel query no regex');
    expect(result.zone).toBe('RED');
    expect(result.reason).toContain('invalid field types');
  });

  it('returns RED when reason is not a string', async () => {
    mockGenerate.mockResolvedValueOnce({
      content: '{"zone": "GREEN", "reason": 42, "confidence": 0.9}',
      finishReason: 'stop',
      provider: 'gemini',
      model: 'gemini-2.0-flash-lite',
      usage: { inputTokens: 100, outputTokens: 50 },
    });

    const result = await classifyQuery('A novel query no regex');
    expect(result.zone).toBe('RED');
    expect(result.reason).toContain('invalid field types');
  });

  it('returns RED when LLM returns empty content', async () => {
    mockGenerate.mockResolvedValueOnce({
      content: '',
      finishReason: 'stop',
      provider: 'gemini',
      model: 'gemini-2.0-flash-lite',
      usage: { inputTokens: 100, outputTokens: 50 },
    });

    const result = await classifyQuery('A novel query no regex');
    expect(result.zone).toBe('RED');
    expect(result.reason).toContain('no text content');
  });

  it('clamps confidence to [0, 1] range', async () => {
    mockGenerate.mockResolvedValueOnce({
      content: '{"zone": "GREEN", "reason": "safe", "confidence": 1.5}',
      finishReason: 'stop',
      provider: 'gemini',
      model: 'gemini-2.0-flash-lite',
      usage: { inputTokens: 100, outputTokens: 50 },
    });

    const result = await classifyQuery('A novel query no regex');
    expect(result.zone).toBe('GREEN');
    expect(result.confidence).toBe(1);
  });

  it('clamps negative confidence to 0', async () => {
    mockGenerate.mockResolvedValueOnce({
      content: '{"zone": "GREEN", "reason": "safe", "confidence": -0.5}',
      finishReason: 'stop',
      provider: 'gemini',
      model: 'gemini-2.0-flash-lite',
      usage: { inputTokens: 100, outputTokens: 50 },
    });

    const result = await classifyQuery('A novel query no regex');
    expect(result.confidence).toBe(0);
  });

  // -------------------------------------------------------------------------
  // LLM errors — graceful fallback to RED
  // -------------------------------------------------------------------------

  it('returns RED on LLM adapter throw (Error instance)', async () => {
    mockGenerate.mockRejectedValueOnce(new Error('API key invalid'));

    const result = await classifyQuery('A novel query no regex');
    expect(result.zone).toBe('RED');
    expect(result.reason).toContain('LLM classification error');
    expect(result.reason).toContain('API key invalid');
  });

  it('returns RED on LLM adapter throw (non-Error)', async () => {
    mockGenerate.mockRejectedValueOnce('string error');

    const result = await classifyQuery('A novel query no regex');
    expect(result.zone).toBe('RED');
    expect(result.reason).toContain('Unknown error');
  });

  // -------------------------------------------------------------------------
  // JSON parse error in response
  // -------------------------------------------------------------------------

  it('returns RED on malformed JSON in LLM response', async () => {
    mockGenerate.mockResolvedValueOnce({
      content: '{zone: GREEN, broken json}',
      finishReason: 'stop',
      provider: 'gemini',
      model: 'gemini-2.0-flash-lite',
      usage: { inputTokens: 100, outputTokens: 50 },
    });

    const result = await classifyQuery('A novel query no regex');
    expect(result.zone).toBe('RED');
    expect(result.reason).toContain('parse error');
  });
});
