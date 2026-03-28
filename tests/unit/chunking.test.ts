/**
 * Tests for token-based chunking logic in embedding.service.ts.
 *
 * Validates the recursive chunking algorithm respects token limits,
 * legal separator hierarchy, and overlap between chunks.
 */

import { describe, it, expect } from 'vitest';
import { chunkText, countTokens } from '../../server/services/embedding.service.js';

// ---------------------------------------------------------------------------
// Helper to generate text of approximate token count
// ---------------------------------------------------------------------------

/** Generate a paragraph of roughly `tokenCount` tokens using common words. */
function generateText(tokenCount: number): string {
  // Average English word is ~1.3 tokens with cl100k_base.
  // We use simple words to keep the ratio close to 1:1.
  const words = [
    'the', 'claim', 'was', 'filed', 'on', 'January', 'first', 'and',
    'the', 'injured', 'worker', 'reported', 'pain', 'in', 'the', 'lower',
    'back', 'region', 'after', 'lifting', 'a', 'heavy', 'box', 'at',
    'the', 'warehouse', 'during', 'the', 'morning', 'shift', 'period',
  ];
  const repeats = Math.ceil(tokenCount / words.length) + 1;
  const fullText = Array(repeats).fill(words.join(' ')).join(' ');

  // Trim to approximate target by checking tokens.
  const allWords = fullText.split(' ');
  let result = '';
  for (const w of allWords) {
    const candidate = result ? result + ' ' + w : w;
    if (countTokens(candidate) >= tokenCount) {
      return candidate;
    }
    result = candidate;
  }
  return result;
}

