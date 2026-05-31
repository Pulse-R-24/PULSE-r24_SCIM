export type NotificationReadFilter = 'ALL' | 'UNREAD'

export type NotificationTypeFilter =
  | 'ALL'
  | 'ASSIGNMENT'
  | 'WORKFLOW_SUBMITTED'
  | 'WORKFLOW_STATE_CHANGE'
  | 'EVIDENCE_ATTACHED'
  | 'COMMENT'

export interface NotificationMeta {
  reportId?: string
  evidenceId?: string
  sourceEvidenceId?: string
  actorId?: string
  actorName?: string
  actorEmail?: string
  status?: string
  comment?: string
}

export interface NotificationRecord {
  id: string
  userId: string
  title: string
  body: string
  read: boolean
  type: string
  meta?: NotificationMeta | null
  created_at: string
  updated_at: string
}

export function getNotificationHref(notification: NotificationRecord) {
  const reportId = notification.meta?.reportId
  const evidenceId = notification.meta?.evidenceId

  if (evidenceId && reportId) return `/dashboard/reports/${reportId}/evidence`
  if (notification.type === 'ASSIGNMENT' && reportId) return `/dashboard/assigned-reviews`
  if (notification.type.startsWith('WORKFLOW') && reportId) return `/dashboard/workflow-history`
  if (reportId) return `/dashboard/reports/${reportId}/edit`
  return '/dashboard/notifications'
}
