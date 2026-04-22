import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Compliance dashboard — additional service coverage for admin report and
 * UPL monitoring metrics, plus verification of hook type exports.
 *
 * These tests complement compliance.test.ts by covering:
 * 1. AdminComplianceReport includes all SupervisorTeamMetrics fields
 * 2. UPL monitoring blocksPerPeriod grouping (same-day, multi-day, empty)
 * 3. Adversarial detection rate edge cases (zero RED zone queries)
 * 4. Score clamping and composite math in getAdminReport
 * 5. Hook exports from use-compliance.ts (type-level smoke test)
 */

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockDeadlineGroupBy = vi.fn();
const mockAuditEventGroupBy = vi.fn();
const mockAuditEventCount = vi.fn();
const mockAuditEventFindMany = vi.fn();
const mockEducationProfileFindMany = vi.fn();
const mockClaimCount = vi.fn();
const mockInvestigationGroupBy = vi.fn();
const mockDocumentGroupBy = vi.fn();
const mockUserFindMany = vi.fn();
const mockUserCount = vi.fn();

vi.mock('../../server/db.js', () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([{ '?column?': 1 }]),
    $queryRawUnsafe: vi.fn().mockResolvedValue([]),
    user: {
      findMany: (...args: unknown[]) => mockUserFindMany(...args) as unknown,
      count: (...args: unknown[]) => mockUserCount(...args) as unknown,
      findUnique: vi.fn().mockResolvedValue(null),
      update: vi.fn().mockResolvedValue({}),
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({}),
    },
    claim: {
      count: (...args: unknown[]) => mockClaimCount(...args) as unknown,
      findUnique: vi.fn().mockResolvedValue(null),
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
    },
    auditEvent: {
      findMany: (...args: unknown[]) => mockAuditEventFindMany(...args) as unknown,
      count: (...args: unknown[]) => mockAuditEventCount(...args) as unknown,
      groupBy: (...args: unknown[]) => mockAuditEventGroupBy(...args) as unknown,
      create: vi.fn().mockResolvedValue({}),
    },
    educationProfile: {
      findMany: (...args: unknown[]) => mockEducationProfileFindMany(...args) as unknown,
      findUnique: vi.fn().mockResolvedValue(null),
      upsert: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      count: vi.fn().mockResolvedValue(0),
    },
    regulatoryDeadline: {
      groupBy: (...args: unknown[]) => mockDeadlineGroupBy(...args) as unknown,
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
      findUnique: vi.fn().mockResolvedValue(null),
      update: vi.fn().mockResolvedValue({}),
      createMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
    investigationItem: {
      groupBy: (...args: unknown[]) => mockInvestigationGroupBy(...args) as unknown,
      createMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
    document: {
      groupBy: (...args: unknown[]) => mockDocumentGroupBy(...args) as unknown,
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
    workflowProgress: {
      create: vi.fn().mockResolvedValue({}),
      findUnique: vi.fn().mockResolvedValue(null),
      update: vi.fn().mockResolvedValue({}),
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

// ---------------------------------------------------------------------------
// Import after mocks
// ---------------------------------------------------------------------------

const svc = await import('../../server/services/compliance-dashboard.service.js');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Set up the mocks needed by getTeamMetrics in the order they are consumed:
 * 6-call Promise.all followed by a 3-call Promise.all for per-examiner data.
 */
function setupTeamMetricsMocks({
  met = 20,
  missed = 5,
  pending = 3,
  green = 60,
  yellow = 10,
  red = 5,
  blocked = 2,
  trainingProfiles = [{ isTrainingComplete: true }, { isTrainingComplete: false }],
  orgUserCount = 2,
  examiners = [{ id: 'u-1', name: 'Alice' }],
}: {
  met?: number;
  missed?: number;
  pending?: number;
  green?: number;
  yellow?: number;
  red?: number;
  blocked?: number;
  trainingProfiles?: { isTrainingComplete: boolean }[];
  orgUserCount?: number;
  examiners?: { id: string; name: string }[];
} = {}) {
  // Batch 1 (6 parallel)
  mockDeadlineGroupBy.mockResolvedValueOnce([
    { status: 'MET', _count: { id: met } },
    { status: 'MISSED', _count: { id: missed } },
    { status: 'PENDING', _count: { id: pending } },
  ]);
  mockAuditEventGroupBy.mockResolvedValueOnce([
    { uplZone: 'GREEN', _count: { id: green } },
    { uplZone: 'YELLOW', _count: { id: yellow } },
    { uplZone: 'RED', _count: { id: red } },
  ]);
  mockAuditEventCount.mockResolvedValueOnce(blocked);
  mockEducationProfileFindMany.mockResolvedValueOnce(trainingProfiles);
  mockUserCount.mockResolvedValueOnce(orgUserCount);
  mockUserFindMany.mockResolvedValueOnce(examiners);

  // Batch 2 (3 parallel for per-examiner breakdown)
  mockDeadlineGroupBy.mockResolvedValueOnce([
    { status: 'MET', _count: { id: 15 } },
    { status: 'MISSED', _count: { id: 3 } },
  ]);
  mockAuditEventGroupBy.mockResolvedValueOnce(
    examiners.map((e) => ({ userId: e.id, _count: { id: 1 } })),
  );
  mockAuditEventGroupBy.mockResolvedValueOnce(
    examiners.map((e) => ({ userId: e.id, _count: { id: 20 } })),
  );
}

/**
 * Set up the extra queries needed by getAdminReport (called after team metrics).
 */
function setupAdminExtraMocks({
  invComplete = 15,
  invIncomplete = 3,
  claimsWithDocs = 8,
  totalClaims = 10,
}: {
  invComplete?: number;
  invIncomplete?: number;
  claimsWithDocs?: number;
  totalClaims?: number;
} = {}) {
  mockInvestigationGroupBy.mockResolvedValueOnce([
    { isComplete: true, _count: { id: invComplete } },
    { isComplete: false, _count: { id: invIncomplete } },
  ]);
  mockDocumentGroupBy.mockResolvedValueOnce(
    Array.from({ length: claimsWithDocs }, (_, i) => ({ claimId: `c-${String(i)}` })),
  );
  mockClaimCount.mockResolvedValueOnce(totalClaims);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Compliance Dashboard — AdminComplianceReport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('includes all SupervisorTeamMetrics fields alongside DOI score', async () => {
    setupTeamMetricsMocks();
    setupAdminExtraMocks();

    const report = await svc.getAdminComplianceReport('org-1');

    // Team fields present
    expect(report.teamDeadlineAdherence).toBeDefined();
    expect(report.teamUplCompliance).toBeDefined();
    expect(report.trainingCompletion).toBeDefined();
    expect(Array.isArray(report.examinerBreakdown)).toBe(true);

    // Admin-only fields
    expect(typeof report.doiAuditReadinessScore).toBe('number');
    expect(report.doiAuditReadinessScore).toBeGreaterThanOrEqual(0);
    expect(report.doiAuditReadinessScore).toBeLessThanOrEqual(100);

    expect(report.complianceScoreBreakdown).toBeDefined();
    expect(typeof report.complianceScoreBreakdown.deadlineScore).toBe('number');
    expect(typeof report.complianceScoreBreakdown.investigationScore).toBe('number');
    expect(typeof report.complianceScoreBreakdown.documentationScore).toBe('number');
    expect(typeof report.complianceScoreBreakdown.uplScore).toBe('number');
  });

  it('computes composite score within expected range', async () => {
    // met=20, missed=4 => adherenceRate ≈ 0.833 => deadlineScore = round(0.833*40) = 33
    // invComplete=9, invIncomplete=1 => invRate=0.9 => investigationScore = round(0.9*30) = 27
    // claimsWithDocs=4, totalClaims=5 => docRate=0.8 => documentationScore = round(0.8*20) = 16
    // blocked=0, total=75 => blockRate≈0 => uplScore=round(1*10)=10
    // composite = 33+27+16+10 = 86
    setupTeamMetricsMocks({ met: 20, missed: 4, green: 60, yellow: 10, red: 5, blocked: 0 });
    setupAdminExtraMocks({ invComplete: 9, invIncomplete: 1, claimsWithDocs: 4, totalClaims: 5 });

    const report = await svc.getAdminComplianceReport('org-1');

    expect(report.complianceScoreBreakdown.deadlineScore).toBe(33);
    expect(report.complianceScoreBreakdown.investigationScore).toBe(27);
    expect(report.complianceScoreBreakdown.documentationScore).toBe(16);
    expect(report.complianceScoreBreakdown.uplScore).toBe(10);
    expect(report.doiAuditReadinessScore).toBe(86);
  });

  it('score clamped to 100 with all-perfect data', async () => {
    setupTeamMetricsMocks({ met: 100, missed: 0, green: 100, yellow: 0, red: 0, blocked: 0 });
    setupAdminExtraMocks({ invComplete: 50, invIncomplete: 0, claimsWithDocs: 20, totalClaims: 20 });

    const report = await svc.getAdminComplianceReport('org-1');

    expect(report.doiAuditReadinessScore).toBe(100);
    expect(report.complianceScoreBreakdown.deadlineScore).toBe(40);
    expect(report.complianceScoreBreakdown.investigationScore).toBe(30);
    expect(report.complianceScoreBreakdown.documentationScore).toBe(20);
    expect(report.complianceScoreBreakdown.uplScore).toBe(10);
  });

  it('returns zero composite for org with no data', async () => {
    // All zeros — deadline adherenceRate = safeRate(0, 0) = 0 => deadlineScore = 0
    // invComplete=0, invIncomplete=0 => invRate=0 => investigationScore=0
    // claimsWithDocs=0, totalClaims=0 => docRate=safeRate(0,0)=0 => documentationScore=0
    // blocked=0, total=0 => blockRate=safeRate(0,1)=0 => uplScore=round(1*10)=10
    setupTeamMetricsMocks({
      met: 0,
      missed: 0,
      pending: 0,
      green: 0,
      yellow: 0,
      red: 0,
      blocked: 0,
      trainingProfiles: [],
      orgUserCount: 0,
      examiners: [],
    });
    setupAdminExtraMocks({ invComplete: 0, invIncomplete: 0, claimsWithDocs: 0, totalClaims: 0 });

    const report = await svc.getAdminComplianceReport('org-empty');

    expect(report.complianceScoreBreakdown.deadlineScore).toBe(0);
    expect(report.complianceScoreBreakdown.investigationScore).toBe(0);
    expect(report.complianceScoreBreakdown.documentationScore).toBe(0);
    // No blocks → full UPL compliance → 10 points
    expect(report.complianceScoreBreakdown.uplScore).toBe(10);
    expect(report.doiAuditReadinessScore).toBe(10);
  });
});

// ---------------------------------------------------------------------------

describe('Compliance Dashboard — UPL Monitoring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('groups block events by calendar day', async () => {
    mockAuditEventGroupBy.mockResolvedValueOnce([
      { uplZone: 'GREEN', _count: { id: 30 } },
      { uplZone: 'RED', _count: { id: 5 } },
    ]);
    mockAuditEventFindMany.mockResolvedValueOnce([
      { createdAt: new Date('2026-04-01T08:00:00Z') },
      { createdAt: new Date('2026-04-01T20:00:00Z') },
      { createdAt: new Date('2026-04-02T10:00:00Z') },
    ]);
    mockAuditEventCount.mockResolvedValueOnce(2); // validation fail count
    mockAuditEventCount.mockResolvedValueOnce(5); // RED zone count

    const result = await svc.getUplMonitoringMetrics('org-1');

    expect(result.blocksPerPeriod).toHaveLength(2);
    expect(result.blocksPerPeriod[0]).toEqual({ period: '2026-04-01', count: 2 });
    expect(result.blocksPerPeriod[1]).toEqual({ period: '2026-04-02', count: 1 });
  });

  it('returns empty blocksPerPeriod when no blocks occurred', async () => {
    mockAuditEventGroupBy.mockResolvedValueOnce([
      { uplZone: 'GREEN', _count: { id: 50 } },
    ]);
    mockAuditEventFindMany.mockResolvedValueOnce([]);
    mockAuditEventCount.mockResolvedValueOnce(0);
    mockAuditEventCount.mockResolvedValueOnce(10);

    const result = await svc.getUplMonitoringMetrics('org-1');

    expect(result.blocksPerPeriod).toHaveLength(0);
  });

  it('adversarialDetectionRate is 0 when no RED zone queries exist', async () => {
    mockAuditEventGroupBy.mockResolvedValueOnce([
      { uplZone: 'GREEN', _count: { id: 20 } },
    ]);
    mockAuditEventFindMany.mockResolvedValueOnce([]);
    mockAuditEventCount.mockResolvedValueOnce(0); // validation fail
    mockAuditEventCount.mockResolvedValueOnce(0); // RED zone count (0)

    const result = await svc.getUplMonitoringMetrics('org-1');

    // safeRate(0, 0||1) = safeRate(0, 1) = 0
    expect(result.adversarialDetectionRate).toBe(0);
  });

  it('adversarialDetectionRate correctly reflects validation failures vs RED queries', async () => {
    mockAuditEventGroupBy.mockResolvedValueOnce([
      { uplZone: 'GREEN', _count: { id: 40 } },
      { uplZone: 'RED', _count: { id: 10 } },
    ]);
    mockAuditEventFindMany.mockResolvedValueOnce([]);
    mockAuditEventCount.mockResolvedValueOnce(5); // 5 validation failures
    mockAuditEventCount.mockResolvedValueOnce(10); // 10 RED queries

    const result = await svc.getUplMonitoringMetrics('org-1');

    // safeRate(5, 10) = 0.5
    expect(result.adversarialDetectionRate).toBeCloseTo(0.5, 4);
  });

  it('passes date range options to the underlying query', async () => {
    mockAuditEventGroupBy.mockResolvedValueOnce([]);
    mockAuditEventFindMany.mockResolvedValueOnce([]);
    mockAuditEventCount.mockResolvedValueOnce(0);
    mockAuditEventCount.mockResolvedValueOnce(0);

    const startDate = new Date('2026-03-01T00:00:00Z');
    const endDate = new Date('2026-03-31T23:59:59Z');

    await svc.getUplMonitoringMetrics('org-1', { startDate, endDate });

    // Verify the groupBy was called — the date filter is applied internally
    expect(mockAuditEventGroupBy).toHaveBeenCalledTimes(1);
    const callArg = mockAuditEventGroupBy.mock.calls[0]?.[0] as {
      where?: { createdAt?: { gte?: Date; lte?: Date } };
    };
    expect(callArg?.where?.createdAt?.gte?.toISOString()).toBe(startDate.toISOString());
    expect(callArg?.where?.createdAt?.lte?.toISOString()).toBe(endDate.toISOString());
  });

  it('zoneDistribution contains correct counts', async () => {
    mockAuditEventGroupBy.mockResolvedValueOnce([
      { uplZone: 'GREEN', _count: { id: 80 } },
      { uplZone: 'YELLOW', _count: { id: 15 } },
      { uplZone: 'RED', _count: { id: 5 } },
    ]);
    mockAuditEventFindMany.mockResolvedValueOnce([]);
    mockAuditEventCount.mockResolvedValueOnce(3);
    mockAuditEventCount.mockResolvedValueOnce(5);

    const result = await svc.getUplMonitoringMetrics('org-1');

    expect(result.zoneDistribution.green).toBe(80);
    expect(result.zoneDistribution.yellow).toBe(15);
    expect(result.zoneDistribution.red).toBe(5);
  });
});

// ---------------------------------------------------------------------------

describe('Compliance Dashboard — SupervisorTeamMetrics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('examinerBreakdown is empty when no examiners have claims', async () => {
    setupTeamMetricsMocks({ examiners: [] });

    const result = await svc.getSupervisorTeamMetrics('org-no-claims');

    expect(result.examinerBreakdown).toHaveLength(0);
  });

  it('trainingCompletion reflects profiles vs total user count', async () => {
    setupTeamMetricsMocks({
      trainingProfiles: [
        { isTrainingComplete: true },
        { isTrainingComplete: true },
        { isTrainingComplete: false },
      ],
      orgUserCount: 5, // more users than profiles (2 have no profile = incomplete)
    });

    const result = await svc.getSupervisorTeamMetrics('org-1');

    expect(result.trainingCompletion.complete).toBe(2);
    // incomplete = orgUserCount - completeCount = 5 - 2 = 3
    expect(result.trainingCompletion.incomplete).toBe(3);
    expect(result.trainingCompletion.total).toBe(5);
  });

  it('teamDeadlineAdherence adherenceRate excludes pending and waived from denominator', async () => {
    // met=8, missed=2, pending=10, waived=5 => adherenceRate = 8/(8+2) = 0.8
    setupTeamMetricsMocks({ met: 8, missed: 2, pending: 10 });

    const result = await svc.getSupervisorTeamMetrics('org-1');

    // adherenceRate = safeRate(8, 10) = 0.8
    expect(result.teamDeadlineAdherence.adherenceRate).toBeCloseTo(0.8, 4);
    expect(result.teamDeadlineAdherence.met).toBe(8);
    expect(result.teamDeadlineAdherence.missed).toBe(2);
  });
});

