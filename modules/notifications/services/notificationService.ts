import * as repo from '../repositories/notificationRepository'

export async function sendNotification(userId: string, title: string, body: string, type: string, meta?: Record<string, unknown>) {
  return repo.createNotification({ userId, title, body, type, meta })
}

export async function getUserNotifications(userId: string) {
  return repo.findNotificationsByUser(userId)
}

export async function markNotificationAsRead(id: string, userId: string) {
  return repo.updateNotificationRead(id, userId, true)
}

export async function markAllAsRead(userId: string) {
  return repo.markAllNotificationsRead(userId)
}
