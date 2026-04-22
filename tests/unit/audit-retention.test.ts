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
 * 5. purgeExpiredAuditEvents() uses $transaction with SET LOCAL session flag + DELETE
 * 6. purgeExpiredAuditEvents() batches large ID lists (PURGE_BATCH_SIZE = 1000)
 * 7. retentionExpiresAt index is defined in the schema
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

/**
 * The transaction client mock captures $executeRawUnsafe calls made inside
 * the $transaction callback. purgeExpiredAuditEvents() uses $transaction to
 * SET LOCAL the authorized_retention_purge flag and then DELETE.
 *
 * txRawUnsafeCalls stores all calls made to tx.$executeRawUnsafe across tests.
 */
const txRawUnsafeCalls: Array<[string, ...unknown[]]> = [];
const mockTxExecuteRawUnsafe = vi.fn((...args: unknown[]) => {
  txRawUnsafeCalls.push(args as [string, ...unknown[]]);
  // Return 0 by default; individual tests override via mockResolvedValueOnce
  return Promise.resolve(0);
});

const mockTransaction = vi.fn(async (callback: (tx: Record<string, unknown>) => Promise<unknown>) => {
  // Provide a minimal transaction client that captures $executeRawUnsafe calls.
  // The second $executeRawUnsafe call in the callback (the DELETE) is expected to
  // return the deleted row count — we set that via mockTxExecuteRawUnsafe.
  const txClient = {
    $executeRawUnsafe: mockTxExecuteRawUnsafe,
  };
  return callback(txClient);
});

vi.mock('../../server/db.js', () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([{ '?column?': 1 }]),
    $transaction: (...args: unknown[]) => mockTransaction(...args) as unknown,
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
    txRawUnsafeCalls.length = 0; // clear the shared call log
    // Default: SET LOCAL returns undefined (void), DELETE returns 0
    mockTxExecuteRawUnsafe.mockImplementation((...args: unknown[]) => {
      txRawUnsafeCalls.push(args as [string, ...unknown[]]);
      // First call per batch is SET LOCAL (returns undefined/void)
      // Second call is DELETE (returns 0 by default)
      return Promise.resolve(0);
    });
  });

  it('returns 0 and does not call $transaction when given empty array', async () => {
    const result = await purgeExpiredAuditEvents([]);
    expect(result).toBe(0);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it('uses $transaction with SET LOCAL session flag before DELETE', async () => {
    // Override: first call (SET LOCAL) → undefined, second call (DELETE) → 3
    let callCount = 0;
    mockTxExecuteRawUnsafe.mockImplementation((...args: unknown[]) => {
      txRawUnsafeCalls.push(args as [string, ...unknown[]]);
      callCount++;
      if (callCount === 1) return Promise.resolve(undefined); // SET LOCAL
      return Promise.resolve(3); // DELETE
    });

    const ids = ['ae-1', 'ae-2', 'ae-3'];
    const result = await purgeExpiredAuditEvents(ids);

    expect(result).toBe(3);
    expect(mockTransaction).toHaveBeenCalledOnce();

    // First tx call must be SET LOCAL for authorized_retention_purge
    const [setLocalSql] = txRawUnsafeCalls[0] as [string];
    expect(setLocalSql).toContain('SET LOCAL');
    expect(setLocalSql).toContain('adjudica.authorized_retention_purge');
    expect(setLocalSql).toContain('true');

    // Second tx call must be DELETE FROM audit_events
    const [deleteSql, ...sqlParams] = txRawUnsafeCalls[1] as [string, ...string[]];
    expect(deleteSql).toContain('DELETE FROM audit_events');
    expect(deleteSql).toContain('WHERE id IN');
    expect(deleteSql).toContain('retention_expires_at < NOW()');
    // IDs must be passed as parameters (not interpolated)
    expect(sqlParams).toContain('ae-1');
    expect(sqlParams).toContain('ae-2');
    expect(sqlParams).toContain('ae-3');
  });

  it('returns 0 when DELETE returns 0 (all IDs had future expiry — re-validation blocked)', async () => {
    // Both SET LOCAL and DELETE return 0 — the DB WHERE clause filtered out non-expired rows
    const result = await purgeExpiredAuditEvents(['ae-not-expired']);
    expect(result).toBe(0);
  });

  it('generates correct number of SQL placeholders for the ID list', async () => {
    let callCount = 0;
    mockTxExecuteRawUnsafe.mockImplementation((...args: unknown[]) => {
      txRawUnsafeCalls.push(args as [string, ...unknown[]]);
      callCount++;
      if (callCount === 1) return Promise.resolve(undefined);
      return Promise.resolve(5);
    });

    const ids = ['ae-1', 'ae-2', 'ae-3', 'ae-4', 'ae-5'];
    await purgeExpiredAuditEvents(ids);

    // DELETE is the second tx call (index 1)
    const [sqlQuery] = txRawUnsafeCalls[1] as [string];
    // Should have $1 through $5 placeholders
    expect(sqlQuery).toContain('$1');
    expect(sqlQuery).toContain('$5');
  });

  it('processes IDs in batches of 1000 and accumulates totals', async () => {
    // Generate 2500 IDs — should result in 3 transaction calls (1000 + 1000 + 500)
    const ids = Array.from({ length: 2500 }, (_, i) => `ae-${i}`);

    let txCallCount = 0;
    mockTransaction.mockImplementation(async (callback: (tx: Record<string, unknown>) => Promise<unknown>) => {
      txCallCount++;
      let innerCallCount = 0;
      const txClient = {
        $executeRawUnsafe: vi.fn((...args: unknown[]) => {
          txRawUnsafeCalls.push(args as [string, ...unknown[]]);
          innerCallCount++;
          if (innerCallCount === 1) return Promise.resolve(undefined); // SET LOCAL
          // Return batch size as deleted count for each batch
          return Promise.resolve(txCallCount === 3 ? 500 : 1000);
        }),
      };
      return callback(txClient);
    });

    const result = await purgeExpiredAuditEvents(ids);

    // 3 batches: 1000 + 1000 + 500 = 2500
    expect(txCallCount).toBe(3);
    expect(result).toBe(2500);
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
