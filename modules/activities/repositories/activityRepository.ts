import prisma from '@pulse-r24/database/src/client'

export async function createActivityRecord(data: {
  actorId?: string
  action: string
  entityType: string
  entityId?: string
  meta?: any
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

export async function findActivityFeed(opts?: { take?: number; skip?: number }) {
  const list = await prisma.activityFeed.findMany({
    take: opts?.take ?? 20,
    skip: opts?.skip ?? 0,
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
