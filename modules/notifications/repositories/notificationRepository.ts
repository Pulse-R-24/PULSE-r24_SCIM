import prisma from '@pulse-r24/database/src/client'

export async function createNotification(data: {
  userId: string
  title: string
  body: string
  type: string
  meta?: Record<string, unknown>
}) {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      title: data.title,
      body: data.body,
      type: data.type,
      meta: data.meta ? JSON.stringify(data.meta) : null
    }
  })
}

export async function findNotificationsByUser(userId: string) {
  const list = await prisma.notification.findMany({
    where: { userId },
    orderBy: { created_at: 'desc' }
  })
  
  return list.map(item => ({
    ...item,
    meta: item.meta ? JSON.parse(item.meta) : null
  }))
}

export async function updateNotificationRead(id: string, userId: string, read: boolean) {
  return prisma.notification.updateMany({
    where: { id, userId },
    data: { read }
  })
}

export async function markAllNotificationsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true }
  })
}
