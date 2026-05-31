import prisma from '@pulse-r24/database/src/client'

export interface ActivityFeedFilters {
  action?: string
  actorId?: string
  entityType?: string
  entityId?: string
  search?: string
  take?: number
  skip?: number
}

export async function createActivityRecord(data: {
  actorId?: string
  action: string
  entityType: string
  entityId?: string
  meta?: Record<string, unknown>
}) {
  return prisma.activityFeed.create({
    data: {
      actorId: data.actorId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      meta: data.meta ? JSON.stringify(data.meta) : null
    }
  })
}

export async function findActivityFeed(opts: ActivityFeedFilters = {}) {
  const search = opts.search?.trim()
  const [matchingUsers, matchingReports, matchingEvidence] = search
    ? await Promise.all([
        prisma.user.findMany({
          where: {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } }
            ]
          },
          select: { id: true }
        }),
        prisma.report.findMany({
          where: { title: { contains: search }, deleted_at: null },
          select: { id: true }
        }),
        prisma.evidence.findMany({
          where: {
            deleted_at: null,
            OR: [
              { title: { contains: search } },
              { description: { contains: search } },
              { url: { contains: search } }
            ]
          },
          select: { id: true, reportId: true }
        })
      ])
    : [[], [], []]

  const matchingEntityIds = [
    ...matchingReports.map((item) => item.id),
    ...matchingEvidence.map((item) => item.id),
    ...matchingEvidence.map((item) => item.reportId)
  ]

  const list = await prisma.activityFeed.findMany({
    take: opts?.take ?? 20,
    skip: opts?.skip ?? 0,
    where: {
      ...(opts.action ? { action: opts.action } : {}),
      ...(opts.actorId ? { actorId: opts.actorId } : {}),
      ...(opts.entityType ? { entityType: opts.entityType } : {}),
      ...(opts.entityId ? { entityId: opts.entityId } : {}),
      ...(search
        ? {
            OR: [
              { action: { contains: search } },
              { entityType: { contains: search } },
              { entityId: { in: matchingEntityIds } },
              { actorId: { in: matchingUsers.map((item) => item.id) } },
              { meta: { contains: search } }
            ]
          }
        : {})
    },
    orderBy: { created_at: 'desc' },
    include: {
      actor: true
    }
  })
  
  return list.map(item => ({
    ...item,
    meta: item.meta ? JSON.parse(item.meta) : null
  }))
}
