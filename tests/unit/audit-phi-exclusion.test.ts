// @Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Audit Trail — PHI Exclusion Tests (AJC-6 §7.1)
 *
 * Verifies that:
 * 1. sanitizeEventData() strips known PHI field names from eventData
 * 2. sanitizeEventData() preserves safe fields (IDs, status, action)
 * 3. sanitizeEventData() handles nested objects
 * 4. sanitizeEventData() handles null/undefined gracefully
 * 5. logAuditEvent() passes sanitized data to prisma.auditEvent.create
 *
 * Regulatory basis: HIPAA §164.530(j), SOC 2 CC6.1 (data minimization).
 * PHI must never appear in audit log eventData — only document/claim IDs are safe.
 */

// ---------------------------------------------------------------------------
// Mocks — must come before dynamic imports
// ---------------------------------------------------------------------------

vi.mock('argon2', () => ({
  default: {
    verify: vi.fn().mockResolvedValue(true),
    hash: vi.fn().mockResolvedValue('$argon2id$mock'),
    argon2id: 2,
  },
  verify: vi.fn().mockResolvedValue(true),
  hash: vi.fn().mockResolvedValue('$argon2id$mock'),
  argon2id: 2,
}));

vi.mock('@otplib/preset-default', () => ({
  authenticator: {
    generateSecret: vi.fn().mockReturnValue('JBSWY3DPEHPK3PXP'),
    keyuri: vi.fn().mockReturnValue('otpauth://totp/test'),
    verify: vi.fn().mockReturnValue(true),
  },
}));

const mockAuditEventCreate = vi.fn();

vi.mock('../../server/db.js', () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([{ '?column?': 1 }]),
    auditEvent: {
      create: (...args: unknown[]) => mockAuditEventCreate(...args) as unknown,
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
      groupBy: vi.fn().mockResolvedValue([]),
    },
    user: {
      findUnique: vi.fn().mockResolvedValue(null),
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
      update: vi.fn().mockResolvedValue({}),
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({}),
    },
    claim: {
      findUnique: vi.fn().mockResolvedValue(null),
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
      create: vi.fn().mockResolvedValue({}),
    },
    educationProfile: {
      findUnique: vi.fn().mockResolvedValue(null),
      upsert: vi.fn().mockResolvedValue({
        id: 'ep-1',
        userId: 'user-1',
        dismissedTerms: [],
        trainingModulesCompleted: null,
        isTrainingComplete: true,
        learningModeExpiry: null,
      }),
      update: vi.fn().mockResolvedValue({}),
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
    },
    workflowProgress: {
      create: vi.fn().mockResolvedValue({}),
      findUnique: vi.fn().mockResolvedValue(null),
      update: vi.fn().mockResolvedValue({}),
    },
    regulatoryDeadline: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      count: vi.fn().mockResolvedValue(0),
      update: vi.fn().mockResolvedValue({}),
      createMany: vi.fn().mockResolvedValue({ count: 0 }),
      groupBy: vi.fn().mockResolvedValue([]),
    },
    investigationItem: {
      createMany: vi.fn().mockResolvedValue({ count: 0 }),
      groupBy: vi.fn().mockResolvedValue([]),
    },
    document: {
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
      groupBy: vi.fn().mockResolvedValue([]),
    },
    chatSession: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({}),
    },
    chatMessage: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
    },
    documentChunk: {
      findMany: vi.fn().mockResolvedValue([]),
      createMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
    benefitPayment: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
    },
    timelineEvent: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}));

// Dynamic imports after mocks
const { sanitizeEventData, logAuditEvent } = await import('../../server/middleware/audit.js');

// ---------------------------------------------------------------------------
// Tests: sanitizeEventData()
// ---------------------------------------------------------------------------

