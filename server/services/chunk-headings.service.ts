/**
 * 3-level heading structure service for document chunking.
 *
 * Generates hierarchical headings for each chunk to improve retrieval
 * quality and source attribution. Each chunk receives:
 *   L1 — Document identity (type, author, date)
 *   L2 — Section identity (major document section)
 *   L3 — Chunk topic (brief descriptor)
 *
 * The combined heading is prepended to chunk embeddings so the vector
 * search has richer context about where each chunk originates.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChunkHeadings {
  /** L1: Document identity — type, author, date */
  l1: string;
  /** L2: Section identity — major document section */
  l2: string;
  /** L3: Chunk topic — brief AI-generated descriptor */
  l3: string;
  /** All three combined for embedding prepend */
  combined: string;
}

export interface DocumentContext {
  documentType: string | null;
  documentSubtype: string | null;
  fileName: string;
  /** Extracted fields from the document (author, date, etc.) */
  extractedFields: Array<{ fieldName: string; fieldValue: string }>;
}

// ---------------------------------------------------------------------------
// L2 Section patterns per document type
// ---------------------------------------------------------------------------

const SECTION_PATTERNS: Record<string, Array<{ pattern: RegExp; label: string }>> = {
  AME_QME_REPORT: [
    { pattern: /history\s+of\s+(present\s+)?injury/i, label: 'History of Present Injury' },
    { pattern: /review\s+of\s+(medical\s+)?records/i, label: 'Review of Medical Records' },
    { pattern: /physical\s+exam/i, label: 'Physical Examination Findings' },
    { pattern: /diagnos[ie]s?\s+(and\s+)?causation/i, label: 'Diagnosis and Causation Analysis' },
    { pattern: /permanent\s+and\s+stationary/i, label: 'Permanent and Stationary Determination' },
    { pattern: /work\s+restrict/i, label: 'Work Restrictions and Future Medical' },
    { pattern: /apportion/i, label: 'Apportionment Analysis' },
    { pattern: /future\s+medical/i, label: 'Future Medical Treatment' },
    { pattern: /whole\s+person\s+impairment|WPI/i, label: 'Whole Person Impairment Rating' },
  ],
  MEDICAL_REPORT: [
    { pattern: /chief\s+complaint/i, label: 'Chief Complaint' },
    { pattern: /history\s+of\s+present\s+illness|HPI/i, label: 'History of Present Illness' },
    { pattern: /physical\s+exam/i, label: 'Physical Examination' },
    { pattern: /assessment|diagnos/i, label: 'Assessment and Diagnosis' },
    { pattern: /treatment\s+plan/i, label: 'Treatment Plan' },
    { pattern: /work\s+(status|restrict)/i, label: 'Work Status' },
  ],
  UTILIZATION_REVIEW: [
    { pattern: /request(ed)?\s+(treatment|procedure)/i, label: 'Requested Treatment' },
    { pattern: /clinical\s+(review|criteria)/i, label: 'Clinical Review Criteria' },
    { pattern: /determination|decision/i, label: 'Determination' },
    { pattern: /guideline/i, label: 'Guideline Reference' },
  ],
  SETTLEMENT_DOCUMENT: [
    { pattern: /parties|claim\s+information/i, label: 'Parties and Claim Information' },
    { pattern: /terms\s+of\s+settlement/i, label: 'Terms of Settlement' },
    { pattern: /addendum/i, label: 'Addendum' },
    { pattern: /release/i, label: 'Release Language' },
  ],
  WCAB_FILING: [
    { pattern: /caption|case\s+number/i, label: 'Case Caption' },
    { pattern: /facts|allegations/i, label: 'Facts and Allegations' },
    { pattern: /prayer|relief/i, label: 'Prayer for Relief' },
    { pattern: /verification|declaration/i, label: 'Verification' },
  ],
  WAGE_STATEMENT: [
    { pattern: /earning|wage|salary/i, label: 'Earnings Data' },
    { pattern: /period|pay\s+date/i, label: 'Pay Period Information' },
    { pattern: /deduction/i, label: 'Deductions' },
  ],
  BILLING_STATEMENT: [
    { pattern: /charges|items/i, label: 'Itemized Charges' },
    { pattern: /provider|facility/i, label: 'Provider Information' },
    { pattern: /payment|balance/i, label: 'Payment Summary' },
  ],
};

const GENERIC_SECTIONS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /summary|overview/i, label: 'Summary' },
  { pattern: /background|history/i, label: 'Background' },
  { pattern: /conclusion|recommendation/i, label: 'Conclusion' },
  { pattern: /signature|sign/i, label: 'Signature Block' },
];

// ---------------------------------------------------------------------------
// Author field names (priority order — first match wins)
// ---------------------------------------------------------------------------

