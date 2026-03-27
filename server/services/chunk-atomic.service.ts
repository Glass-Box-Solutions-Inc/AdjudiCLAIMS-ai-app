/**
 * Atomic block preservation service for document chunking.
 *
 * Detects structures (tables, numbered steps, legal citations) that should
 * never be split across chunk boundaries. The embedding service can use
 * these markers to keep atomic content together or, when a table is too
 * large, split it into header+row pairs.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AtomicBlock {
  /** Type of atomic block */
  type: 'table' | 'numbered_list' | 'legal_citation';
  /** Start character offset in the original text */
  startOffset: number;
  /** End character offset in the original text */
  endOffset: number;
  /** The block's text content */
  text: string;
  /** For tables: the header row to prepend to each row-chunk */
  tableHeader?: string;
}

export interface ChunkFlags {
  containsTable: boolean;
  containsProcedure: boolean;
  isContinuation: boolean;
  hasContinuation: boolean;
}

// ---------------------------------------------------------------------------
// Regex patterns
// ---------------------------------------------------------------------------

/**
 * Markdown pipe table: two or more consecutive lines that start and end
 * with a pipe character, including the separator row (e.g. `|---|---|`).
 */
const PIPE_TABLE_RE = /^(\|[^\n]+\|[ \t]*\n){2,}/gm;

/**
 * Tab-delimited table: three or more consecutive lines where each line
 * contains at least two tab characters (implying 3+ columns).
 */
const TAB_TABLE_RE = /^([^\n]*\t[^\n]*\t[^\n]*\n){3,}/gm;

/**
 * Numbered list item — matches `1.`, `2)`, `(a)`, or `Step 1` prefixes.
 */
const NUMBERED_ITEM_RE = /^\s*(?:\d+[.)]\s|Step\s+\d+|\([a-z]\)\s)/;

/**
 * Legal citation patterns common in California Workers' Compensation.
 */
const LEGAL_CITATION_RE =
  /(?:Labor\s+Code\s+§|LC\s+§|Cal\.\s*Code\s+Regs\.|8\s+CCR\s+§|WCAB\b)/;

// ---------------------------------------------------------------------------
// Detection
// ---------------------------------------------------------------------------

/**
 * Scan text and return all detected atomic blocks, sorted by startOffset.
 */
export function detectAtomicBlocks(text: string): AtomicBlock[] {
  if (!text) return [];

  const blocks: AtomicBlock[] = [];

  // --- Tables (pipe) ---
  detectPipeTables(text, blocks);

  // --- Tables (tab-delimited) ---
  detectTabTables(text, blocks);

  // --- Numbered lists / procedures ---
  detectNumberedLists(text, blocks);

  // --- Legal citations ---
  detectLegalCitations(text, blocks);

  // De-duplicate overlapping ranges, keep the longer block
  const merged = deduplicateBlocks(blocks);

  merged.sort((a, b) => a.startOffset - b.startOffset);
  return merged;
}

// ---------------------------------------------------------------------------
// Pipe tables
// ---------------------------------------------------------------------------

function detectPipeTables(text: string, out: AtomicBlock[]): void {
  PIPE_TABLE_RE.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = PIPE_TABLE_RE.exec(text)) !== null) {
    const blockText = match[0].trimEnd();
    const startOffset = match.index;
    const endOffset = startOffset + blockText.length;

    // Extract header: first line of the table
    const firstNewline = blockText.indexOf('\n');
    const headerRow = firstNewline > -1 ? blockText.slice(0, firstNewline).trim() : blockText.trim();

    out.push({
      type: 'table',
      startOffset,
      endOffset,
      text: blockText,
      tableHeader: headerRow,
    });
  }
}

// ---------------------------------------------------------------------------
// Tab-delimited tables
// ---------------------------------------------------------------------------