describe('sanitizeEventData — PHI field stripping', () => {
  it('strips ssn field from eventData', () => {
    const input = { claimId: 'claim-1', ssn: '123-45-6789', action: 'view' };
    const result = sanitizeEventData(input);
    expect(result).not.toHaveProperty('ssn');
    expect(result).toHaveProperty('claimId', 'claim-1');
    expect(result).toHaveProperty('action', 'view');
  });

  it('strips dateOfBirth field from eventData', () => {
    const input = { documentId: 'doc-1', dateOfBirth: '1980-01-15', status: 'COMPLETE' };
    const result = sanitizeEventData(input);
    expect(result).not.toHaveProperty('dateOfBirth');
    expect(result).toHaveProperty('documentId', 'doc-1');
    expect(result).toHaveProperty('status', 'COMPLETE');
  });

  it('strips claimantName field from eventData', () => {
    const input = { claimId: 'claim-1', claimantName: 'Jane Doe', claimNumber: 'WC-2026-001' };
    const result = sanitizeEventData(input);
    expect(result).not.toHaveProperty('claimantName');
    expect(result).toHaveProperty('claimId', 'claim-1');
    expect(result).toHaveProperty('claimNumber', 'WC-2026-001');
  });

  it('strips firstName and lastName fields', () => {
    const input = { userId: 'user-1', firstName: 'Jane', lastName: 'Doe', action: 'login' };
    const result = sanitizeEventData(input);
    expect(result).not.toHaveProperty('firstName');
    expect(result).not.toHaveProperty('lastName');
    expect(result).toHaveProperty('userId', 'user-1');
    expect(result).toHaveProperty('action', 'login');
  });

  it('strips email field from eventData', () => {
    const input = { userId: 'user-1', email: 'jane@example.com', action: 'password_change' };
    const result = sanitizeEventData(input);
    expect(result).not.toHaveProperty('email');
    expect(result).toHaveProperty('userId', 'user-1');
  });

  it('strips nested PHI fields in nested objects', () => {
    const input = {
      claimId: 'claim-1',
      claimant: {
        ssn: '123-45-6789',
        dateOfBirth: '1980-01-15',
        claimNumber: 'WC-2026-001',
      },
    };
    const result = sanitizeEventData(input);
    expect(result?.claimant).toBeDefined();
    const claimant = result?.claimant as Record<string, unknown>;
    expect(claimant).not.toHaveProperty('ssn');
    expect(claimant).not.toHaveProperty('dateOfBirth');
    expect(claimant).toHaveProperty('claimNumber', 'WC-2026-001');
  });

  it('preserves safe fields: claimId, documentId, action, status, claimNumber', () => {
    const input = {
      claimId: 'claim-abc',
      documentId: 'doc-xyz',
      action: 'DOCUMENT_VIEWED',
      status: 'COMPLETE',
      claimNumber: 'WC-2026-001',
      previousStatus: 'OPEN',
      newStatus: 'CLOSED',
    };
    const result = sanitizeEventData(input);
    expect(result).toEqual(input); // all fields are safe — should pass through unchanged
  });

  it('handles null input gracefully — returns undefined', () => {
    const result = sanitizeEventData(null);
    expect(result).toBeUndefined();
  });

  it('handles undefined input gracefully — returns undefined', () => {
    const result = sanitizeEventData(undefined);
    expect(result).toBeUndefined();
  });

  it('handles empty object — returns empty object', () => {
    const result = sanitizeEventData({});
    expect(result).toEqual({});
  });

  it('strips phi fields case-insensitively (SSN, Ssn, ssN)', () => {
    // All of these should be stripped as they normalize to 'ssn'
    const input = { claimId: 'claim-1', SSN: '123-45-6789', Ssn: 'xxx', ssN: 'yyy' };
    const result = sanitizeEventData(input);
    expect(result).not.toHaveProperty('SSN');
    expect(result).not.toHaveProperty('Ssn');
    expect(result).not.toHaveProperty('ssN');
    expect(result).toHaveProperty('claimId', 'claim-1');
  });

  it('strips phi fields with non-alphanumeric separators (date_of_birth, date-of-birth)', () => {
    // 'date_of_birth' normalizes to 'dateofbirth' which matches 'dateofbirth'
    const input = { claimId: 'claim-1', date_of_birth: '1980-01-15', 'date-of-birth': '1980-01-15' };
    const result = sanitizeEventData(input);
    expect(result).not.toHaveProperty('date_of_birth');
    expect(result).not.toHaveProperty('date-of-birth');
    expect(result).toHaveProperty('claimId', 'claim-1');
  });
});

// ---------------------------------------------------------------------------
// Tests: logAuditEvent() integration with sanitization
// ---------------------------------------------------------------------------

