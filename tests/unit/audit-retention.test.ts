// @Developed & Documented by Glass Box Solutions, Inc. using human ingenuity and modern technology
import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Audit Trail — 7-Year Retention Tests (AJC-6 §7.1)
 *
 * Verifies that:
 * 1. identifyExpiredAuditEvents() returns IDs where retentionExpiresAt < now
 * 2. identifyExpiredAuditEvents() excludes IDs where retentionExpiresAt > now
 * 3. identifyExpiredAuditEvents() returns empty array when no expired records
 * 4. purgeExpiredAuditEvents() with empty array returns 0 and performs no query
 * 5. purgeExpiredAuditEvents() uses $executeRawUnsafe with expiry re-check
 * 6. retentionExpiresAt index is defined in the schema
 *
 * Regulatory basis: HIPAA §164.530(j), Cal. Lab. Code § 4903.05.
 */

// ---------------------------------------------------------------------------
// Mocks
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

const mockAuditEventFindMany = vi.fn();
const mockExecuteRawUnsafe = vi.fn();

vi.mock('../../server/db.js', () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([{ '?column?': 1 }]),
    $executeRawUnsafe: (...args: unknown[]) => mockExecuteRawUnsafe(...args) as unknown,
    auditEvent: {
      findMany: (...args: unknown[]) => mockAuditEventFindMany(...args) as unknown,
      create: vi.fn().mockResolvedValue({ id: 'ae-new' }),
      count: vi.fn().mockResolvedValue(0),
      groupBy: vi.fn().mockResolvedValue([]),
    },
    claim: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      count: vi.fn().mockResolvedValue(0),
      create: vi.fn().mockResolvedValue({}),
    },
    document: {
      findMany: vi.fn().mockResolvedValue([]),
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
    documentChunk: {
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
    chatSession: {
      findMany: vi.fn().mockResolvedValue([]),
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
    investigationItem: {
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
      createMany: vi.fn().mockResolvedValue({ count: 0 }),
      groupBy: vi.fn().mockResolvedValue([]),
    },
    workflowProgress: {
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
  },
}));

// Dynamic imports after mocks
const { identifyExpiredAuditEvents, purgeExpiredAuditEvents } = await import(
  '../../server/services/data-retention.service.js'
);

// ---------------------------------------------------------------------------
// Tests: identifyExpiredAuditEvents()
// ---------------------------------------------------------------------------

describe('identifyExpiredAuditEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns IDs for audit events where retentionExpiresAt is in the past', async () => {
    const pastDate = new Date('2020-01-01T00:00:00Z'); // 6 years ago — expired

    mockAuditEventFindMany.mockResolvedValueOnce([
      { id: 'ae-expired-1' },
      { id: 'ae-expired-2' },
    ]);

    const result = await identifyExpiredAuditEvents();

    expect(result).toHaveLength(2);
    expect(result).toContain('ae-expired-1');
    expect(result).toContain('ae-expired-2');

    // Verify the query filtered by retentionExpiresAt < now
    const [findManyCall] = mockAuditEventFindMany.mock.calls as Array<[{ where: Record<string, unknown> }]>;
    const where = findManyCall[0]?.where;
    expect(where).toHaveProperty('retentionExpiresAt');
    const filter = where?.retentionExpiresAt as Record<string, unknown>;
    expect(filter).toHaveProperty('lt');
    expect(filter.lt).toBeInstanceOf(Date);
    void pastDate; // used to document intent; actual reference date is now()
  });

  it('returns empty array when no expired audit events exist', async () => {
    mockAuditEventFindMany.mockResolvedValueOnce([]);

    const result = await identifyExpiredAuditEvents();

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it('uses provided asOfDate as the reference point for expiry check', async () => {
    const customDate = new Date('2030-01-01T00:00:00Z');
    mockAuditEventFindMany.mockResolvedValueOnce([{ id: 'ae-future-expired' }]);

    const result = await identifyExpiredAuditEvents(customDate);

    expect(result).toContain('ae-future-expired');

    // Verify the query used our custom date
    const [findManyCall] = mockAuditEventFindMany.mock.calls as Array<[{ where: Record<string, unknown> }]>;
    const where = findManyCall[0]?.where;
    const filter = where?.retentionExpiresAt as Record<string, unknown>;
    expect(filter.lt).toEqual(customDate);
  });

  it('orders results by retentionExpiresAt ascending (oldest first)', async () => {
    mockAuditEventFindMany.mockResolvedValueOnce([]);

    await identifyExpiredAuditEvents();

    const [findManyCall] = mockAuditEventFindMany.mock.calls as Array<[{ orderBy: Record<string, unknown> }]>;
    const orderBy = findManyCall[0]?.orderBy;
    expect(orderBy).toHaveProperty('retentionExpiresAt', 'asc');
  });
});

