import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AdjudiCLAIMS database...');

  // --- Organization --------------------------------------------------------
  const org = await prisma.organization.upsert({
    where: { id: 'org_pacific_coast' },
    update: {},
    create: {
      id: 'org_pacific_coast',
      name: 'Pacific Coast Insurance',
      type: 'CARRIER',
    },
  });
  console.log(`  Organization: ${org.name}`);

  // --- Users ---------------------------------------------------------------
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pacificcoast.example.com' },
    update: {},
    create: {
      id: 'user_admin',
      email: 'admin@pacificcoast.example.com',
      name: 'Karen Mitchell',
      organizationId: org.id,
      role: 'CLAIMS_ADMIN',
    },
  });

  const supervisor = await prisma.user.upsert({
    where: { email: 'supervisor@pacificcoast.example.com' },
    update: {},
    create: {
      id: 'user_supervisor',
      email: 'supervisor@pacificcoast.example.com',
      name: 'David Chen',
      organizationId: org.id,
      role: 'CLAIMS_SUPERVISOR',
    },
  });

  const examiner = await prisma.user.upsert({
    where: { email: 'examiner@pacificcoast.example.com' },
    update: {},
    create: {
      id: 'user_examiner',
      email: 'examiner@pacificcoast.example.com',
      name: 'Sarah Johnson',
      organizationId: org.id,
      role: 'CLAIMS_EXAMINER',
    },
  });

  console.log(`  Users: ${admin.name} (admin), ${supervisor.name} (supervisor), ${examiner.name} (examiner)`);

  // --- Claims --------------------------------------------------------------
  const claim1 = await prisma.claim.upsert({
    where: { claimNumber: 'WC-2026-001' },
    update: {},
    create: {
      id: 'claim_001',
      claimNumber: 'WC-2026-001',
      organizationId: org.id,
      assignedExaminerId: examiner.id,
      claimantName: 'Maria Garcia',
      dateOfInjury: new Date('2026-01-15'),
      bodyParts: ['lumbar spine', 'left shoulder'],
      employer: 'Valley Construction Inc.',
      insurer: 'Pacific Coast Insurance',
      status: 'UNDER_INVESTIGATION',
      dateReceived: new Date('2026-01-20'),
      currentReserveIndemnity: 45000,
      currentReserveMedical: 25000,
    },
  });

  const claim2 = await prisma.claim.upsert({
    where: { claimNumber: 'WC-2026-002' },
    update: {},
    create: {
      id: 'claim_002',
      claimNumber: 'WC-2026-002',
      organizationId: org.id,
      assignedExaminerId: examiner.id,
      claimantName: 'James Wilson',
      dateOfInjury: new Date('2026-02-03'),
      bodyParts: ['right wrist', 'right hand'],
      employer: 'Pacific Warehouse Solutions',
      insurer: 'Pacific Coast Insurance',
      status: 'ACCEPTED',
      dateReceived: new Date('2026-02-05'),
      dateAcknowledged: new Date('2026-02-10'),
      dateDetermined: new Date('2026-03-01'),
      currentReserveIndemnity: 15000,
      currentReserveMedical: 8000,
    },
  });

  const claim3 = await prisma.claim.upsert({
    where: { claimNumber: 'WC-2026-003' },
    update: {},
    create: {
      id: 'claim_003',
      claimNumber: 'WC-2026-003',
      organizationId: org.id,
      assignedExaminerId: examiner.id,
      claimantName: 'Robert Kim',
      dateOfInjury: new Date('2025-11-20'),
      bodyParts: ['cervical spine', 'bilateral upper extremities'],
      employer: 'TechServe Corp.',
      insurer: 'Pacific Coast Insurance',
      status: 'OPEN',
      dateReceived: new Date('2026-03-10'),
      isCumulativeTrauma: true,
      hasApplicantAttorney: true,
      isLitigated: true,
      currentReserveIndemnity: 85000,
      currentReserveMedical: 40000,
      currentReserveLegal: 15000,
    },
  });

  console.log(`  Claims: ${claim1.claimNumber}, ${claim2.claimNumber}, ${claim3.claimNumber}`);

  // --- Education Profiles --------------------------------------------------
  await prisma.educationProfile.upsert({
    where: { userId: examiner.id },
    update: {},
    create: {
      userId: examiner.id,
      isTrainingComplete: false,
      dismissedTerms: [],
    },
  });

  console.log('  Education profiles created');

  // --- Regulatory Deadlines (for claim 1 — under investigation) -----------
  const claim1Deadlines = [
    {
      claimId: claim1.id,
      deadlineType: 'ACKNOWLEDGE_15DAY' as const,
      dueDate: new Date('2026-02-04'),
      status: 'PENDING' as const,
      statutoryAuthority: '10 CCR 2695.5(b)',
    },
    {
      claimId: claim1.id,
      deadlineType: 'DETERMINE_40DAY' as const,
      dueDate: new Date('2026-03-01'),
      status: 'PENDING' as const,
      statutoryAuthority: '10 CCR 2695.7(b)',
    },
    {
      claimId: claim1.id,
      deadlineType: 'TD_FIRST_14DAY' as const,
      dueDate: new Date('2026-01-29'),
      status: 'PENDING' as const,
      statutoryAuthority: 'LC 4650',
    },
  ];

  for (const deadline of claim1Deadlines) {
    await prisma.regulatoryDeadline.create({ data: deadline });
  }

  console.log(`  Deadlines: ${String(claim1Deadlines.length)} created for ${claim1.claimNumber}`);

  // --- Investigation Items (for claim 1) -----------------------------------
  const investigationTypes = [
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
  ] as const;

  for (const itemType of investigationTypes) {
    await prisma.investigationItem.create({
      data: {
        claimId: claim1.id,
        itemType,
        isComplete: itemType === 'INITIAL_RESERVES_SET',
        completedAt: itemType === 'INITIAL_RESERVES_SET' ? new Date() : null,
      },
    });
  }

  console.log(`  Investigation items: ${String(investigationTypes.length)} created for ${claim1.claimNumber}`);

  console.log('\nSeed complete.');
}

main()
  .catch((e: unknown) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