const AUTHOR_FIELD_NAMES = [
  'treatingPhysician',
  'physicianName',
  'employerName',
  'providerName',
  'personName',
];

// ---------------------------------------------------------------------------
// Date field names (priority order — first match wins)
// ---------------------------------------------------------------------------

const DATE_FIELD_NAMES = [
  'date',
  'dateOfService',
  'reportDate',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Find the first matching extracted field value by field name priority list.
 */
function findField(
  extractedFields: Array<{ fieldName: string; fieldValue: string }>,
  fieldNames: string[],
): string | null {
  for (const name of fieldNames) {
    const field = extractedFields.find(
      (f) => f.fieldName.toLowerCase() === name.toLowerCase(),
    );
    if (field && field.fieldValue.trim()) {
      return field.fieldValue.trim();
    }
  }
  return null;
}

/**
 * Strip file extension and replace common separators with spaces.
 */
function humanizeFileName(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// L1 — Document identity (deterministic, no LLM)
// ---------------------------------------------------------------------------

/**
 * Builds the L1 heading from document classification metadata.
 *
 * Format: `[DocumentType] | [Author/Source] | [Date]`
 *
 * Falls back to the file name when author/date are unavailable.
 */
export function generateL1(context: DocumentContext): string {
  const docType = context.documentSubtype || context.documentType || 'UNKNOWN';

  const author = findField(context.extractedFields, AUTHOR_FIELD_NAMES);
  const date = findField(context.extractedFields, DATE_FIELD_NAMES);

  const parts: string[] = [docType];

  if (author) {
    parts.push(author);
  }

  if (date) {
    parts.push(date);
  }

  // If neither author nor date were found, use the file name as fallback
  if (!author && !date) {
    parts.push(humanizeFileName(context.fileName));
  }

  return parts.join(' | ');
}

// ---------------------------------------------------------------------------
// L2 — Section identity (regex-based, no LLM)
// ---------------------------------------------------------------------------

/**
 * Detects which major section a chunk belongs to based on regex pattern
 * matching against the chunk text.
 *
 * Returns the first matching section label, or 'General Content' if none
 * match.
 */
export function generateL2(text: string, documentType: string | null): string {
  const patterns = (documentType && SECTION_PATTERNS[documentType]) || [];

  // Try document-type-specific patterns first
  for (const { pattern, label } of patterns) {
    if (pattern.test(text)) {
      return label;
    }
  }

  // Fall back to generic section patterns
  for (const { pattern, label } of GENERIC_SECTIONS) {
    if (pattern.test(text)) {
      return label;
    }
  }

  return 'General Content';
}

// ---------------------------------------------------------------------------
// L3 — Chunk topic (deterministic Tier 1 — no LLM)
// ---------------------------------------------------------------------------

/** Common prefixes to strip from first-sentence descriptors. */
const STRIP_PREFIXES = /^(the|this|a|an)\s+/i;

/**
 * Extract a brief topic descriptor from the first sentence of each chunk.
 *
 * This is the Tier 1 (deterministic) approach. An optional Tier 2
 * (LLM-based) approach can be added later via feature flag.
 */
export function generateL3Batch(chunks: string[]): string[] {
  return chunks.map((chunk) => {
    if (!chunk || !chunk.trim()) {
      return 'Empty Content';
    }

    // Extract first sentence — split on period, question mark, newline
    const firstSentence = chunk.trim().split(/[.\n?!]/)[0] || '';
    const cleaned = firstSentence.trim();

    if (!cleaned) {
      return 'Empty Content';
    }

    // Strip common prefixes
    const stripped = cleaned.replace(STRIP_PREFIXES, '');

    // Capitalize first letter
    const capitalized = stripped.charAt(0).toUpperCase() + stripped.slice(1);

    // Truncate to 60 characters
    if (capitalized.length <= 60) {
      return capitalized;
    }

    return capitalized.slice(0, 57) + '...';
  });
}

// ---------------------------------------------------------------------------
// Main orchestrator
// ---------------------------------------------------------------------------

/**
 * Generate 3-level headings for every chunk in a document.
 *
 * @param chunks - Array of chunk text strings from the document
 * @param context - Document-level metadata (type, author, date, etc.)
 * @returns Array of ChunkHeadings, one per input chunk
 */
export function generateHeadings(
  chunks: string[],
  context: DocumentContext,
): ChunkHeadings[] {
  // L1 is the same for every chunk in the document
  const l1 = generateL1(context);

  // L2 per chunk
  const l2s = chunks.map((chunk) => generateL2(chunk, context.documentType));

  // L3 batch
  const l3s = generateL3Batch(chunks);

  return chunks.map((_, i) => ({
    l1,
    l2: l2s[i]!,
    l3: l3s[i]!,
    combined: `[L1] ${l1}\n[L2] ${l2s[i]!}\n[L3] ${l3s[i]!}`,
  }));
}