function detectTabTables(text: string, out: AtomicBlock[]): void {
  TAB_TABLE_RE.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TAB_TABLE_RE.exec(text)) !== null) {
    const blockText = match[0].trimEnd();
    const startOffset = match.index;
    const endOffset = startOffset + blockText.length;

    const firstNewline = blockText.indexOf('\n');
    const headerRow = firstNewline > -1 ? blockText.slice(0, firstNewline).trim() : blockText.trim();

    out.push({
      type: 'table',
      startOffset,
      endOffset,
      text: blockText,
      tableHeader: headerRow,
    });
  }
}

// ---------------------------------------------------------------------------
// Numbered lists / procedures
// ---------------------------------------------------------------------------

function detectNumberedLists(text: string, out: AtomicBlock[]): void {
  const lines = text.split('\n');
  let seqStart: number | null = null;
  let seqEnd = 0;
  let charOffset = 0;
  let seqStartOffset = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const isItem = NUMBERED_ITEM_RE.test(line);

    if (isItem) {
      if (seqStart === null) {
        seqStart = i;
        seqStartOffset = charOffset;
      }
      seqEnd = i;
    } else {
      // Allow one blank line within a sequence
      const isBlank = line.trim() === '';
      const prevWasItem = seqStart !== null && seqEnd === i - 1;
      if (!(isBlank && prevWasItem)) {
        flushSequence();
      }
    }

    charOffset += line.length + 1; // +1 for newline
  }
  flushSequence();

  function flushSequence(): void {
    if (seqStart === null) return;
    const count = seqEnd - seqStart + 1;
    if (count < 2) {
      seqStart = null;
      return;
    }

    // Compute the end offset: walk lines from seqStart to seqEnd
    let endOff = seqStartOffset;
    for (let j = seqStart; j <= seqEnd; j++) {
      endOff += lines[j]!.length + (j < seqEnd ? 1 : 0);
    }

    const blockText = lines.slice(seqStart, seqEnd + 1).join('\n');
    out.push({
      type: 'numbered_list',
      startOffset: seqStartOffset,
      endOffset: endOff,
      text: blockText,
    });

    seqStart = null;
  }
}

// ---------------------------------------------------------------------------
// Legal citations
// ---------------------------------------------------------------------------

function detectLegalCitations(text: string, out: AtomicBlock[]): void {
  // Split into sentences: period followed by whitespace or end of string
  const sentenceRe = /[^.]*?(?:Labor\s+Code\s+§|LC\s+§|Cal\.\s*Code\s+Regs\.|8\s+CCR\s+§|WCAB\b)[^.]*\./g;
  let match: RegExpExecArray | null;

  sentenceRe.lastIndex = 0;
  while ((match = sentenceRe.exec(text)) !== null) {
    const raw = match[0];
    // Trim leading whitespace but track the actual start offset
    const leadingWs = raw.length - raw.trimStart().length;
    const blockText = raw.trim();
    if (!blockText) continue;

    const startOffset = match.index + leadingWs;
    const endOffset = startOffset + blockText.length;

    out.push({
      type: 'legal_citation',
      startOffset,
      endOffset,
      text: blockText,
    });
  }
}

// ---------------------------------------------------------------------------
// De-duplication
// ---------------------------------------------------------------------------

