import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * UPL Output Validator — full coverage tests.
 *
 * Covers validateOutputFull() (async, two-stage pipeline) and parseLlmValidationResponse
 * (indirectly through validateOutputFull). The synchronous validateOutput() is already
 * well-tested in upl-validator.test.ts; this file focuses on the async LLM integration
 * path, edge cases in response parsing, and zone-specific validation behavior.
 *
 * Mocks: server/lib/llm/index.js (getLLMAdapter) to control LLM responses.
 */

// ---------------------------------------------------------------------------
// Mock LLM adapter
// ---------------------------------------------------------------------------

const mockGenerate = vi.fn();

vi.mock('../../server/lib/llm/index.js', () => ({
  getLLMAdapter: vi.fn(() => ({
    generate: mockGenerate,
  })),
  _resetAdapterCache: vi.fn(),
}));

// Dynamic import after mocks
const { validateOutput, validateOutputFull } = await import(
  '../../server/services/upl-validator.service.js'
);

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('UPL Output Validator — validateOutputFull (async pipeline)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // Stage 1 short-circuit: regex catches critical violation, LLM not called
  // -------------------------------------------------------------------------

  describe('Stage 1 short-circuit (regex catches critical)', () => {
    it('returns FAIL and does NOT call LLM when regex finds a critical violation', async () => {
      const result = await validateOutputFull('I recommend denying this claim.');

      expect(result.result).toBe('FAIL');
      expect(result.violations.length).toBeGreaterThan(0);
      expect(result.violations[0]!.severity).toBe('CRITICAL');
      expect(mockGenerate).not.toHaveBeenCalled();
    });

    it('populates suggestedRewrites when regex violations found', async () => {
      const result = await validateOutputFull('You should deny this claim based on the medical evidence.');

      expect(result.result).toBe('FAIL');
      expect(result.suggestedRewrites).toBeDefined();
      expect(result.suggestedRewrites!.size).toBeGreaterThan(0);
    });

    it('catches multiple regex violations without calling LLM', async () => {
      const text =
        'I recommend settling. The best strategy is early resolution. Coverage exists for this injury.';
      const result = await validateOutputFull(text);

      expect(result.result).toBe('FAIL');
      expect(result.violations.length).toBeGreaterThanOrEqual(3);
      expect(mockGenerate).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // Stage 2: LLM validation runs when regex passes
  // -------------------------------------------------------------------------

  describe('Stage 2: LLM validation (regex passes, LLM runs)', () => {
    it('returns PASS when regex passes and LLM finds no violations', async () => {
      mockGenerate.mockResolvedValueOnce({
        content: '[]',
        finishReason: 'STOP',
      });

      const result = await validateOutputFull('The QME report indicates 12% WPI for the lumbar spine.');

      expect(result.result).toBe('PASS');
      expect(result.violations).toHaveLength(0);
      expect(mockGenerate).toHaveBeenCalledOnce();
    });

    it('returns FAIL with WARNING violations when LLM detects subtle advisory language', async () => {
      mockGenerate.mockResolvedValueOnce({
        content: JSON.stringify([
          {
            matchedText: 'this claim appears to have merit',
            reason: 'Implies case strength assessment',
            suggestion: 'Remove case merit assessment.',
          },
        ]),
        finishReason: 'STOP',
      });

      const result = await validateOutputFull('Based on the records, this claim appears to have merit.');

      expect(result.result).toBe('FAIL');
      expect(result.violations).toHaveLength(1);
      expect(result.violations[0]!.severity).toBe('WARNING');
      expect(result.violations[0]!.pattern).toBe('llm_detected');
      expect(result.violations[0]!.position).toBe(-1);
      expect(result.suggestedRewrites).toBeDefined();
      expect(result.suggestedRewrites!.size).toBe(1);
    });

    it('returns FAIL when LLM detects multiple violations', async () => {
      mockGenerate.mockResolvedValueOnce({
        content: JSON.stringify([
          { matchedText: 'text1', reason: 'reason1', suggestion: 'fix1' },
          { matchedText: 'text2', reason: 'reason2', suggestion: 'fix2' },
        ]),
        finishReason: 'STOP',
      });

      const result = await validateOutputFull('Neutral text that LLM flags.');

      expect(result.result).toBe('FAIL');
      expect(result.violations).toHaveLength(2);
    });

    it('uses suggestion field when present, falls back to reason when suggestion absent', async () => {
      mockGenerate.mockResolvedValueOnce({
        content: JSON.stringify([
          { matchedText: 'with suggestion', reason: 'some reason', suggestion: 'fix this' },
          { matchedText: 'without suggestion', reason: 'fallback reason' },
        ]),
        finishReason: 'STOP',
      });

      const result = await validateOutputFull('Test text for suggestion fallback.');

      expect(result.violations).toHaveLength(2);
      expect(result.violations[0]!.suggestion).toBe('fix this');
      expect(result.violations[1]!.suggestion).toBe('fallback reason');
    });

    it('uses default suggestion when both suggestion and reason are missing', async () => {
      mockGenerate.mockResolvedValueOnce({
        content: JSON.stringify([
          { matchedText: 'problematic text', reason: 123 },
        ]),
        finishReason: 'STOP',
      });

      const result = await validateOutputFull('Test text for default suggestion.');

      expect(result.violations).toHaveLength(1);
      expect(result.violations[0]!.suggestion).toBe('Review and revise this language');
    });

    it('handles matchedText being non-string (coerced to empty string)', async () => {
      mockGenerate.mockResolvedValueOnce({
        content: JSON.stringify([
          { matchedText: 42, reason: 'numeric matchedText' },
        ]),
        finishReason: 'STOP',
      });

      const result = await validateOutputFull('Test text.');

      expect(result.violations).toHaveLength(1);
      expect(result.violations[0]!.matchedText).toBe('');
    });
  });

  // -------------------------------------------------------------------------
  // Stage 2: LLM STUB responses (no API key configured)
  // -------------------------------------------------------------------------

  describe('Stage 2: STUB responses (no API key)', () => {
    it('returns PASS when LLM returns STUB finishReason (no API key configured)', async () => {
      mockGenerate.mockResolvedValueOnce({
        content: '',
        finishReason: 'STUB',
      });

      const result = await validateOutputFull('The QME report indicates 12% WPI.');

      expect(result.result).toBe('PASS');
      expect(result.violations).toHaveLength(0);
    });

    it('skips LLM violation parsing when finishReason is STUB even if content has JSON', async () => {
      mockGenerate.mockResolvedValueOnce({
        content: '[{"matchedText":"test","reason":"test"}]',
        finishReason: 'STUB',
      });

      const result = await validateOutputFull('Neutral factual text.');

      expect(result.result).toBe('PASS');
      expect(result.violations).toHaveLength(0);
    });
  });

  // -------------------------------------------------------------------------
  // Stage 2: LLM error handling
  // -------------------------------------------------------------------------

  describe('Stage 2: LLM error resilience', () => {
    it('returns PASS when LLM throws an error (regex passed, LLM fails gracefully)', async () => {
      mockGenerate.mockRejectedValueOnce(new Error('LLM API timeout'));

      const result = await validateOutputFull('The claimant reached MMI on February 15, 2025.');

      expect(result.result).toBe('PASS');
      expect(result.violations).toHaveLength(0);
    });

    it('returns PASS when LLM returns malformed JSON', async () => {
      mockGenerate.mockResolvedValueOnce({
        content: 'This is not valid JSON at all',
        finishReason: 'STOP',
      });

      const result = await validateOutputFull('The QME report indicates 12% WPI.');

      expect(result.result).toBe('PASS');
      expect(result.violations).toHaveLength(0);
    });

    it('returns PASS when LLM returns invalid JSON structure (not an array)', async () => {
      mockGenerate.mockResolvedValueOnce({
        content: '{"not": "an array"}',
        finishReason: 'STOP',
      });

      const result = await validateOutputFull('Factual text about TD payments.');

      expect(result.result).toBe('PASS');
      expect(result.violations).toHaveLength(0);
    });

    it('returns PASS when LLM returns empty content', async () => {
      mockGenerate.mockResolvedValueOnce({
        content: '',
        finishReason: 'STOP',
      });

      const result = await validateOutputFull('Neutral text.');

      expect(result.result).toBe('PASS');
      expect(result.violations).toHaveLength(0);
    });

    it('returns PASS when LLM returns null content', async () => {
      mockGenerate.mockResolvedValueOnce({
        content: null,
        finishReason: 'STOP',
      });

      const result = await validateOutputFull('Neutral text.');

      expect(result.result).toBe('PASS');
      expect(result.violations).toHaveLength(0);
    });
  });

  // -------------------------------------------------------------------------
  // LLM response parsing edge cases
  // -------------------------------------------------------------------------

  describe('LLM response parsing edge cases', () => {
    it('extracts JSON array embedded in surrounding text', async () => {
      mockGenerate.mockResolvedValueOnce({
        content: 'Here are the violations I found:\n[{"matchedText":"advisory text","reason":"contains advice"}]\nEnd of review.',
        finishReason: 'STOP',
      });

      const result = await validateOutputFull('Test text for embedded JSON.');

      expect(result.violations).toHaveLength(1);
      expect(result.violations[0]!.pattern).toBe('llm_detected');
    });

    it('skips array items missing required fields (matchedText or reason)', async () => {
      mockGenerate.mockResolvedValueOnce({
        content: JSON.stringify([
          { matchedText: 'valid', reason: 'valid reason' },
          { noMatchedText: 'invalid' },
          { matchedText: 'also valid', reason: 'another reason' },
          'not an object',
          null,
        ]),
        finishReason: 'STOP',
      });

      const result = await validateOutputFull('Test text for field filtering.');

      expect(result.violations).toHaveLength(2);
    });

    it('handles empty array from LLM (no violations found)', async () => {
      mockGenerate.mockResolvedValueOnce({
        content: '[]',
        finishReason: 'STOP',
      });

      const result = await validateOutputFull('Clean factual text.');

      expect(result.result).toBe('PASS');
      expect(result.violations).toHaveLength(0);
      expect(result.suggestedRewrites).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // Combined regex + LLM violations (should not occur in practice since
  // regex short-circuits, but validates merge logic)
  // -------------------------------------------------------------------------

  describe('suggestedRewrites map behavior', () => {
    it('returns undefined suggestedRewrites when no violations at all', async () => {
      mockGenerate.mockResolvedValueOnce({
        content: '[]',
        finishReason: 'STOP',
      });

      const result = await validateOutputFull('Per LC 4653, TD rate is 2/3 of AWE.');

      expect(result.suggestedRewrites).toBeUndefined();
    });

    it('maps each violation matchedText to its suggestion', async () => {
      mockGenerate.mockResolvedValueOnce({
        content: JSON.stringify([
          { matchedText: 'phrase A', reason: 'reason A', suggestion: 'fix A' },
          { matchedText: 'phrase B', reason: 'reason B', suggestion: 'fix B' },
        ]),
        finishReason: 'STOP',
      });

      const result = await validateOutputFull('Test text for rewrite map.');

      expect(result.suggestedRewrites).toBeDefined();
      expect(result.suggestedRewrites!.get('phrase A')).toBe('fix A');
      expect(result.suggestedRewrites!.get('phrase B')).toBe('fix B');
    });
  });
});

// ---------------------------------------------------------------------------
// Additional validateOutput() (sync) edge cases for full coverage
// ---------------------------------------------------------------------------

describe('UPL Output Validator — additional sync coverage', () => {
  it('returns PASS result type for clean text', () => {
    const result = validateOutput('The claimant has been off work since the date of injury.');
    expect(result.result).toBe('PASS');
    expect(result.violations).toHaveLength(0);
    expect(result.suggestedRewrites).toBeUndefined();
  });

  it('returns FAIL result type with violations for prohibited text', () => {
    const result = validateOutput('I recommend denying this claim.');
    expect(result.result).toBe('FAIL');
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.suggestedRewrites).toBeDefined();
  });

  it('detects all 11 patterns when combined in one text', () => {
    const text = [
      'You should deny this claim.',
      'I recommend settling.',
      'The best strategy is to litigate.',
      'The law requires you to pay.',
      'This claim is worth $100K.',
      'This is a strong case.',
      'Under Benson v. WCAB, apportionment applies.',
      'Coverage exists for this injury.',
      'Liability is clear on this claim.',
      'The applicant will likely prevail.',
      'You should reject the demand.',
    ].join(' ');

    const result = validateOutput(text);
    expect(result.result).toBe('FAIL');

    const patterns = new Set(result.violations.map((v) => v.pattern));
    expect(patterns.has('recommendation_action')).toBe(true);
    expect(patterns.has('direct_recommendation')).toBe(true);
    expect(patterns.has('strategy_advice')).toBe(true);
    expect(patterns.has('legal_directive')).toBe(true);
    expect(patterns.has('case_valuation')).toBe(true);
    expect(patterns.has('case_strength')).toBe(true);
    expect(patterns.has('case_law_interpretation')).toBe(true);
    expect(patterns.has('coverage_determination')).toBe(true);
    expect(patterns.has('liability_assessment')).toBe(true);
    expect(patterns.has('outcome_prediction')).toBe(true);
    expect(patterns.has('direct_decision_advice')).toBe(true);
  });

  it('finds multiple matches of the same pattern in one text', () => {
    const text = 'I recommend denying coverage. Also, I suggest settling the claim.';
    const result = validateOutput(text);

    expect(result.result).toBe('FAIL');
    const recPatterns = result.violations.filter((v) => v.pattern === 'direct_recommendation');
    expect(recPatterns.length).toBe(2);
  });

  it('violation position is accurate for second match', () => {
    const prefix = 'Clean text here. ';
    const text = prefix + 'I recommend settling.';
    const result = validateOutput(text);

    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.violations[0]!.position).toBe(prefix.length);
  });
});