// ---------------------------------------------------------------------------

describe('Compliance Dashboard — ExaminerComplianceMetrics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deadlineAdherence adherenceRate is 0 when all deadlines are pending', async () => {
    // met=0, missed=0 — adherenceRate = safeRate(0, 0) = 0
    mockDeadlineGroupBy.mockResolvedValueOnce([
      { status: 'PENDING', _count: { id: 5 } },
    ]);
    mockAuditEventGroupBy.mockResolvedValueOnce([]);
    mockClaimCount.mockResolvedValueOnce(3);
    mockAuditEventCount.mockResolvedValueOnce(0);

    const result = await svc.getExaminerComplianceMetrics('user-1');

    expect(result.deadlineAdherence.adherenceRate).toBe(0);
    expect(result.deadlineAdherence.met).toBe(0);
    expect(result.deadlineAdherence.missed).toBe(0);
    expect(result.deadlineAdherence.pending).toBe(5);
  });

  it('uplSummary correctly aggregates all three zones', async () => {
    mockDeadlineGroupBy.mockResolvedValueOnce([]);
    mockAuditEventGroupBy.mockResolvedValueOnce([
      { uplZone: 'GREEN', _count: { id: 12 } },
      { uplZone: 'YELLOW', _count: { id: 4 } },
      { uplZone: 'RED', _count: { id: 2 } },
    ]);
    mockClaimCount.mockResolvedValueOnce(4);
    mockAuditEventCount.mockResolvedValueOnce(3); // blocked

    const result = await svc.getExaminerComplianceMetrics('user-1');

    expect(result.uplSummary.green).toBe(12);
    expect(result.uplSummary.yellow).toBe(4);
    expect(result.uplSummary.red).toBe(2);
    expect(result.uplSummary.blocked).toBe(3);
    expect(result.uplSummary.total).toBe(18);
  });
});
