import { describe, it, expect } from 'vitest';

import {
  generateL1,
  generateL2,
  generateL3Batch,
  generateHeadings,
  type DocumentContext,
} from '../../server/services/chunk-headings.service.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeContext(overrides: Partial<DocumentContext> = {}): DocumentContext {
  return {
    documentType: 'AME_QME_REPORT',
    documentSubtype: null,
    fileName: 'report-2025-08-14.pdf',
    extractedFields: [],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// generateL1 — Document identity
// ---------------------------------------------------------------------------

describe('generateL1', () => {
  it('produces correct format with author and date from extracted fields', () => {
    const ctx = makeContext({
      extractedFields: [
        { fieldName: 'treatingPhysician', fieldValue: 'Dr. Sarah Chen, Orthopedic Surgery' },
        { fieldName: 'reportDate', fieldValue: '2025-08-14' },
      ],
    });

    const result = generateL1(ctx);
    expect(result).toBe('AME_QME_REPORT | Dr. Sarah Chen, Orthopedic Surgery | 2025-08-14');
  });

  it('prefers documentSubtype over documentType when present', () => {
    const ctx = makeContext({
      documentType: 'MEDICAL_REPORT',
      documentSubtype: 'PR-2_PROGRESS_NOTE',
      extractedFields: [
        { fieldName: 'physicianName', fieldValue: 'Dr. Kim' },
      ],
    });

    const result = generateL1(ctx);
    expect(result).toBe('PR-2_PROGRESS_NOTE | Dr. Kim');
  });

  it('falls back to filename when no extracted fields are present', () => {
    const ctx = makeContext({
      extractedFields: [],
      fileName: 'wage_statement_pacific_coast.pdf',
    });

    const result = generateL1(ctx);
    expect(result).toBe('AME_QME_REPORT | wage statement pacific coast');
  });

  it('uses UNKNOWN when documentType and documentSubtype are both null', () => {
    const ctx = makeContext({
      documentType: null,
      documentSubtype: null,
      extractedFields: [
        { fieldName: 'date', fieldValue: '2024-01-01' },
      ],
    });

    const result = generateL1(ctx);
    expect(result).toBe('UNKNOWN | 2024-01-01');
  });

  it('respects author field priority order', () => {
    const ctx = makeContext({
      extractedFields: [
        { fieldName: 'providerName', fieldValue: 'Low Priority Clinic' },
        { fieldName: 'treatingPhysician', fieldValue: 'Dr. First Priority' },
      ],
    });

    const result = generateL1(ctx);
    expect(result).toBe('AME_QME_REPORT | Dr. First Priority');
  });

  it('respects date field priority order', () => {
    const ctx = makeContext({
      extractedFields: [
        { fieldName: 'reportDate', fieldValue: '2025-12-31' },
        { fieldName: 'date', fieldValue: '2025-01-01' },
      ],
    });

    const result = generateL1(ctx);
    // 'date' has higher priority than 'reportDate'
    expect(result).toBe('AME_QME_REPORT | 2025-01-01');
  });

  it('skips empty field values', () => {
    const ctx = makeContext({
      extractedFields: [
        { fieldName: 'treatingPhysician', fieldValue: '   ' },
        { fieldName: 'physicianName', fieldValue: 'Dr. Fallback' },
      ],
    });

    const result = generateL1(ctx);
    expect(result).toBe('AME_QME_REPORT | Dr. Fallback');
  });
});

// ---------------------------------------------------------------------------
// generateL2 — Section identity
// ---------------------------------------------------------------------------

describe('generateL2', () => {
  describe('AME_QME_REPORT sections', () => {
    it('detects History of Present Injury', () => {
      const text = 'The patient reported a history of present injury dating back to March 2024.';
      expect(generateL2(text, 'AME_QME_REPORT')).toBe('History of Present Injury');
    });

    it('detects History of Injury (without "present")', () => {
      const text = 'HISTORY OF INJURY: The applicant was lifting boxes when pain began.';
      expect(generateL2(text, 'AME_QME_REPORT')).toBe('History of Present Injury');
    });

    it('detects Physical Examination Findings', () => {
      const text = 'Physical exam revealed limited range of motion in the lumbar spine.';
      expect(generateL2(text, 'AME_QME_REPORT')).toBe('Physical Examination Findings');
    });

    it('detects Apportionment Analysis', () => {
      const text = 'Apportionment of disability is addressed as follows.';
      expect(generateL2(text, 'AME_QME_REPORT')).toBe('Apportionment Analysis');
    });

    it('detects Whole Person Impairment Rating via WPI keyword', () => {
      const text = 'The WPI rating for the cervical spine is 8%.';
      expect(generateL2(text, 'AME_QME_REPORT')).toBe('Whole Person Impairment Rating');
    });

    it('detects Diagnosis and Causation Analysis', () => {
      const text = 'Diagnoses and causation: Lumbar disc herniation at L4-L5.';
      expect(generateL2(text, 'AME_QME_REPORT')).toBe('Diagnosis and Causation Analysis');
    });
  });

  describe('MEDICAL_REPORT sections', () => {
    it('detects Chief Complaint', () => {
      const text = 'Chief Complaint: Low back pain radiating to left leg.';
      expect(generateL2(text, 'MEDICAL_REPORT')).toBe('Chief Complaint');
    });

    it('detects History of Present Illness via HPI', () => {
      const text = 'HPI: Patient reports worsening symptoms over the past 2 weeks.';
      expect(generateL2(text, 'MEDICAL_REPORT')).toBe('History of Present Illness');
    });

    it('detects Treatment Plan', () => {
      const text = 'Treatment plan includes physical therapy 3x weekly.';
      expect(generateL2(text, 'MEDICAL_REPORT')).toBe('Treatment Plan');
    });

    it('detects Work Status', () => {
      const text = 'Work restrictions include no lifting over 10 pounds.';
      expect(generateL2(text, 'MEDICAL_REPORT')).toBe('Work Status');
    });
  });

  describe('generic fallback and unmatched text', () => {
    it('returns General Content for unmatched text', () => {
      const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
      expect(generateL2(text, 'AME_QME_REPORT')).toBe('General Content');
    });

    it('falls back to generic sections for unknown document types', () => {
      const text = 'In summary, the findings indicate partial disability.';
      expect(generateL2(text, 'CORRESPONDENCE')).toBe('Summary');
    });

    it('falls back to generic sections when documentType is null', () => {
      const text = 'Background information about the claim.';
      expect(generateL2(text, null)).toBe('Background');
    });

    it('detects generic Conclusion section', () => {
      const text = 'In conclusion, the examiner recommends further evaluation.';
      expect(generateL2(text, null)).toBe('Conclusion');
    });
  });
});

// ---------------------------------------------------------------------------
// generateL3Batch — Chunk topics
// ---------------------------------------------------------------------------

describe('generateL3Batch', () => {
  it('produces descriptors from first sentences', () => {
    const chunks = [
      'The patient was evaluated on August 14, 2025. Further testing is needed.',
      'MRI findings show a disc bulge at L4-L5. No cord compression.',
    ];

    const results = generateL3Batch(chunks);
    expect(results).toHaveLength(2);
    expect(results[0]).toBe('Patient was evaluated on August 14, 2025');
    expect(results[1]).toBe('MRI findings show a disc bulge at L4-L5');
  });

  it('strips common prefix "This"', () => {
    const results = generateL3Batch(['This report details the examination findings.']);
    expect(results[0]).toBe('Report details the examination findings');
  });

  it('strips common prefix "A"', () => {
    const results = generateL3Batch(['A comprehensive review was conducted.']);
    expect(results[0]).toBe('Comprehensive review was conducted');
  });

  it('truncates to 60 characters with ellipsis', () => {
    const longChunk =
      'Extremely detailed narrative about the workers compensation claim circumstances and events leading to the injury.';
    const results = generateL3Batch([longChunk]);
    expect(results[0]!.length).toBeLessThanOrEqual(60);
    expect(results[0]!).toMatch(/\.\.\.$/);
  });

  it('handles empty chunks gracefully', () => {
    const results = generateL3Batch(['', '   ', 'Valid content here.']);
    expect(results[0]).toBe('Empty Content');
    expect(results[1]).toBe('Empty Content');
    expect(results[2]).toBe('Valid content here');
  });

  it('capitalizes the first letter after stripping prefix', () => {
    const results = generateL3Batch(['the lumbar spine showed degenerative changes.']);
    expect(results[0]).toBe('Lumbar spine showed degenerative changes');
  });
});

// ---------------------------------------------------------------------------
// generateHeadings — Full orchestrator
// ---------------------------------------------------------------------------

describe('generateHeadings', () => {
  it('combines all three levels correctly', () => {
    const ctx = makeContext({
      extractedFields: [
        { fieldName: 'treatingPhysician', fieldValue: 'Dr. Sarah Chen' },
        { fieldName: 'reportDate', fieldValue: '2025-08-14' },
      ],
    });

    const chunks = [
      'History of present injury: The patient fell at work on March 5.',
      'Physical exam revealed tenderness in the lumbar region.',
    ];

    const results = generateHeadings(chunks, ctx);

    expect(results).toHaveLength(2);

    // First chunk
    expect(results[0]!.l1).toBe('AME_QME_REPORT | Dr. Sarah Chen | 2025-08-14');
    expect(results[0]!.l2).toBe('History of Present Injury');
    expect(results[0]!.l3).toBe('History of present injury: The patient fell at work on Ma...');
    expect(results[0]!.combined).toContain('[L1]');
    expect(results[0]!.combined).toContain('[L2]');
    expect(results[0]!.combined).toContain('[L3]');

    // Second chunk
    expect(results[1]!.l2).toBe('Physical Examination Findings');

    // L1 is the same for all chunks
    expect(results[0]!.l1).toBe(results[1]!.l1);
  });

  it('handles empty chunk array', () => {
    const ctx = makeContext();
    const results = generateHeadings([], ctx);
    expect(results).toEqual([]);
  });

  it('produces correct combined format', () => {
    const ctx = makeContext({
      extractedFields: [
        { fieldName: 'physicianName', fieldValue: 'Dr. Kim' },
        { fieldName: 'date', fieldValue: '2025-01-15' },
      ],
    });

    const chunks = ['Summary of the case findings and conclusions.'];
    const results = generateHeadings(chunks, ctx);

    const expected = [
      '[L1] AME_QME_REPORT | Dr. Kim | 2025-01-15',
      '[L2] Summary',
      '[L3] Summary of the case findings and conclusions',
    ].join('\n');

    expect(results[0]!.combined).toBe(expected);
  });
});
