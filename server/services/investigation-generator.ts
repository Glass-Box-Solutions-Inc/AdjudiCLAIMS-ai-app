/**
 * Investigation checklist auto-generator for new claims.
 *
 * When a claim is created, this service generates the standard
 * investigation checklist items that every claims examiner must
 * complete during the initial claim investigation.
 *
 * Items track three-point contact, document collection, and
 * initial reserve establishment.
 */

import type { PrismaClient, InvestigationItemType } from '@prisma/client';

/**
 * Standard investigation items generated for every new claim.
 *
 * These represent the minimum investigation activities required
 * for a newly received workers' compensation claim.
 */
const INITIAL_INVESTIGATION_ITEMS: InvestigationItemType[] = [
  'THREE_POINT_CONTACT_WORKER',
  'THREE_POINT_CONTACT_EMPLOYER',
  'THREE_POINT_CONTACT_PROVIDER',
  'RECORDED_STATEMENT',
  'EMPLOYER_REPORT',
  'MEDICAL_RECORDS',
  'DWC1_ON_FILE',
  'INDEX_BUREAU_CHECK',
  'AWE_VERIFIED',
  'INITIAL_RESERVES_SET',
];

/**
 * Generate investigation checklist items for a newly created claim.
 *
 * All items are created with `isComplete: false`. The examiner
 * marks them complete as the investigation progresses.
 *
 * @param prisma - Prisma client instance (or transaction client)
 * @param claimId - ID of the newly created claim
 */
export async function generateInvestigationItems(
  prisma: PrismaClient,
  claimId: string,
): Promise<void> {
  const itemRecords = INITIAL_INVESTIGATION_ITEMS.map((itemType) => ({
    claimId,
    itemType,
    isComplete: false,
  }));

  await prisma.investigationItem.createMany({
    data: itemRecords,
  });
}
