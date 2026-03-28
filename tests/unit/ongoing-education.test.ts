import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Ongoing education service tests — Layer 3 continuous education.
 *
 * Tests:
 *   1. Regulatory changes listed correctly
 *   2. Acknowledging a change removes it from pending
 *   3. Monthly review detects due/not-due status
 *   4. Monthly review generation returns correct structure
 *   5. Monthly review completion persists data
 *   6. Quarterly refresher scoring works (all correct, all wrong, partial)
 *   7. Refresher status tracks completions
 *   8. Refresher: unknown quarter, incomplete answers
 *   9. Audit-triggered training (MVP empty)
 *  10. Edge cases: empty profiles, duplicate acks, invalid formats
 *
 * Regulatory authority: 10 CCR 2695.6 — ongoing training standards.
 */

// ---------------------------------------------------------------------------
// Mock Prisma
// ---------------------------------------------------------------------------

const mockEducationProfile: Record<string, {
  userId: string;
  acknowledgedChanges: string[];
  monthlyReviewsCompleted: Record<string, unknown> | null;
  quarterlyRefreshers: Record<string, unknown> | null;
  auditTrainingCompleted: Record<string, unknown> | null;
  lastRecertificationDate: Date | null;
}> = {};

const mockRegDeadlineFindMany = vi.fn();
const mockClaimFindMany = vi.fn();

vi.mock('../../server/db.js', () => ({
  prisma: {
    educationProfile: {
      upsert: vi.fn(({ where, create }: {
        where: { userId: string };
        create: { userId: string };
      }) => {
        const userId = where.userId;
        if (!mockEducationProfile[userId]) {
          mockEducationProfile[userId] = {
            userId: create.userId,
            acknowledgedChanges: [],
            monthlyReviewsCompleted: null,
            quarterlyRefreshers: null,
            auditTrainingCompleted: null,
            lastRecertificationDate: null,
          };
        }
        return mockEducationProfile[userId];
      }),
      findUnique: vi.fn(({ where }: { where: { userId: string } }) => {
        return mockEducationProfile[where.userId] ?? null;
      }),
      findUniqueOrThrow: vi.fn(({ where }: { where: { userId: string } }) => {
        const profile = mockEducationProfile[where.userId];
        if (!profile) throw new Error('Not found');
        return profile;
      }),
      update: vi.fn(({ where, data }: {
        where: { userId: string };
        data: Record<string, unknown>;
      }) => {
        const userId = where.userId;
        const profile = mockEducationProfile[userId];
        if (!profile) throw new Error('Not found');

        if (data.acknowledgedChanges && typeof data.acknowledgedChanges === 'object') {
          const pushData = data.acknowledgedChanges as { push?: string };
          if (pushData.push) {
            profile.acknowledgedChanges.push(pushData.push);
          }
        }
        if (data.monthlyReviewsCompleted !== undefined) {
          profile.monthlyReviewsCompleted = data.monthlyReviewsCompleted as Record<string, unknown>;
        }
        if (data.quarterlyRefreshers !== undefined) {
          profile.quarterlyRefreshers = data.quarterlyRefreshers as Record<string, unknown>;
        }

        return profile;
      }),
    },
    regulatoryDeadline: {
      findMany: (...args: unknown[]) => mockRegDeadlineFindMany(...args) as unknown,
    },
    claim: {
      findMany: (...args: unknown[]) => mockClaimFindMany(...args) as unknown,
    },
  },
}));

// ---------------------------------------------------------------------------
// Import after mocks
// ---------------------------------------------------------------------------

import {
  getActiveRegulatoryChanges,
  acknowledgeChange,
  getPendingChanges,
  isMonthlyReviewDue,
  completeMonthlyReview,
  generateMonthlyReview,
  getCurrentRefresher,
  submitRefresherAssessment,
  getRefresherStatus,
  getRequiredAuditTraining,
} from '../../server/services/ongoing-education.service.js';