describe('logAuditEvent — PHI exclusion integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuditEventCreate.mockResolvedValue({ id: 'ae-new' });
  });

  /**
   * Build a minimal Fastify request mock sufficient for logAuditEvent().
   */
  function buildMockRequest(): Parameters<typeof logAuditEvent>[0]['request'] {
    return {
      headers: {
        'user-agent': 'test-agent',
        'x-forwarded-for': '127.0.0.1',
      },
      ip: '127.0.0.1',
      log: {
        error: vi.fn(),
      },
    } as unknown as Parameters<typeof logAuditEvent>[0]['request'];
  }

  it('logAuditEvent with PHI in eventData does not persist PHI field names', async () => {
    const request = buildMockRequest();

    await logAuditEvent({
      userId: 'user-1',
      claimId: 'claim-1',
      eventType: 'CLAIM_VIEWED',
      eventData: {
        claimId: 'claim-1',
        claimantName: 'Jane Doe',      // PHI — must be stripped
        ssn: '123-45-6789',           // PHI — must be stripped
        dateOfBirth: '1980-01-15',    // PHI — must be stripped
        action: 'viewed',             // safe — must be preserved
      },
      request,
    });

    expect(mockAuditEventCreate).toHaveBeenCalledOnce();
    const createCall = mockAuditEventCreate.mock.calls[0] as Array<{ data: Record<string, unknown> }>;
    const storedData = createCall[0]?.data?.eventData as Record<string, unknown> | undefined;

    // PHI fields must be absent from stored data
    expect(storedData).not.toHaveProperty('claimantName');
    expect(storedData).not.toHaveProperty('ssn');
    expect(storedData).not.toHaveProperty('dateOfBirth');

    // Safe fields must be preserved
    expect(storedData).toHaveProperty('claimId', 'claim-1');
    expect(storedData).toHaveProperty('action', 'viewed');
  });

  it('logAuditEvent with safe eventData passes all fields through unchanged', async () => {
    const request = buildMockRequest();
    const safeData = {
      claimId: 'claim-1',
      documentId: 'doc-1',
      previousStatus: 'OPEN',
      newStatus: 'UNDER_INVESTIGATION',
      claimNumber: 'WC-2026-001',
    };

    await logAuditEvent({
      userId: 'user-1',
      claimId: 'claim-1',
      eventType: 'CLAIM_STATUS_CHANGED',
      eventData: safeData,
      request,
    });

    expect(mockAuditEventCreate).toHaveBeenCalledOnce();
    const createCall = mockAuditEventCreate.mock.calls[0] as Array<{ data: Record<string, unknown> }>;
    const storedData = createCall[0]?.data?.eventData as Record<string, unknown>;

    expect(storedData).toHaveProperty('claimId', 'claim-1');
    expect(storedData).toHaveProperty('documentId', 'doc-1');
    expect(storedData).toHaveProperty('previousStatus', 'OPEN');
    expect(storedData).toHaveProperty('newStatus', 'UNDER_INVESTIGATION');
    expect(storedData).toHaveProperty('claimNumber', 'WC-2026-001');
  });

  it('logAuditEvent sets retentionExpiresAt approximately 7 years in the future', async () => {
    const request = buildMockRequest();
    const beforeCall = new Date();

    await logAuditEvent({
      userId: 'user-1',
      eventType: 'USER_LOGIN',
      request,
    });

    const afterCall = new Date();

    expect(mockAuditEventCreate).toHaveBeenCalledOnce();
    const createCall = mockAuditEventCreate.mock.calls[0] as Array<{ data: { retentionExpiresAt: Date } }>;
    const retentionDate = createCall[0]?.data?.retentionExpiresAt;

    expect(retentionDate).toBeInstanceOf(Date);

    // Retention expiry should be approximately 7 years from now
    const sevenYearsFromBefore = new Date(beforeCall);
    sevenYearsFromBefore.setFullYear(sevenYearsFromBefore.getFullYear() + 7);
    const sevenYearsFromAfter = new Date(afterCall);
    sevenYearsFromAfter.setFullYear(sevenYearsFromAfter.getFullYear() + 7);

    // Allow a 1-second window for test execution time
    expect(retentionDate!.getTime()).toBeGreaterThanOrEqual(
      sevenYearsFromBefore.getTime() - 1000,
    );
    expect(retentionDate!.getTime()).toBeLessThanOrEqual(
      sevenYearsFromAfter.getTime() + 1000,
    );
  });
});
