import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

/**
 * Health check — database error branch test.
 *
 * Covers the 503 error path in GET /api/health/db when the database
 * query fails (lines 30-31 in server/routes/health.ts).
 */

// Mock Prisma with a failing $queryRaw
vi.mock('../../server/db.js', () => ({
  prisma: {
    $queryRaw: vi.fn().mockRejectedValue(new Error('Connection refused')),
    auditEvent: {
      create: vi.fn().mockResolvedValue({}),
    },
    educationProfile: {
      findUnique: vi.fn().mockResolvedValue(null),
      upsert: vi.fn().mockResolvedValue({
        id: 'ep-1', userId: 'user-1', dismissedTerms: [],
        trainingModulesCompleted: null, isTrainingComplete: true, learningModeExpiry: null,
      }),
      update: vi.fn().mockResolvedValue({}),
    },
    workflowProgress: {
      create: vi.fn().mockResolvedValue({}),
      findUnique: vi.fn().mockResolvedValue(null),
      update: vi.fn().mockResolvedValue({}),
    },
  },
}));

const { buildServer } = await import('../../server/index.js');

describe('Health check — database error', () => {
  let server: Awaited<ReturnType<typeof buildServer>>;

  beforeAll(async () => {
    server = await buildServer();
  });

  afterAll(async () => {
    await server.close();
  });

  it('GET /api/health/db returns 503 when database is unreachable', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/health/db',
    });

    expect(response.statusCode).toBe(503);

    const body = response.json<{ status: string; database: string }>();
    expect(body.status).toBe('error');
    expect(body.database).toBe('disconnected');
  });
});