import { REGULATORY_CHANGES } from '../../server/data/regulatory-changes.js';
import { QUARTERLY_REFRESHERS } from '../../server/data/quarterly-refreshers.js';

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  // Clear mock profiles between tests
  for (const key of Object.keys(mockEducationProfile)) {
    Reflect.deleteProperty(mockEducationProfile, key);
  }
  vi.clearAllMocks();
  // Default: DB queries return empty arrays
  mockRegDeadlineFindMany.mockResolvedValue([]);
  mockClaimFindMany.mockResolvedValue([]);
});

const TEST_USER_ID = 'user-ongoing-1';
const TEST_ORG_ID = 'org-1';

function createProfile(overrides: Partial<typeof mockEducationProfile[string]> = {}) {
  mockEducationProfile[TEST_USER_ID] = {
    userId: TEST_USER_ID,
    acknowledgedChanges: [],
    monthlyReviewsCompleted: null,
    quarterlyRefreshers: null,
    auditTrainingCompleted: null,
    lastRecertificationDate: null,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Regulatory change tests
// ---------------------------------------------------------------------------

describe('Regulatory changes', () => {
  it('lists all active regulatory changes', () => {
    const changes = getActiveRegulatoryChanges();
    expect(changes.length).toBeGreaterThanOrEqual(2);
    expect(changes[0]).toHaveProperty('id');
    expect(changes[0]).toHaveProperty('title');
    expect(changes[0]).toHaveProperty('effectiveDate');
    expect(changes[0]).toHaveProperty('affectedStatutes');
    expect(changes[0]).toHaveProperty('urgency');
  });

  it('returns the same reference as REGULATORY_CHANGES constant', () => {
    const changes = getActiveRegulatoryChanges();
    expect(changes).toBe(REGULATORY_CHANGES);
  });

  it('returns all changes as pending for a new user (no profile)', async () => {
    const pending = await getPendingChanges(TEST_USER_ID);
    expect(pending.length).toBe(REGULATORY_CHANGES.length);
  });

  it('returns all changes as pending for a user with empty acknowledged list', async () => {
    createProfile({ acknowledgedChanges: [] });
    const pending = await getPendingChanges(TEST_USER_ID);
    expect(pending.length).toBe(REGULATORY_CHANGES.length);
  });

  it('acknowledging a change removes it from pending', async () => {
    createProfile();

    const changeId = (REGULATORY_CHANGES[0] as (typeof REGULATORY_CHANGES)[number]).id;
    await acknowledgeChange(TEST_USER_ID, changeId);

    const pending = await getPendingChanges(TEST_USER_ID);
    const pendingIds = pending.map((c) => c.id);
    expect(pendingIds).not.toContain(changeId);
    expect(pending.length).toBe(REGULATORY_CHANGES.length - 1);
  });

  it('acknowledging multiple changes removes all from pending', async () => {
    createProfile();

    const changeId1 = (REGULATORY_CHANGES[0] as (typeof REGULATORY_CHANGES)[number]).id;
    const changeId2 = (REGULATORY_CHANGES[1] as (typeof REGULATORY_CHANGES)[number]).id;
    await acknowledgeChange(TEST_USER_ID, changeId1);
    await acknowledgeChange(TEST_USER_ID, changeId2);

    const pending = await getPendingChanges(TEST_USER_ID);
    const pendingIds = pending.map((c) => c.id);
    expect(pendingIds).not.toContain(changeId1);
    expect(pendingIds).not.toContain(changeId2);
    expect(pending.length).toBe(REGULATORY_CHANGES.length - 2);
  });

  it('throws for unknown change ID', async () => {
    await expect(
      acknowledgeChange(TEST_USER_ID, 'rc-nonexistent'),
    ).rejects.toThrow('Unknown regulatory change');
  });

  it('acknowledging an already-acknowledged change is a no-op', async () => {
    const changeId = (REGULATORY_CHANGES[0] as (typeof REGULATORY_CHANGES)[number]).id;
    createProfile({ acknowledgedChanges: [changeId] });

    // Should not throw or duplicate
    await acknowledgeChange(TEST_USER_ID, changeId);
    expect(mockEducationProfile[TEST_USER_ID]!.acknowledgedChanges.filter((id) => id === changeId).length).toBe(1);
  });

  it('creates profile via upsert when acknowledging for new user', async () => {
    // No profile exists — upsert should create one
    const changeId = (REGULATORY_CHANGES[0] as (typeof REGULATORY_CHANGES)[number]).id;
    await acknowledgeChange(TEST_USER_ID, changeId);

    expect(mockEducationProfile[TEST_USER_ID]).toBeDefined();
    expect(mockEducationProfile[TEST_USER_ID]!.acknowledgedChanges).toContain(changeId);
  });
});

// ---------------------------------------------------------------------------
// Monthly review tests
// ---------------------------------------------------------------------------

describe('Monthly compliance review', () => {
  it('detects monthly review as due for a new user (no profile)', async () => {
    const isDue = await isMonthlyReviewDue(TEST_USER_ID);
    expect(isDue).toBe(true);
  });

  it('detects monthly review as due when profile exists but no completions', async () => {
    createProfile({ monthlyReviewsCompleted: null });
    const isDue = await isMonthlyReviewDue(TEST_USER_ID);
    expect(isDue).toBe(true);
  });

  it('detects monthly review as due when profile has empty completions object', async () => {
    createProfile({ monthlyReviewsCompleted: {} });
    const isDue = await isMonthlyReviewDue(TEST_USER_ID);
    expect(isDue).toBe(true);
  });

  it('detects monthly review as not due after completion for current month', async () => {
    const now = new Date();
    const currentMonth = `${String(now.getFullYear())}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    createProfile({
      monthlyReviewsCompleted: {
        [currentMonth]: { completedAt: now.toISOString(), missedDeadlineCount: 0 },
      },
    });

    const isDue = await isMonthlyReviewDue(TEST_USER_ID);
    expect(isDue).toBe(false);
  });

  it('detects monthly review as due when only a different month is completed', async () => {
    createProfile({
      monthlyReviewsCompleted: {
        '2025-01': { completedAt: '2025-01-15T00:00:00Z', missedDeadlineCount: 0 },
      },
    });

    const isDue = await isMonthlyReviewDue(TEST_USER_ID);
    expect(isDue).toBe(true);
  });

  it('generates a monthly review with required fields', async () => {
    createProfile();

    const review = await generateMonthlyReview(TEST_USER_ID, TEST_ORG_ID);
    expect(review).toHaveProperty('month');
    expect(review).toHaveProperty('userId', TEST_USER_ID);
    expect(review).toHaveProperty('organizationId', TEST_ORG_ID);
    expect(review).toHaveProperty('missedDeadlines');
    expect(review).toHaveProperty('approachingDeadlines');
    expect(review).toHaveProperty('claimsWithoutRecentActivity');
    expect(review).toHaveProperty('generatedAt');
    expect(Array.isArray(review.missedDeadlines)).toBe(true);
    expect(Array.isArray(review.approachingDeadlines)).toBe(true);
    expect(Array.isArray(review.claimsWithoutRecentActivity)).toBe(true);
  });

  it('generates review with correct month format (YYYY-MM)', async () => {
    createProfile();

    const review = await generateMonthlyReview(TEST_USER_ID, TEST_ORG_ID);
    expect(review.month).toMatch(/^\d{4}-\d{2}$/);
  });

  it('generates review with valid ISO timestamp for generatedAt', async () => {
    createProfile();

    const review = await generateMonthlyReview(TEST_USER_ID, TEST_ORG_ID);
    const parsed = new Date(review.generatedAt);
    expect(parsed.getTime()).not.toBeNaN();
  });

  it('generates review with missed deadlines when DB returns results', async () => {
    createProfile();

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 3);

    mockRegDeadlineFindMany.mockResolvedValueOnce([
      {
        claim: { id: 'claim-1', claimNumber: 'WC-2026-0001' },
        deadlineType: 'INITIAL_ACCEPTANCE_90',
        dueDate: pastDate,
      },
    ]);

    const review = await generateMonthlyReview(TEST_USER_ID, TEST_ORG_ID);
    expect(review.missedDeadlines.length).toBe(1);
    expect(review.missedDeadlines[0]!.claimId).toBe('claim-1');
    expect(review.missedDeadlines[0]!.claimNumber).toBe('WC-2026-0001');
    expect(review.missedDeadlines[0]!.deadlineType).toBe('INITIAL_ACCEPTANCE_90');
    expect(review.missedDeadlines[0]!.daysPastDue).toBeGreaterThanOrEqual(2);
  });

  it('generates review with approaching deadlines when DB returns results', async () => {
    createProfile();

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    // First call is missed deadlines (return empty), second is approaching
    mockRegDeadlineFindMany.mockResolvedValueOnce([]);
    mockRegDeadlineFindMany.mockResolvedValueOnce([
      {
        claim: { id: 'claim-2', claimNumber: 'WC-2026-0002' },
        deadlineType: 'TD_FIRST_PAYMENT',
        dueDate: futureDate,
      },
    ]);

    const review = await generateMonthlyReview(TEST_USER_ID, TEST_ORG_ID);
    expect(review.approachingDeadlines.length).toBe(1);
    expect(review.approachingDeadlines[0]!.claimId).toBe('claim-2');
    expect(review.approachingDeadlines[0]!.daysUntilDue).toBeGreaterThanOrEqual(6);
  });

  it('generates review with stale claims when DB returns results', async () => {
    createProfile();

    const staleDate = new Date();
    staleDate.setDate(staleDate.getDate() - 45);

    mockClaimFindMany.mockResolvedValueOnce([
      {
        id: 'claim-3',
        claimNumber: 'WC-2026-0003',
        updatedAt: staleDate,
      },
    ]);

    const review = await generateMonthlyReview(TEST_USER_ID, TEST_ORG_ID);
    expect(review.claimsWithoutRecentActivity.length).toBe(1);
    expect(review.claimsWithoutRecentActivity[0]!.claimId).toBe('claim-3');
    expect(review.claimsWithoutRecentActivity[0]!.daysSinceActivity).toBeGreaterThanOrEqual(44);
  });

  it('returns empty arrays when DB queries throw (graceful degradation)', async () => {
    createProfile();

    mockRegDeadlineFindMany.mockRejectedValue(new Error('DB connection lost'));
    mockClaimFindMany.mockRejectedValue(new Error('DB connection lost'));

    const review = await generateMonthlyReview(TEST_USER_ID, TEST_ORG_ID);
    expect(review.missedDeadlines).toEqual([]);
    expect(review.approachingDeadlines).toEqual([]);
    expect(review.claimsWithoutRecentActivity).toEqual([]);
  });

  it('completes monthly review and persists', async () => {
    createProfile();

    await completeMonthlyReview(TEST_USER_ID, '2026-03');
    expect(mockEducationProfile[TEST_USER_ID]!.monthlyReviewsCompleted).toHaveProperty('2026-03');
  });

  it('completes monthly review preserving previous months', async () => {
    createProfile({
      monthlyReviewsCompleted: {
        '2026-01': { completedAt: '2026-01-15T00:00:00Z', missedDeadlineCount: 2 },
      },
    });

    await completeMonthlyReview(TEST_USER_ID, '2026-02');
    const completions = mockEducationProfile[TEST_USER_ID]!.monthlyReviewsCompleted as Record<string, unknown>;
    expect(completions).toHaveProperty('2026-01');
    expect(completions).toHaveProperty('2026-02');
  });

  it('rejects invalid month format — text', async () => {
    await expect(
      completeMonthlyReview(TEST_USER_ID, 'March 2026'),
    ).rejects.toThrow('Invalid month format');
  });

  it('rejects invalid month format — wrong separator', async () => {
    await expect(
      completeMonthlyReview(TEST_USER_ID, '2026/03'),
    ).rejects.toThrow('Invalid month format');
  });

  it('rejects invalid month format — full date', async () => {
    await expect(
      completeMonthlyReview(TEST_USER_ID, '2026-03-15'),
    ).rejects.toThrow('Invalid month format');
  });

  it('rejects invalid month format — empty string', async () => {
    await expect(
      completeMonthlyReview(TEST_USER_ID, ''),
    ).rejects.toThrow('Invalid month format');
  });
});

// ---------------------------------------------------------------------------
// Quarterly refresher tests
// ---------------------------------------------------------------------------

describe('Quarterly refreshers', () => {
  it('has valid refresher data with correct structure', () => {
    expect(QUARTERLY_REFRESHERS.length).toBeGreaterThanOrEqual(2);
    for (const refresher of QUARTERLY_REFRESHERS) {
      expect(refresher).toHaveProperty('id');
      expect(refresher).toHaveProperty('quarter');
      expect(refresher).toHaveProperty('title');
      expect(refresher).toHaveProperty('passingScore');
      expect(refresher.questions.length).toBe(refresher.totalQuestions);
      for (const q of refresher.questions) {
        expect(q).toHaveProperty('correctOptionId');
        expect(q.options.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('getCurrentRefresher strips correctOptionId', () => {
    const refresher = getCurrentRefresher();
    if (refresher) {
      for (const q of refresher.questions) {
        expect(q).not.toHaveProperty('correctOptionId');
        expect(q).toHaveProperty('questionText');
        expect(q).toHaveProperty('options');
        expect(q).toHaveProperty('id');
        expect(q).toHaveProperty('explanation');
      }
    }
    // If no refresher for current quarter, null is valid
    expect(refresher === null || typeof refresher === 'object').toBe(true);
  });

  it('getCurrentRefresher preserves all non-answer fields', () => {
    const refresher = getCurrentRefresher();
    if (refresher) {
      expect(refresher).toHaveProperty('id');
      expect(refresher).toHaveProperty('quarter');
      expect(refresher).toHaveProperty('title');
      expect(refresher).toHaveProperty('passingScore');
      expect(refresher).toHaveProperty('totalQuestions');
      expect(refresher.questions.length).toBe(refresher.totalQuestions);
    }
  });

  it('scores a refresher assessment correctly — all correct', async () => {
    const refresher = (QUARTERLY_REFRESHERS[0] as (typeof QUARTERLY_REFRESHERS)[number]);
    createProfile();

    const allCorrectAnswers: Record<string, string> = {};
    for (const q of refresher.questions) {
      allCorrectAnswers[q.id] = q.correctOptionId;
    }

    const result = await submitRefresherAssessment(
      TEST_USER_ID,
      refresher.quarter,
      allCorrectAnswers,
    );

    expect(result.score).toBe(1);
    expect(result.passed).toBe(true);
    expect(result.correctCount).toBe(refresher.totalQuestions);
    expect(result.totalQuestions).toBe(refresher.totalQuestions);
    expect(result.quarter).toBe(refresher.quarter);
    expect(result.results.length).toBe(refresher.totalQuestions);
    expect(result.results.every((r) => r.correct)).toBe(true);
  });

  it('scores a refresher assessment correctly — all wrong', async () => {
    const refresher = (QUARTERLY_REFRESHERS[0] as (typeof QUARTERLY_REFRESHERS)[number]);
    createProfile();

    const allWrongAnswers: Record<string, string> = {};
    for (const q of refresher.questions) {
      const wrongOption = q.options.find((o) => o.id !== q.correctOptionId);
      allWrongAnswers[q.id] = (wrongOption as NonNullable<typeof wrongOption>).id;
    }

    const result = await submitRefresherAssessment(
      TEST_USER_ID,
      refresher.quarter,
      allWrongAnswers,
    );

    expect(result.score).toBe(0);
    expect(result.passed).toBe(false);
    expect(result.correctCount).toBe(0);
    expect(result.results.every((r) => !r.correct)).toBe(true);
  });

  it('scores partial correct answers (some right, some wrong)', async () => {
    const refresher = (QUARTERLY_REFRESHERS[0] as (typeof QUARTERLY_REFRESHERS)[number]);
    createProfile();

    const mixedAnswers: Record<string, string> = {};
    refresher.questions.forEach((q, i) => {
      if (i === 0) {
        // First question correct
        mixedAnswers[q.id] = q.correctOptionId;
      } else {
        // Rest wrong
        const wrongOption = q.options.find((o) => o.id !== q.correctOptionId);
        mixedAnswers[q.id] = (wrongOption as NonNullable<typeof wrongOption>).id;
      }
    });

    const result = await submitRefresherAssessment(
      TEST_USER_ID,
      refresher.quarter,
      mixedAnswers,
    );

    expect(result.correctCount).toBe(1);
    expect(result.score).toBeCloseTo(1 / refresher.totalQuestions, 5);
    expect(result.totalQuestions).toBe(refresher.totalQuestions);
  });

  it('includes explanation for every graded question', async () => {
    const refresher = (QUARTERLY_REFRESHERS[0] as (typeof QUARTERLY_REFRESHERS)[number]);
    createProfile();

    const answers: Record<string, string> = {};
    for (const q of refresher.questions) {
      answers[q.id] = q.correctOptionId;
    }

    const result = await submitRefresherAssessment(
      TEST_USER_ID,
      refresher.quarter,
      answers,
    );

    for (const r of result.results) {
      expect(r.explanation).toBeTruthy();
      expect(typeof r.explanation).toBe('string');
      expect(r.questionId).toBeTruthy();
    }
  });

  it('persists result to quarterlyRefreshers on profile', async () => {
    const refresher = (QUARTERLY_REFRESHERS[0] as (typeof QUARTERLY_REFRESHERS)[number]);
    createProfile();

    const answers: Record<string, string> = {};
    for (const q of refresher.questions) {
      answers[q.id] = q.correctOptionId;
    }

    await submitRefresherAssessment(TEST_USER_ID, refresher.quarter, answers);

    const stored = mockEducationProfile[TEST_USER_ID]!.quarterlyRefreshers as Record<string, { passed: boolean; score: number }>;
    expect(stored).toHaveProperty(refresher.quarter);
    expect(stored[refresher.quarter]!.passed).toBe(true);
    expect(stored[refresher.quarter]!.score).toBe(1);
  });

  it('throws for unknown quarter', async () => {
    await expect(
      submitRefresherAssessment(TEST_USER_ID, '2099-Q4', {}),
    ).rejects.toThrow('Quarterly refresher not found');
  });

  it('throws for incomplete answers', async () => {
    const refresher = (QUARTERLY_REFRESHERS[0] as (typeof QUARTERLY_REFRESHERS)[number]);
    createProfile();

    // Only answer the first question
    const partial: Record<string, string> = {
      [(refresher.questions[0] as (typeof refresher.questions)[number]).id]: (refresher.questions[0] as (typeof refresher.questions)[number]).correctOptionId,
    };

    await expect(
      submitRefresherAssessment(TEST_USER_ID, refresher.quarter, partial),
    ).rejects.toThrow('Refresher assessment incomplete');
  });

  it('throws for empty answers object', async () => {
    const refresher = (QUARTERLY_REFRESHERS[0] as (typeof QUARTERLY_REFRESHERS)[number]);
    createProfile();

    await expect(
      submitRefresherAssessment(TEST_USER_ID, refresher.quarter, {}),
    ).rejects.toThrow('Refresher assessment incomplete');
  });

  it('tracks refresher status with completions', async () => {
    const refresher = (QUARTERLY_REFRESHERS[0] as (typeof QUARTERLY_REFRESHERS)[number]);
    createProfile({
      quarterlyRefreshers: {
        [refresher.quarter]: {
          completedAt: new Date().toISOString(),
          score: 1.0,
          passed: true,
        },
      },
    });

    const status = await getRefresherStatus(TEST_USER_ID);
    expect(status).toHaveProperty('completedRefreshers');
    expect(status.completedRefreshers).toHaveProperty(refresher.quarter);
    expect((status.completedRefreshers[refresher.quarter] as NonNullable<(typeof status.completedRefreshers)[string]>).passed).toBe(true);
  });

  it('returns isCurrentQuarterComplete=false when no completions', async () => {
    createProfile({ quarterlyRefreshers: null });

    const status = await getRefresherStatus(TEST_USER_ID);
    expect(status.isCurrentQuarterComplete).toBe(false);
    expect(status.completedRefreshers).toEqual({});
  });

  it('returns isCurrentQuarterComplete=false for new user (no profile)', async () => {
    const status = await getRefresherStatus(TEST_USER_ID);
    expect(status.isCurrentQuarterComplete).toBe(false);
  });

  it('returns isCurrentQuarterComplete=false when current quarter was failed', async () => {
    const now = new Date();
    const year = now.getFullYear();
    const quarter = Math.floor(now.getMonth() / 3) + 1;
    const currentQuarterStr = `${year}-Q${quarter}`;

    createProfile({
      quarterlyRefreshers: {
        [currentQuarterStr]: {
          completedAt: new Date().toISOString(),
          score: 0.4,
          passed: false,
        },
      },
    });

    const status = await getRefresherStatus(TEST_USER_ID);
    expect(status.isCurrentQuarterComplete).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Audit-triggered training tests
// ---------------------------------------------------------------------------

describe('Audit-triggered training', () => {
  it('returns empty array for MVP (no audit integration)', async () => {
    createProfile();

    const requirements = await getRequiredAuditTraining(TEST_USER_ID);
    expect(Array.isArray(requirements)).toBe(true);
    expect(requirements.length).toBe(0);
  });

  it('creates profile via upsert if no profile exists', async () => {
    // No profile exists
    const requirements = await getRequiredAuditTraining(TEST_USER_ID);
    expect(requirements).toEqual([]);
    expect(mockEducationProfile[TEST_USER_ID]).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Data integrity tests
// ---------------------------------------------------------------------------

describe('Regulatory change data integrity', () => {
  it('all changes have required fields', () => {
    for (const change of REGULATORY_CHANGES) {
      expect(change.id).toBeTruthy();
      expect(change.title).toBeTruthy();
      expect(change.description).toBeTruthy();
      expect(change.effectiveDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(change.affectedStatutes.length).toBeGreaterThan(0);
      expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(change.urgency);
    }
  });

  it('all change IDs are unique', () => {
    const ids = REGULATORY_CHANGES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all change IDs follow naming convention (rc- prefix)', () => {
    for (const change of REGULATORY_CHANGES) {
      expect(change.id).toMatch(/^rc-/);
    }
  });

  it('all affected statutes are non-empty strings', () => {
    for (const change of REGULATORY_CHANGES) {
      for (const statute of change.affectedStatutes) {
        expect(typeof statute).toBe('string');
        expect(statute.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('Quarterly refresher data integrity', () => {
  it('all refresher IDs match their quarter string', () => {
    for (const refresher of QUARTERLY_REFRESHERS) {
      expect(refresher.id).toBe(refresher.quarter);
    }
  });

  it('all refresher quarter strings follow YYYY-Q# format', () => {
    for (const refresher of QUARTERLY_REFRESHERS) {
      expect(refresher.quarter).toMatch(/^\d{4}-Q[1-4]$/);
    }
  });

  it('all questions have unique IDs within each refresher', () => {
    for (const refresher of QUARTERLY_REFRESHERS) {
      const ids = refresher.questions.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('all correct option IDs reference a valid option', () => {
    for (const refresher of QUARTERLY_REFRESHERS) {
      for (const q of refresher.questions) {
        const optionIds = q.options.map((o) => o.id);
        expect(optionIds).toContain(q.correctOptionId);
      }
    }
  });

  it('passing score is between 0 and 1', () => {
    for (const refresher of QUARTERLY_REFRESHERS) {
      expect(refresher.passingScore).toBeGreaterThan(0);
      expect(refresher.passingScore).toBeLessThanOrEqual(1);
    }
  });
});
