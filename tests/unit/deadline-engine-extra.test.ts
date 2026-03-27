import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Deadline engine — additional coverage tests.
 *
 * Covers uncovered branches in server/services/deadline-engine.service.ts:
 * - enrichDeadline for MET/WAIVED status (returns GREEN urgency)
 * - enrichDeadline auto-MISSED for OVERDUE + PENDING
 * - getDeadlineSummary with WAIVED deadlines
 * - recalculateDeadlines with business day calculation
 * - getAllUserDeadlines for supervisor role (no examiner filter)
 * - getAllUserDeadlinesPaginated with urgencyFilter and statusFilter
 */

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockDeadlineFindMany = vi.fn();
const mockDeadlineCount = vi.fn();
const mockDeadlineUpdate = vi.fn();

vi.mock('../../server/db.js', () => ({
  prisma: {
    regulatoryDeadline: {
      findMany: (...args: unknown[]) => mockDeadlineFindMany(...args) as unknown,
      count: (...args: unknown[]) => mockDeadlineCount(...args) as unknown,
      update: (...args: unknown[]) => mockDeadlineUpdate(...args) as unknown,
    },
  },
}));

const {
  classifyUrgency,
  addBusinessDays,
  getClaimDeadlines,
  getAllUserDeadlines,
  getAllUserDeadlinesPaginated,
  getDeadlineSummary,
  markDeadline,
  recalculateDeadlines,
} = await import('../../server/services/deadline-engine.service.js');
const { UserRole } = await import('../../server/middleware/rbac.js');

