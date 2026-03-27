import { describe, it, expect } from 'vitest';

import {
  detectAtomicBlocks,
  splitTableIntoRowChunks,
  assignChunkFlags,
  type AtomicBlock,
} from '../../server/services/chunk-atomic.service.js';

// ---------------------------------------------------------------------------
// detectAtomicBlocks — tables
// ---------------------------------------------------------------------------

describe('detectAtomicBlocks', () => {
  describe('markdown pipe tables', () => {
    it('detects a simple markdown table', () => {
      const text = [
        '| Name | Value |',
        '|------|-------|',
        '| Alice | 100 |',
        '| Bob | 200 |',
      ].join('\n');

      const blocks = detectAtomicBlocks(text);
      expect(blocks).toHaveLength(1);
      expect(blocks[0]!.type).toBe('table');
      expect(blocks[0]!.tableHeader).toBe('| Name | Value |');
      expect(blocks[0]!.startOffset).toBe(0);
    });

    it('detects a pipe table embedded in surrounding text', () => {
      const text = [
        'Here is some intro text.',
        '',
        '| Col A | Col B |',
        '| val1 | val2 |',
        '| val3 | val4 |',
        '',
        'And some trailing text.',
      ].join('\n');

      const blocks = detectAtomicBlocks(text);
      const tables = blocks.filter((b) => b.type === 'table');
      expect(tables).toHaveLength(1);
      expect(tables[0]!.text).toContain('| Col A | Col B |');
    });
  });

  // ---------------------------------------------------------------------------
  // detectAtomicBlocks — numbered lists
  // ---------------------------------------------------------------------------

  describe('numbered lists', () => {
    it('detects decimal-dot numbered lists', () => {
      const text = [
        '1. First step',
        '2. Second step',
        '3. Third step',
      ].join('\n');

      const blocks = detectAtomicBlocks(text);
      const lists = blocks.filter((b) => b.type === 'numbered_list');
      expect(lists).toHaveLength(1);
      expect(lists[0]!.text).toContain('1. First step');
      expect(lists[0]!.text).toContain('3. Third step');
    });

    it('detects parenthetical numbered lists', () => {
      const text = [
        '1) Do this',
        '2) Do that',
        '3) Do the other',
      ].join('\n');

      const blocks = detectAtomicBlocks(text);
      const lists = blocks.filter((b) => b.type === 'numbered_list');
      expect(lists).toHaveLength(1);
    });

    it('detects letter-labeled lists', () => {
      const text = [
        '(a) Requirement one',
        '(b) Requirement two',
        '(c) Requirement three',
      ].join('\n');

      const blocks = detectAtomicBlocks(text);
      const lists = blocks.filter((b) => b.type === 'numbered_list');
      expect(lists).toHaveLength(1);
      expect(lists[0]!.text).toContain('(a) Requirement one');
    });

    it('detects Step N format', () => {
      const text = [
        'Step 1 Review the claim',
        'Step 2 Check the deadlines',
        'Step 3 Calculate benefits',
      ].join('\n');

      const blocks = detectAtomicBlocks(text);
      const lists = blocks.filter((b) => b.type === 'numbered_list');
      expect(lists).toHaveLength(1);
    });

    it('does not detect a single numbered item as a list', () => {
      const text = '1. Only one item here';
      const blocks = detectAtomicBlocks(text);
      const lists = blocks.filter((b) => b.type === 'numbered_list');
      expect(lists).toHaveLength(0);
    });
  });

  // ---------------------------------------------------------------------------
  // detectAtomicBlocks — legal citations
  // ---------------------------------------------------------------------------

  describe('legal citations', () => {
    it('detects Labor Code section references', () => {
      const text = 'The employer must comply with Labor Code § 4650 within 14 days. Other text follows.';
      const blocks = detectAtomicBlocks(text);
      const citations = blocks.filter((b) => b.type === 'legal_citation');
      expect(citations).toHaveLength(1);
      expect(citations[0]!.text).toContain('Labor Code § 4650');
    });

    it('detects LC shorthand citations', () => {
      const text = 'Per LC § 3208 the definition of injury applies broadly.';
      const blocks = detectAtomicBlocks(text);
      const citations = blocks.filter((b) => b.type === 'legal_citation');
      expect(citations).toHaveLength(1);
      expect(citations[0]!.text).toContain('LC § 3208');
    });

    it('detects California Code of Regulations references', () => {
      const text = 'According to Cal. Code Regs. title 8, the timeline is strict.';
      const blocks = detectAtomicBlocks(text);
      const citations = blocks.filter((b) => b.type === 'legal_citation');
      expect(citations).toHaveLength(1);
    });

    it('detects 8 CCR section references', () => {
      const text = 'Under 8 CCR § 10109 the employer must respond promptly.';
      const blocks = detectAtomicBlocks(text);
      const citations = blocks.filter((b) => b.type === 'legal_citation');
      expect(citations).toHaveLength(1);
    });

    it('detects WCAB references', () => {
      const text = 'The WCAB held in Smith v. Acme Corp that benefits were due.';
      const blocks = detectAtomicBlocks(text);
      const citations = blocks.filter((b) => b.type === 'legal_citation');
      expect(citations).toHaveLength(1);
    });
  });

  // ---------------------------------------------------------------------------
  // Edge cases
  // ---------------------------------------------------------------------------

  describe('edge cases', () => {
    it('returns empty array for empty text', () => {
      expect(detectAtomicBlocks('')).toEqual([]);
    });

    it('returns empty array for null-ish input', () => {
      expect(detectAtomicBlocks(undefined as unknown as string)).toEqual([]);
    });

    it('returns empty array for plain text with no atomic blocks', () => {
      const text = 'This is just regular prose with no special structures at all.';
      expect(detectAtomicBlocks(text)).toEqual([]);
    });

    it('returns blocks sorted by startOffset', () => {
      const text = [
        '1. First item',
        '2. Second item',
        '',
        'See Labor Code § 4650 for the payment deadline.',
      ].join('\n');

      const blocks = detectAtomicBlocks(text);
      for (let i = 1; i < blocks.length; i++) {
        expect(blocks[i]!.startOffset).toBeGreaterThanOrEqual(blocks[i - 1]!.startOffset);
      }
    });
  });
});

