import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const asDate = (value: string) => new Date(`${value}T00:00:00.000Z`);

const teamMembers = [
  {
    email: 'aleksa@ehestudio.local',
    fullName: 'Aleksa Studio',
    passwordHash: 'seeded-password-hash-1',
    preferredTaskType: 'ARCHITECTURE_ENGINEERING_DIRECTION',
    roleTitle: 'Studio Lead',
  },
  {
    email: 'mira@ehestudio.local',
    fullName: 'Mira Lawson',
    passwordHash: 'seeded-password-hash-2',
    preferredTaskType: 'DESIGN_DELIVERY_RESEARCH',
    roleTitle: 'Design Director',
  },
  {
    email: 'noah@ehestudio.local',
    fullName: 'Noah Patel',
    passwordHash: 'seeded-password-hash-3',
    preferredTaskType: 'DEVELOPMENT_TESTING',
    roleTitle: 'Creative Technologist',
  },
] as const;

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.authSession.deleteMany();
  await prisma.taskAssignment.deleteMany();
  await prisma.timeEntry.deleteMany();
  await prisma.task.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.project.deleteMany();
  await prisma.taskRate.deleteMany();
  await prisma.teamMember.deleteMany();

  const createdMembers = await Promise.all(
    teamMembers.map((member) =>
      prisma.teamMember.create({
        data: member,
      }),
    ),
  );

  const [studioLead, designDirector, creativeTechnologist] = createdMembers;

  const projects = await Promise.all([
    prisma.project.create({
      data: {
        budgetAmount: new Prisma.Decimal('24000.00'),
        budgetType: 'CAPPED',
        currencyCode: 'GBP',
        description: 'Launch operations tooling for the studio team.',
        endDate: asDate('2026-06-30'),
        name: 'EHEStudio Ops',
        startDate: asDate('2026-01-15'),
        status: 'ACTIVE',
      },
    }),
    prisma.project.create({
      data: {
        budgetAmount: new Prisma.Decimal('18000.00'),
        budgetType: 'TRACKED_ONLY',
        currencyCode: 'GBP',
        description: 'Internal process redesign and reporting improvements.',
        endDate: asDate('2026-08-15'),
        name: 'Studio Systems Refresh',
        startDate: asDate('2026-02-01'),
        status: 'ACTIVE',
      },
    }),
  ]);

  const [opsProject, systemsProject] = projects;

  const milestones = await Promise.all([
    prisma.milestone.create({
      data: {
        dueDate: asDate('2026-02-28'),
        name: 'Foundation locked',
        projectId: opsProject.id,
      },
    }),
    prisma.milestone.create({
      data: {
        dueDate: asDate('2026-03-21'),
        name: 'Time logging rollout',
        projectId: opsProject.id,
      },
    }),
    prisma.milestone.create({
      data: {
        dueDate: asDate('2026-05-12'),
        name: 'Commercial release',
        projectId: opsProject.id,
      },
    }),
    prisma.milestone.create({
      data: {
        dueDate: asDate('2026-02-20'),
        name: 'Audit baseline',
        projectId: systemsProject.id,
      },
    }),
    prisma.milestone.create({
      data: {
        dueDate: asDate('2026-03-28'),
        name: 'Standup redesign',
        projectId: systemsProject.id,
      },
    }),
    prisma.milestone.create({
      data: {
        dueDate: asDate('2026-06-10'),
        name: 'Deployment readiness',
        projectId: systemsProject.id,
      },
    }),
  ]);

  const [
    opsPastMilestone,
    opsNearMilestone,
    opsFarMilestone,
    systemsPastMilestone,
    systemsNearMilestone,
    systemsFarMilestone,
  ] = milestones;

  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        description: 'Model task rate continuity rules in the service layer',
        milestoneId: opsPastMilestone.id,
        projectId: opsProject.id,
        status: 'DONE',
        startedAt: new Date('2026-02-10T09:00:00.000Z'),
        completedAt: new Date('2026-02-12T17:30:00.000Z'),
      },
    }),
    prisma.task.create({
      data: {
        description: 'Design quick-entry flow for daily studio logging',
        milestoneId: opsNearMilestone.id,
        projectId: opsProject.id,
        status: 'IN_PROGRESS',
        startedAt: new Date('2026-03-07T09:30:00.000Z'),
      },
    }),
    prisma.task.create({
      data: {
        description: 'Add mobile weekly-grid interaction patterns',
        milestoneId: opsFarMilestone.id,
        projectId: opsProject.id,
        status: 'TODO',
      },
    }),
    prisma.task.create({
      data: {
        description: 'Prepare audit log filters for actor and date range',
        milestoneId: systemsPastMilestone.id,
        projectId: systemsProject.id,
        status: 'DONE',
        startedAt: new Date('2026-02-14T10:00:00.000Z'),
        completedAt: new Date('2026-02-19T16:00:00.000Z'),
      },
    }),
    prisma.task.create({
      data: {
        description: 'Prototype people-grouped standup board',
        milestoneId: systemsNearMilestone.id,
        projectId: systemsProject.id,
        status: 'IN_PROGRESS',
        startedAt: new Date('2026-03-05T11:00:00.000Z'),
      },
    }),
    prisma.task.create({
      data: {
        description: 'Document deployment secrets checklist',
        milestoneId: systemsFarMilestone.id,
        projectId: systemsProject.id,
        status: 'TODO',
      },
    }),
  ]);

  await prisma.taskAssignment.createMany({
    data: [
      { taskId: tasks[0].id, teamMemberId: studioLead.id },
      { taskId: tasks[1].id, teamMemberId: studioLead.id },
      { taskId: tasks[1].id, teamMemberId: designDirector.id },
      { taskId: tasks[2].id, teamMemberId: creativeTechnologist.id },
      { taskId: tasks[3].id, teamMemberId: designDirector.id },
      { taskId: tasks[4].id, teamMemberId: designDirector.id },
      { taskId: tasks[4].id, teamMemberId: creativeTechnologist.id },
    ],
  });

  const rateHistory = [
    ['ARCHITECTURE_ENGINEERING_DIRECTION', '950.00', '2024-01-01', '2025-12-31'],
    ['ARCHITECTURE_ENGINEERING_DIRECTION', '1050.00', '2026-01-01', null],
    ['DESIGN_DELIVERY_RESEARCH', '780.00', '2024-01-01', '2025-12-31'],
    ['DESIGN_DELIVERY_RESEARCH', '860.00', '2026-01-01', null],
    ['DEVELOPMENT_TESTING', '720.00', '2024-01-01', '2025-12-31'],
    ['DEVELOPMENT_TESTING', '800.00', '2026-01-01', null],
    ['BUSINESS_SUPPORT', '500.00', '2024-01-01', '2025-12-31'],
    ['BUSINESS_SUPPORT', '560.00', '2026-01-01', null],
  ] as const;

  await prisma.taskRate.createMany({
    data: rateHistory.map(([taskType, dayRate, effectiveFrom, effectiveTo]) => ({
      currencyCode: 'GBP',
      dayRate: new Prisma.Decimal(dayRate),
      effectiveFrom: asDate(effectiveFrom),
      effectiveTo: effectiveTo ? asDate(effectiveTo) : null,
      taskType,
    })),
  });

  await prisma.timeEntry.createMany({
    data: [
      {
        date: asDate('2026-03-10'),
        hoursWorked: new Prisma.Decimal('4.00'),
        notes: 'Reviewed task rate continuity rules.',
        projectId: opsProject.id,
        taskType: 'ARCHITECTURE_ENGINEERING_DIRECTION',
        teamMemberId: studioLead.id,
      },
      {
        date: asDate('2026-03-10'),
        hoursWorked: new Prisma.Decimal('3.50'),
        notes: 'Mapped quick-entry interactions.',
        projectId: opsProject.id,
        taskType: 'DESIGN_DELIVERY_RESEARCH',
        teamMemberId: designDirector.id,
      },
      {
        date: asDate('2026-03-11'),
        hoursWorked: new Prisma.Decimal('5.00'),
        notes: 'Stitched people-grouped standup concepts.',
        projectId: systemsProject.id,
        taskType: 'DEVELOPMENT_TESTING',
        teamMemberId: creativeTechnologist.id,
      },
      {
        date: asDate('2026-03-11'),
        hoursWorked: new Prisma.Decimal('2.50'),
        notes: 'Prepared audit log filter notes.',
        projectId: systemsProject.id,
        taskType: 'BUSINESS_SUPPORT',
        teamMemberId: designDirector.id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error('Seed failed', error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });

