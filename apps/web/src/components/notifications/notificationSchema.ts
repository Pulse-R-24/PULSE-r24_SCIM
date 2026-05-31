import { z } from 'zod'
import type { NotificationRecord } from '@/components/notifications/types'

export const notificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  body: z.string(),
  read: z.boolean(),
  type: z.string(),
  meta: z.object({
    reportId: z.string().optional(),
    evidenceId: z.string().optional(),
    sourceEvidenceId: z.string().optional(),
    actorId: z.string().optional(),
    actorName: z.string().optional(),
    actorEmail: z.string().optional(),
    status: z.string().optional(),
    comment: z.string().optional(),
  }).nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const notificationListSchema = z.array(notificationSchema)

export async function fetchNotifications() {
  const res = await fetch('/api/notifications', { cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to load notifications')
  }
  return notificationListSchema.parse(await res.json()) as NotificationRecord[]
}

export async function markNotificationRead(id: string) {
  const res = await fetch('/api/notifications', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to mark notification as read')
  }
  return res.json()
}

export async function markAllNotificationsRead() {
  const res = await fetch('/api/notifications', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ all: true }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to mark notifications as read')
  }
  return res.json()
}