/** Remove overlapping blocks, preferring the longer one. */
function deduplicateBlocks(blocks: AtomicBlock[]): AtomicBlock[] {
  if (blocks.length <= 1) return blocks;

  // Sort by start, then by length descending so longer comes first
  const sorted = [...blocks].sort(
    (a, b) => a.startOffset - b.startOffset || (b.endOffset - b.startOffset) - (a.endOffset - a.startOffset),
  );

  const result: AtomicBlock[] = [sorted[0]!];

  for (let i = 1; i < sorted.length; i++) {
    const prev = result[result.length - 1]!;
    const curr = sorted[i]!;

    // If current is fully contained within previous, skip it
    if (curr.startOffset >= prev.startOffset && curr.endOffset <= prev.endOffset) {
      continue;
    }

    // If they overlap, keep the longer one
    if (curr.startOffset < prev.endOffset) {
      const prevLen = prev.endOffset - prev.startOffset;
      const currLen = curr.endOffset - curr.startOffset;
      if (currLen > prevLen) {
        result[result.length - 1] = curr;
      }
      continue;
    }

    result.push(curr);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Table row splitting
// ---------------------------------------------------------------------------

/**
 * Split a large table atomic block into header+row pairs.
 *
 * @param table - A table AtomicBlock (must have `tableHeader`)
 * @param maxTokens - Max token budget per chunk (unused for now — splits
 *   every row individually). A rough heuristic: 1 token ≈ 4 characters.
 * @returns Array of strings, each being `header\nrow`.
 */
export function splitTableIntoRowChunks(table: AtomicBlock, maxTokens: number): string[] {
  if (table.type !== 'table' || !table.tableHeader) {
    return [table.text];
  }

  const lines = table.text.split('\n').filter((l) => l.trim() !== '');
  const header = table.tableHeader;

  // Skip header row and any separator row (e.g. |---|---|)
  const isSeparator = (line: string): boolean => /^\|[\s\-:|]+\|$/.test(line.trim());

  const rows: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === header.trim()) continue;
    if (isSeparator(line)) continue;
    rows.push(trimmed);
  }

  if (rows.length === 0) return [table.text];

  // If all rows fit in one chunk, return the whole table
  const charsPerToken = 4;
  const totalChars = table.text.length;
  if (totalChars / charsPerToken <= maxTokens) {
    return [table.text];
  }

  return rows.map((row) => `${header}\n${row}`);
}

// ---------------------------------------------------------------------------
// Chunk flag assignment
// ---------------------------------------------------------------------------

/**
 * Given an array of chunk strings and the original text they came from,
 * assign structural flags to each chunk.
 */
export function assignChunkFlags(
  chunks: string[],
  originalText: string,
  atomicBlocks: AtomicBlock[],
): ChunkFlags[] {
  if (chunks.length === 0) return [];

  // Build a character-offset map for each chunk by locating it in the
  // original text. We search sequentially to handle repeated content.
  const chunkRanges: Array<{ start: number; end: number }> = [];
  let searchFrom = 0;

  for (const chunk of chunks) {
    const idx = originalText.indexOf(chunk, searchFrom);
    if (idx >= 0) {
      chunkRanges.push({ start: idx, end: idx + chunk.length });
      // Advance search position but allow overlap
      searchFrom = idx + 1;
    } else {
      // Chunk might be synthesized (e.g., header+row) — fall back to -1
      chunkRanges.push({ start: -1, end: -1 });
    }
  }

  const flags: ChunkFlags[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const range = chunkRanges[i]!;

    let containsTable = false;
    let containsProcedure = false;

    if (range.start >= 0) {
      for (const block of atomicBlocks) {
        const overlaps = block.startOffset < range.end && block.endOffset > range.start;
        if (overlaps) {
          if (block.type === 'table') containsTable = true;
          if (block.type === 'numbered_list') containsProcedure = true;
        }
      }
    }

    // Continuation detection: if successive chunks share overlapping text
    // in the original document, or the chunk does not start at position 0
    // and the previous chunk's end > this chunk's start, it's a continuation.
    let isContinuation = false;
    let hasContinuation = false;

    if (i > 0 && range.start >= 0 && chunkRanges[i - 1]!.end > range.start) {
      isContinuation = true;
    }

    if (i < chunks.length - 1) {
      const nextRange = chunkRanges[i + 1]!;
      if (range.end > 0 && nextRange.start >= 0 && range.end > nextRange.start) {
        hasContinuation = true;
      }
    }

    flags.push({ containsTable, containsProcedure, isContinuation, hasContinuation });
  }

  return flags;
}
