/**
 * Regulatory deadline auto-generator for new claims.
 *
 * When a claim is created, this service generates the initial set of
 * California Workers' Compensation regulatory deadlines based on the
 * date the claim was received by the claims administrator.
 *
 * All deadlines include their statutory authority citation for
 * Glass Box explainability.
 */

import type { PrismaClient, DeadlineType } from '@prisma/client';

interface DeadlineDefinition {
  deadlineType: DeadlineType;
  calendarDays: number;
  statutoryAuthority: string;
}

/**
 * Initial deadlines generated for every new claim at creation time.
 *
 * These represent the minimum statutory obligations a claims examiner
 * must satisfy upon receipt of a new workers' compensation claim.
 */
const INITIAL_DEADLINES: DeadlineDefinition[] = [
  {
    deadlineType: 'ACKNOWLEDGE_15DAY',
    calendarDays: 15,
    statutoryAuthority: '10 CCR 2695.5(b)',
  },
  {
    deadlineType: 'DETERMINE_40DAY',
    calendarDays: 40,
    statutoryAuthority: '10 CCR 2695.7(b)',
  },
  {
    deadlineType: 'TD_FIRST_14DAY',
    calendarDays: 14,
    statutoryAuthority: 'LC 4650',
  },
  {
    deadlineType: 'EMPLOYER_NOTIFY_15DAY',
    calendarDays: 15,
    statutoryAuthority: 'LC 3761',
  },
];

/**
 * Add `calendarDays` to a base date, returning a new Date.
 */
function addDays(base: Date, days: number): Date {
  const result = new Date(base.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Generate regulatory deadlines for a newly created claim.
 *
 * @param prisma - Prisma client instance (or transaction client)
 * @param claimId - ID of the newly created claim
 * @param dateReceived - Date the claim was received by the administrator
 */
export async function generateDeadlines(
  prisma: PrismaClient,
  claimId: string,
  dateReceived: Date,
): Promise<void> {
  const deadlineRecords = INITIAL_DEADLINES.map((def) => ({
    claimId,
    deadlineType: def.deadlineType,
    dueDate: addDays(dateReceived, def.calendarDays),
    statutoryAuthority: def.statutoryAuthority,
  }));

  await prisma.regulatoryDeadline.createMany({
    data: deadlineRecords,
  });
}