// ---------------------------------------------------------------------------
// splitTableIntoRowChunks
// ---------------------------------------------------------------------------

describe('splitTableIntoRowChunks', () => {
  const makeTable = (rows: string[]): AtomicBlock => {
    const text = rows.join('\n');
    return {
      type: 'table',
      startOffset: 0,
      endOffset: text.length,
      text,
      tableHeader: rows[0],
    };
  };

  it('returns header+row pairs when table exceeds maxTokens', () => {
    const table = makeTable([
      '| Name | Score |',
      '|------|-------|',
      '| Alice | 95 |',
      '| Bob | 87 |',
      '| Carol | 91 |',
    ]);

    // Use a very small maxTokens to force splitting
    const result = splitTableIntoRowChunks(table, 1);
    expect(result).toHaveLength(3); // 3 data rows
    expect(result[0]).toBe('| Name | Score |\n| Alice | 95 |');
    expect(result[1]).toBe('| Name | Score |\n| Bob | 87 |');
    expect(result[2]).toBe('| Name | Score |\n| Carol | 91 |');
  });

  it('returns whole table when it fits within maxTokens', () => {
    const table = makeTable([
      '| A | B |',
      '| 1 | 2 |',
    ]);

    const result = splitTableIntoRowChunks(table, 10000);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(table.text);
  });

  it('returns raw text for non-table blocks', () => {
    const block: AtomicBlock = {
      type: 'numbered_list',
      startOffset: 0,
      endOffset: 10,
      text: '1. Item\n2. Item',
    };

    const result = splitTableIntoRowChunks(block, 100);
    expect(result).toEqual([block.text]);
  });
});

// ---------------------------------------------------------------------------
// assignChunkFlags
// ---------------------------------------------------------------------------

describe('assignChunkFlags', () => {
  it('marks chunks that contain a table', () => {
    const text = 'Intro.\n| A | B |\n| 1 | 2 |\nOutro.';
    const tableBlock: AtomicBlock = {
      type: 'table',
      startOffset: 7,
      endOffset: 27,
      text: '| A | B |\n| 1 | 2 |',
    };

    // Chunk that includes the table region
    const chunks = ['Intro.\n| A | B |\n| 1 | 2 |\nOutro.'];
    const flags = assignChunkFlags(chunks, text, [tableBlock]);

    expect(flags).toHaveLength(1);
    expect(flags[0]!.containsTable).toBe(true);
    expect(flags[0]!.containsProcedure).toBe(false);
  });

  it('marks chunks that contain a procedure', () => {
    const text = '1. Step one\n2. Step two\n3. Step three';
    const listBlock: AtomicBlock = {
      type: 'numbered_list',
      startOffset: 0,
      endOffset: text.length,
      text,
    };

    const chunks = [text];
    const flags = assignChunkFlags(chunks, text, [listBlock]);

    expect(flags[0]!.containsProcedure).toBe(true);
    expect(flags[0]!.containsTable).toBe(false);
  });

  it('detects continuation between overlapping chunks', () => {
    const text = 'AAAAABBBBBCCCCC';
    // Overlapping chunks: chars 0-9 and chars 5-14
    const chunk1 = 'AAAAABBBBB';
    const chunk2 = 'BBBBBCCCCC';

    const flags = assignChunkFlags([chunk1, chunk2], text, []);

    expect(flags[0]!.isContinuation).toBe(false);
    expect(flags[0]!.hasContinuation).toBe(true);
    expect(flags[1]!.isContinuation).toBe(true);
    expect(flags[1]!.hasContinuation).toBe(false);
  });

  it('returns empty array for empty chunks', () => {
    expect(assignChunkFlags([], 'some text', [])).toEqual([]);
  });

  it('handles chunks not found in original text', () => {
    const flags = assignChunkFlags(['not in original'], 'some other text', []);
    expect(flags).toHaveLength(1);
    expect(flags[0]!.containsTable).toBe(false);
    expect(flags[0]!.containsProcedure).toBe(false);
  });
});