describe('Deadline Engine — additional coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // enrichDeadline — MET/WAIVED returns GREEN urgency
  // -------------------------------------------------------------------------

  describe('getClaimDeadlines — enrichDeadline branches', () => {
    it('MET deadlines get GREEN urgency regardless of dates', async () => {
      mockDeadlineFindMany.mockResolvedValueOnce([
        {
          id: 'dl-met',
          claimId: 'claim-1',
          deadlineType: 'ACKNOWLEDGE_15DAY',
          dueDate: new Date('2025-01-01'), // Past due
          status: 'MET',
          statutoryAuthority: '10 CCR 2695.5(b)',
          createdAt: new Date('2024-12-01'),
          completedAt: new Date('2024-12-15'),
        },
      ]);

      const result = await getClaimDeadlines('claim-1');
      expect(result).toHaveLength(1);
      expect(result[0]!.urgency).toBe('GREEN');
      expect(result[0]!.percentElapsed).toBe(100);
      expect(result[0]!.daysRemaining).toBe(0);
      expect(result[0]!.status).toBe('MET');
    });

    it('WAIVED deadlines get GREEN urgency', async () => {
      mockDeadlineFindMany.mockResolvedValueOnce([
        {
          id: 'dl-waived',
          claimId: 'claim-1',
          deadlineType: 'ACKNOWLEDGE_15DAY',
          dueDate: new Date('2025-01-01'),
          status: 'WAIVED',
          statutoryAuthority: '10 CCR 2695.5(b)',
          createdAt: new Date('2024-12-01'),
          completedAt: new Date('2024-12-20'),
        },
      ]);

      const result = await getClaimDeadlines('claim-1');
      expect(result[0]!.urgency).toBe('GREEN');
      expect(result[0]!.status).toBe('WAIVED');
    });

    it('PENDING + OVERDUE auto-marks as MISSED', async () => {
      mockDeadlineFindMany.mockResolvedValueOnce([
        {
          id: 'dl-overdue',
          claimId: 'claim-1',
          deadlineType: 'ACKNOWLEDGE_15DAY',
          dueDate: new Date('2025-01-01'), // Well past due
          status: 'PENDING',
          statutoryAuthority: '10 CCR 2695.5(b)',
          createdAt: new Date('2024-12-01'),
          completedAt: null,
        },
      ]);

      const result = await getClaimDeadlines('claim-1');
      expect(result[0]!.urgency).toBe('OVERDUE');
      expect(result[0]!.status).toBe('MISSED'); // Auto-changed from PENDING
    });
  });

  // -------------------------------------------------------------------------
  // getDeadlineSummary — all status types
  // -------------------------------------------------------------------------

  describe('getDeadlineSummary', () => {
    it('counts all status types including WAIVED and OVERDUE', async () => {
      const now = new Date();
      const future = new Date(now.getTime() + 30 * 86400000);
      const past = new Date('2025-01-01');

      mockDeadlineFindMany.mockResolvedValueOnce([
        { id: 'dl-1', claimId: 'c1', deadlineType: 'ACKNOWLEDGE_15DAY', dueDate: future, status: 'PENDING', statutoryAuthority: 'x', createdAt: now, completedAt: null },
        { id: 'dl-2', claimId: 'c1', deadlineType: 'TD_FIRST_14DAY', dueDate: past, status: 'MET', statutoryAuthority: 'x', createdAt: new Date('2024-12-01'), completedAt: new Date('2024-12-15') },
        { id: 'dl-3', claimId: 'c1', deadlineType: 'DELAY_NOTICE_30DAY', dueDate: past, status: 'MISSED', statutoryAuthority: 'x', createdAt: new Date('2024-12-01'), completedAt: null },
        { id: 'dl-4', claimId: 'c1', deadlineType: 'EMPLOYER_NOTIFY_15DAY', dueDate: past, status: 'WAIVED', statutoryAuthority: 'x', createdAt: new Date('2024-12-01'), completedAt: new Date('2024-12-20') },
        { id: 'dl-5', claimId: 'c1', deadlineType: 'DETERMINE_40DAY', dueDate: past, status: 'PENDING', statutoryAuthority: 'x', createdAt: new Date('2024-12-01'), completedAt: null },
      ]);

      const summary = await getDeadlineSummary('c1');
      expect(summary.total).toBe(5);
      expect(summary.pending).toBe(1); // dl-1 is future pending
      expect(summary.met).toBe(1);
      // dl-3 MISSED + dl-5 PENDING past due -> both MISSED after enrichment
      expect(summary.missed).toBe(2);
      expect(summary.waived).toBe(1);
      expect(summary.overdue).toBeGreaterThanOrEqual(2);
      expect(summary.urgentCount).toBeGreaterThanOrEqual(2);
    });
  });

  // -------------------------------------------------------------------------
  // getAllUserDeadlines — supervisor role (no examiner filter)
  // -------------------------------------------------------------------------

  describe('getAllUserDeadlines', () => {
    it('supervisor sees all org deadlines (no assignedExaminerId filter)', async () => {
      mockDeadlineFindMany.mockResolvedValueOnce([]);

      await getAllUserDeadlines('user-sup', 'org-1', UserRole.CLAIMS_SUPERVISOR);

      expect(mockDeadlineFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            claim: expect.not.objectContaining({
              assignedExaminerId: expect.anything(),
            }),
          }),
        }),
      );
    });

    it('examiner only sees own deadlines', async () => {
      mockDeadlineFindMany.mockResolvedValueOnce([]);

      await getAllUserDeadlines('user-ex', 'org-1', UserRole.CLAIMS_EXAMINER);

      expect(mockDeadlineFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            claim: expect.objectContaining({
              assignedExaminerId: 'user-ex',
            }),
          }),
        }),
      );
    });

    it('sorts by urgency (OVERDUE first, then RED, YELLOW, GREEN)', async () => {
      const now = new Date();
      const future30 = new Date(now.getTime() + 30 * 86400000);
      const past = new Date('2025-01-01');

      mockDeadlineFindMany.mockResolvedValueOnce([
        // GREEN: far future, recently created
        { id: 'dl-green', claimId: 'c1', deadlineType: 'ACKNOWLEDGE_15DAY', dueDate: future30, status: 'PENDING', statutoryAuthority: 'x', createdAt: now, completedAt: null },
        // OVERDUE: past due
        { id: 'dl-overdue', claimId: 'c1', deadlineType: 'TD_FIRST_14DAY', dueDate: past, status: 'PENDING', statutoryAuthority: 'x', createdAt: new Date('2024-12-01'), completedAt: null },
      ]);

      const result = await getAllUserDeadlines('user-1', 'org-1', UserRole.CLAIMS_EXAMINER);
      expect(result[0]!.urgency).toBe('OVERDUE');
      expect(result[1]!.urgency).toBe('GREEN');
    });
  });

  // -------------------------------------------------------------------------
  // getAllUserDeadlinesPaginated — urgency/status filters
  // -------------------------------------------------------------------------

  describe('getAllUserDeadlinesPaginated', () => {
    it('applies statusFilter at DB level', async () => {
      mockDeadlineCount.mockResolvedValueOnce(3);
      mockDeadlineFindMany.mockResolvedValueOnce([]);

      await getAllUserDeadlinesPaginated('user-1', 'org-1', UserRole.CLAIMS_EXAMINER, {
        statusFilter: ['PENDING' as const],
      });

      expect(mockDeadlineFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: { in: ['PENDING'] },
          }),
        }),
      );
    });

    it('applies urgencyFilter post-query with proper pagination', async () => {
      const now = new Date();
      const past = new Date('2025-01-01');
      const future = new Date(now.getTime() + 30 * 86400000);

      mockDeadlineCount.mockResolvedValueOnce(2);
      mockDeadlineFindMany.mockResolvedValueOnce([
        { id: 'dl-overdue', claimId: 'c1', deadlineType: 'ACKNOWLEDGE_15DAY', dueDate: past, status: 'PENDING', statutoryAuthority: 'x', createdAt: new Date('2024-12-01'), completedAt: null },
        { id: 'dl-green', claimId: 'c1', deadlineType: 'TD_FIRST_14DAY', dueDate: future, status: 'PENDING', statutoryAuthority: 'x', createdAt: now, completedAt: null },
      ]);

      const result = await getAllUserDeadlinesPaginated('user-1', 'org-1', UserRole.CLAIMS_EXAMINER, {
        urgencyFilter: ['OVERDUE'],
        take: 10,
        skip: 0,
      });

      expect(result.deadlines).toHaveLength(1);
      expect(result.deadlines[0]!.urgency).toBe('OVERDUE');
      expect(result.total).toBe(1); // Only OVERDUE matches filter
    });

    it('returns default pagination when no options', async () => {
      mockDeadlineCount.mockResolvedValueOnce(0);
      mockDeadlineFindMany.mockResolvedValueOnce([]);

      const result = await getAllUserDeadlinesPaginated('user-1', 'org-1', UserRole.CLAIMS_EXAMINER);
      expect(result.deadlines).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  // -------------------------------------------------------------------------
  // markDeadline
  // -------------------------------------------------------------------------

  describe('markDeadline', () => {
    it('updates deadline status to MET with completedAt', async () => {
      const updated = {
        id: 'dl-1', status: 'MET', completedAt: new Date(),
      };
      mockDeadlineUpdate.mockResolvedValueOnce(updated);

      const result = await markDeadline('dl-1', 'MET');
      expect(result.status).toBe('MET');
      expect(mockDeadlineUpdate).toHaveBeenCalledWith({
        where: { id: 'dl-1' },
        data: expect.objectContaining({ status: 'MET' }),
      });
    });

    it('updates deadline status to WAIVED', async () => {
      const updated = { id: 'dl-1', status: 'WAIVED', completedAt: new Date() };
      mockDeadlineUpdate.mockResolvedValueOnce(updated);

      const result = await markDeadline('dl-1', 'WAIVED', 'Duplicate claim');
      expect(result.status).toBe('WAIVED');
    });
  });

  // -------------------------------------------------------------------------
  // recalculateDeadlines
  // -------------------------------------------------------------------------

  describe('recalculateDeadlines', () => {
    it('recalculates pending deadlines with new dateReceived', async () => {
      mockDeadlineFindMany.mockResolvedValueOnce([
        { id: 'dl-1', deadlineType: 'ACKNOWLEDGE_15DAY', status: 'PENDING' },
        { id: 'dl-2', deadlineType: 'TD_FIRST_14DAY', status: 'PENDING' },
      ]);
      mockDeadlineUpdate.mockResolvedValue({});

      await recalculateDeadlines('claim-1', new Date('2026-03-01'));

      expect(mockDeadlineUpdate).toHaveBeenCalledTimes(2);
      // ACKNOWLEDGE_15DAY = 15 calendar days
      expect(mockDeadlineUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'dl-1' },
          data: expect.objectContaining({
            dueDate: expect.any(Date),
          }),
        }),
      );
    });

    it('uses business days for UR deadline types', async () => {
      mockDeadlineFindMany.mockResolvedValueOnce([
        { id: 'dl-ur', deadlineType: 'UR_PROSPECTIVE_5DAY', status: 'PENDING' },
      ]);
      mockDeadlineUpdate.mockResolvedValue({});

      const baseDate = new Date('2026-03-16'); // Monday
      await recalculateDeadlines('claim-1', baseDate);

      expect(mockDeadlineUpdate).toHaveBeenCalledOnce();
      const call = mockDeadlineUpdate.mock.calls[0] as [{ data: { dueDate: Date } }];
      const newDue = call[0].data.dueDate;
      // 5 business days from Monday March 16 = Monday March 23
      expect(newDue.getDate()).toBe(23);
      expect(newDue.getMonth()).toBe(2); // March
    });

    it('recalculates calendar day deadlines correctly', async () => {
      mockDeadlineFindMany.mockResolvedValueOnce([
        { id: 'dl-delay', deadlineType: 'DELAY_NOTICE_30DAY', status: 'PENDING' },
      ]);
      mockDeadlineUpdate.mockResolvedValue({});

      await recalculateDeadlines('claim-1', new Date('2026-03-01'));

      const call = mockDeadlineUpdate.mock.calls[0] as [{ data: { dueDate: Date } }];
      const newDue = call[0].data.dueDate;
      // 30 calendar days from March 1 = March 31
      expect(newDue.getDate()).toBe(31);
    });

    it('handles empty pending deadlines (no updates)', async () => {
      mockDeadlineFindMany.mockResolvedValueOnce([]);

      await recalculateDeadlines('claim-1', new Date('2026-03-01'));

      expect(mockDeadlineUpdate).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // addBusinessDays — additional edge cases
  // -------------------------------------------------------------------------

  describe('addBusinessDays — additional', () => {
    it('handles adding business days starting from a Saturday', () => {
      const saturday = new Date('2026-03-21'); // Saturday
      const result = addBusinessDays(saturday, 1);
      // Saturday -> skip to Monday March 23
      expect(result.getDate()).toBe(23);
    });

    it('handles adding business days starting from a Sunday', () => {
      const sunday = new Date('2026-03-22'); // Sunday
      const result = addBusinessDays(sunday, 1);
      // Sunday -> skip to Monday March 23
      expect(result.getDate()).toBe(23);
    });
  });
});
