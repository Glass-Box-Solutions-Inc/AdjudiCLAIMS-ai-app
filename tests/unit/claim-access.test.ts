import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Claim access verification tests.
 *
 * Tests the centralized claim access check used across documents,
 * deadlines, and investigation routes.
 */

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockClaimFindUnique = vi.fn();

vi.mock('../../server/db.js', () => ({
  prisma: {
    claim: {
      findUnique: (...args: unknown[]) => mockClaimFindUnique(...args) as unknown,
    },
  },
}));

// Dynamic import after mocks are in place
const { verifyClaimAccess } = await import('../../server/middleware/claim-access.js');
const { UserRole } = await import('../../server/middleware/rbac.js');

// ==========================================================================
// TESTS
// ==========================================================================

describe('verifyClaimAccess', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -----------------------------------------------------------------------
  // Claim does not exist
  // -----------------------------------------------------------------------

  it('returns unauthorized when claim does not exist', async () => {
    mockClaimFindUnique.mockResolvedValueOnce(null);

    const result = await verifyClaimAccess('claim-1', 'user-1', UserRole.CLAIMS_EXAMINER, 'org-1');

    expect(result.authorized).toBe(false);
    expect(result.claim).toBeNull();
  });

  // -----------------------------------------------------------------------
  // Organization mismatch
  // -----------------------------------------------------------------------

  it('returns unauthorized when claim belongs to different org', async () => {
    mockClaimFindUnique.mockResolvedValueOnce({
      id: 'claim-1',
      organizationId: 'org-2',
      assignedExaminerId: 'user-1',
    });

    const result = await verifyClaimAccess('claim-1', 'user-1', UserRole.CLAIMS_EXAMINER, 'org-1');

    expect(result.authorized).toBe(false);
    expect(result.claim).toBeNull();
  });

  // -----------------------------------------------------------------------
  // CLAIMS_EXAMINER role
  // -----------------------------------------------------------------------

  it('returns unauthorized for examiner not assigned to claim', async () => {
    mockClaimFindUnique.mockResolvedValueOnce({
      id: 'claim-1',
      organizationId: 'org-1',
      assignedExaminerId: 'user-2',
    });

    const result = await verifyClaimAccess('claim-1', 'user-1', UserRole.CLAIMS_EXAMINER, 'org-1');

    expect(result.authorized).toBe(false);
    expect(result.claim).not.toBeNull();
  });

  it('returns the claim object even when examiner is unauthorized', async () => {
    mockClaimFindUnique.mockResolvedValueOnce({
      id: 'claim-1',
      organizationId: 'org-1',
      assignedExaminerId: 'user-2',
    });

    const result = await verifyClaimAccess('claim-1', 'user-1', UserRole.CLAIMS_EXAMINER, 'org-1');

    expect(result.authorized).toBe(false);
    expect(result.claim).toEqual({
      id: 'claim-1',
      organizationId: 'org-1',
      assignedExaminerId: 'user-2',
    });
  });

  it('returns authorized for examiner assigned to claim', async () => {
    mockClaimFindUnique.mockResolvedValueOnce({
      id: 'claim-1',
      organizationId: 'org-1',
      assignedExaminerId: 'user-1',
    });

    const result = await verifyClaimAccess('claim-1', 'user-1', UserRole.CLAIMS_EXAMINER, 'org-1');

    expect(result.authorized).toBe(true);
    expect(result.claim).toEqual({
      id: 'claim-1',
      organizationId: 'org-1',
      assignedExaminerId: 'user-1',
    });
  });

  // -----------------------------------------------------------------------
  // CLAIMS_SUPERVISOR role
  // -----------------------------------------------------------------------

  it('returns authorized for supervisor in same org (any claim)', async () => {
    mockClaimFindUnique.mockResolvedValueOnce({
      id: 'claim-1',
      organizationId: 'org-1',
      assignedExaminerId: 'user-2',
    });

    const result = await verifyClaimAccess('claim-1', 'user-1', UserRole.CLAIMS_SUPERVISOR, 'org-1');

    expect(result.authorized).toBe(true);
  });

  it('returns claim object for supervisor', async () => {
    const claimData = {
      id: 'claim-1',
      organizationId: 'org-1',
      assignedExaminerId: 'user-99',
    };
    mockClaimFindUnique.mockResolvedValueOnce(claimData);

    const result = await verifyClaimAccess('claim-1', 'user-1', UserRole.CLAIMS_SUPERVISOR, 'org-1');

    expect(result.authorized).toBe(true);
    expect(result.claim).toEqual(claimData);
  });

  // -----------------------------------------------------------------------
  // CLAIMS_ADMIN role
  // -----------------------------------------------------------------------

  it('returns authorized for admin in same org (any claim)', async () => {
    mockClaimFindUnique.mockResolvedValueOnce({
      id: 'claim-1',
      organizationId: 'org-1',
      assignedExaminerId: 'user-2',
    });

    const result = await verifyClaimAccess('claim-1', 'user-1', UserRole.CLAIMS_ADMIN, 'org-1');

    expect(result.authorized).toBe(true);
  });

  // -----------------------------------------------------------------------
  // Supervisor and admin with org mismatch
  // -----------------------------------------------------------------------

  it('returns unauthorized for supervisor in different org', async () => {
    mockClaimFindUnique.mockResolvedValueOnce({
      id: 'claim-1',
      organizationId: 'org-2',
      assignedExaminerId: 'user-2',
    });

    const result = await verifyClaimAccess('claim-1', 'user-1', UserRole.CLAIMS_SUPERVISOR, 'org-1');

    expect(result.authorized).toBe(false);
    expect(result.claim).toBeNull();
  });

  it('returns unauthorized for admin in different org', async () => {
    mockClaimFindUnique.mockResolvedValueOnce({
      id: 'claim-1',
      organizationId: 'org-2',
      assignedExaminerId: 'user-2',
    });

    const result = await verifyClaimAccess('claim-1', 'user-1', UserRole.CLAIMS_ADMIN, 'org-1');

    expect(result.authorized).toBe(false);
    expect(result.claim).toBeNull();
  });

  // -----------------------------------------------------------------------
  // Prisma query verification
  // -----------------------------------------------------------------------

  it('queries prisma with correct claim ID', async () => {
    mockClaimFindUnique.mockResolvedValueOnce(null);

    await verifyClaimAccess('claim-42', 'user-1', UserRole.CLAIMS_EXAMINER, 'org-1');

    expect(mockClaimFindUnique).toHaveBeenCalledWith({
      where: { id: 'claim-42' },
      select: { id: true, organizationId: true, assignedExaminerId: true },
    });
  });

  it('calls prisma exactly once per invocation', async () => {
    mockClaimFindUnique.mockResolvedValueOnce({
      id: 'claim-1',
      organizationId: 'org-1',
      assignedExaminerId: 'user-1',
    });

    await verifyClaimAccess('claim-1', 'user-1', UserRole.CLAIMS_EXAMINER, 'org-1');

    expect(mockClaimFindUnique).toHaveBeenCalledOnce();
  });
});