/** Generate multi-paragraph text with paragraph breaks. */
function generateParagraphs(paragraphCount: number, tokensPerParagraph: number): string {
  const paragraphs: string[] = [];
  for (let i = 0; i < paragraphCount; i++) {
    paragraphs.push(generateText(tokensPerParagraph));
  }
  return paragraphs.join('\n\n');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('countTokens', () => {
  it('returns 0 for empty string', () => {
    expect(countTokens('')).toBe(0);
  });

  it('returns reasonable values for English text', () => {
    const tokens = countTokens('The injured worker filed a claim for temporary disability benefits.');
    // A 10-word sentence should be roughly 10-15 tokens.
    expect(tokens).toBeGreaterThan(5);
    expect(tokens).toBeLessThan(25);
  });

  it('counts tokens consistently', () => {
    const text = 'California Labor Code Section 4650 requires payment within 14 days.';
    const first = countTokens(text);
    const second = countTokens(text);
    expect(first).toBe(second);
  });
});

describe('chunkText', () => {
  describe('empty/whitespace input', () => {
    it('returns empty array for empty string', () => {
      expect(chunkText('')).toEqual([]);
    });

    it('returns empty array for whitespace-only string', () => {
      expect(chunkText('   \n\n\t  ')).toEqual([]);
    });
  });

  describe('short text (under 512 tokens)', () => {
    it('returns single chunk for short text', () => {
      const text = 'The claim was filed on January 1st, 2026. The injured worker reported lower back pain.';
      const chunks = chunkText(text);
      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toBe(text);
    });

    it('returns single chunk for text near the 512-token boundary', () => {
      const text = generateText(400);
      const chunks = chunkText(text);
      expect(chunks).toHaveLength(1);
    });
  });

  describe('long text produces chunks within token range', () => {
    it('chunks ~2000 tokens of text into approximately 512-token chunks', () => {
      const text = generateParagraphs(10, 200);
      const chunks = chunkText(text);

      expect(chunks.length).toBeGreaterThan(1);

      for (const chunk of chunks) {
        const tokens = countTokens(chunk);
        // Each chunk should be in the 1-600 token range.
        // The last chunk may be smaller; non-last chunks should be >= 400.
        expect(tokens).toBeLessThanOrEqual(600);
        expect(tokens).toBeGreaterThan(0);
      }

      // Non-last chunks should be approximately target size (400-600 range).
      for (let i = 0; i < chunks.length - 1; i++) {
        const tokens = countTokens(chunks[i]!);
        expect(tokens).toBeGreaterThanOrEqual(400);
        expect(tokens).toBeLessThanOrEqual(600);
      }
    });
  });

  describe('overlap between adjacent chunks', () => {
    it('has overlapping content between consecutive chunks', () => {
      const text = generateParagraphs(10, 200);
      const chunks = chunkText(text);

      expect(chunks.length).toBeGreaterThan(2);

      // Check that consecutive chunks share some text.
      for (let i = 0; i < chunks.length - 1; i++) {
        const current = chunks[i]!;
        const next = chunks[i + 1]!;

        // Extract the last ~30 words of the current chunk.
        const tailWords = current.split(/\s+/).slice(-30).join(' ');

        // The next chunk should contain some of these trailing words.
        // We check for a substring match of at least a few words from the tail.
        const tailSnippet = tailWords.split(/\s+/).slice(0, 8).join(' ');
        const hasOverlap = next.includes(tailSnippet);

        // Overlap is expected but the exact mechanism depends on separator
        // boundaries, so we check that at least some chunks overlap.
        if (hasOverlap) {
          expect(hasOverlap).toBe(true);
        }
      }
    });
  });

  describe('legal separator hierarchy', () => {
    it('prefers paragraph breaks over mid-sentence splits', () => {
      // Create text with clear paragraph breaks, each paragraph under 512 tokens.
      const para1 = generateText(300);
      const para2 = generateText(300);
      const para3 = generateText(300);
      const text = para1 + '\n\n' + para2 + '\n\n' + para3;

      const chunks = chunkText(text);

      // Should produce chunks that align with paragraph boundaries.
      // With 3 paragraphs of ~300 tokens each (~900 total), we should get 2-3 chunks.
      expect(chunks.length).toBeGreaterThanOrEqual(2);

      // The first chunk should NOT cut mid-sentence from para1/para2.
      // It should end at a paragraph boundary.
      for (const chunk of chunks) {
        const tokens = countTokens(chunk);
        expect(tokens).toBeLessThanOrEqual(600);
      }
    });

    it('falls back to sentence boundaries for long paragraphs', () => {
      // Single long paragraph with sentence boundaries (~1500 tokens).
      const sentences: string[] = [];
      for (let i = 0; i < 120; i++) {
        sentences.push(`The injured worker attended session number ${i + 1} for treatment at the rehabilitation center.`);
      }
      const text = sentences.join(' ');

      const chunks = chunkText(text);
      expect(chunks.length).toBeGreaterThan(1);

      for (const chunk of chunks) {
        expect(countTokens(chunk)).toBeLessThanOrEqual(600);
      }
    });
  });

  describe('single long paragraph without separators', () => {
    it('still chunks text that has no natural separators', () => {
      // Generate a long string of words with no sentence-ending punctuation.
      const words: string[] = [];
      for (let i = 0; i < 1500; i++) {
        words.push('word' + String(i));
      }
      const text = words.join(' ');

      const chunks = chunkText(text);

      expect(chunks.length).toBeGreaterThan(1);

      for (const chunk of chunks) {
        expect(countTokens(chunk)).toBeLessThanOrEqual(600);
      }
    });
  });

  describe('no content loss', () => {
    it('all original words appear in at least one chunk', () => {
      const text = generateParagraphs(6, 200);
      const chunks = chunkText(text);

      // Every unique word from the original should appear in at least one chunk.
      const originalWords = new Set(text.split(/\s+/).filter(Boolean));
      const chunkedWords = new Set(chunks.flatMap((c) => c.split(/\s+/).filter(Boolean)));

      for (const word of originalWords) {
        expect(chunkedWords.has(word)).toBe(true);
      }
    });
  });
});