// ---------------------------------------------------------------------------
// Tests: purgeExpiredAuditEvents()
// ---------------------------------------------------------------------------

describe('purgeExpiredAuditEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 0 and does not call $executeRawUnsafe when given empty array', async () => {
    const result = await purgeExpiredAuditEvents([]);
    expect(result).toBe(0);
    expect(mockExecuteRawUnsafe).not.toHaveBeenCalled();
  });

  it('calls $executeRawUnsafe with the provided IDs and a NOW() re-validation check', async () => {
    mockExecuteRawUnsafe.mockResolvedValueOnce(3);

    const ids = ['ae-1', 'ae-2', 'ae-3'];
    const result = await purgeExpiredAuditEvents(ids);

    expect(result).toBe(3);
    expect(mockExecuteRawUnsafe).toHaveBeenCalledOnce();

    const [sqlQuery, ...sqlParams] = mockExecuteRawUnsafe.mock.calls[0] as [string, ...string[]];

    // The SQL must include a DELETE FROM audit_events
    expect(sqlQuery).toContain('DELETE FROM audit_events');
    // The SQL must include a WHERE id IN clause (parameterized)
    expect(sqlQuery).toContain('WHERE id IN');
    // The SQL must include a re-validation of retention_expires_at < NOW()
    expect(sqlQuery).toContain('retention_expires_at < NOW()');
    // The IDs must be passed as parameters (not interpolated)
    expect(sqlParams).toContain('ae-1');
    expect(sqlParams).toContain('ae-2');
    expect(sqlParams).toContain('ae-3');
  });

  it('returns 0 when $executeRawUnsafe returns 0 (all IDs had future expiry)', async () => {
    // The DB-level WHERE retention_expires_at < NOW() blocks premature deletes
    mockExecuteRawUnsafe.mockResolvedValueOnce(0);

    const result = await purgeExpiredAuditEvents(['ae-not-expired']);
    expect(result).toBe(0);
  });

  it('generates correct number of SQL placeholders for the ID list', async () => {
    mockExecuteRawUnsafe.mockResolvedValueOnce(5);

    const ids = ['ae-1', 'ae-2', 'ae-3', 'ae-4', 'ae-5'];
    await purgeExpiredAuditEvents(ids);

    const [sqlQuery] = mockExecuteRawUnsafe.mock.calls[0] as [string];
    // Should have $1, $2, $3, $4, $5 placeholders
    expect(sqlQuery).toContain('$1');
    expect(sqlQuery).toContain('$5');
  });
});

// ---------------------------------------------------------------------------
// Tests: Schema validation
// ---------------------------------------------------------------------------

describe('AuditEvent schema — retentionExpiresAt field', () => {
  it('Prisma schema defines retentionExpiresAt field on AuditEvent model', async () => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');

    const schemaPath = join(process.cwd(), 'prisma', 'schema.prisma');
    const content = readFileSync(schemaPath, 'utf-8');

    // Extract just the AuditEvent model block
    const modelMatch = content.match(/model AuditEvent \{[\s\S]*?\n\}/);
    expect(modelMatch).not.toBeNull();
    const modelBlock = modelMatch![0];

    // Verify retentionExpiresAt field exists
    expect(modelBlock).toContain('retentionExpiresAt');
    expect(modelBlock).toContain('retention_expires_at');

    // Verify the retention index is defined
    expect(modelBlock).toContain('idx_audit_events_retention_expires_at');
  });

  it('retention migration file defines the retention_expires_at column', async () => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');

    const migrationPath = join(
      process.cwd(),
      'prisma',
      'migrations',
      '20260420_audit_retention_expires_at',
      'migration.sql',
    );

    const content = readFileSync(migrationPath, 'utf-8');

    expect(content).toContain('retention_expires_at');
    expect(content).toContain('INTERVAL \'7 years\'');
    expect(content).toContain('idx_audit_events_retention_expires_at');
  });
});
