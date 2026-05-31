export type ActivityTypeFilter =
  | 'ALL'
  | 'report_created'
  | 'report_updated'
  | 'report_submitted'
  | 'report_changes_requested'
  | 'report_approved'
  | 'report_rejected'
  | 'report_published'
  | 'report_archived'
  | 'evidence_uploaded'
  | 'evidence_attached'
  | 'review_comment_added'

export interface ActivityMeta {
  title?: string
  reportTitle?: string
  status?: string
  previousStatus?: string
  comment?: string
  reportId?: string
  evidenceId?: string
  mediaId?: string
}

export interface ActivityRecord {
  id: string
  actorId?: string | null
  actor?: { name?: string | null; email: string } | null
  action: string
  entityType: string
  entityId?: string | null
  meta?: ActivityMeta | null
  created_at: string
}

export function getActivityHref(activity: ActivityRecord) {
  if (activity.action.startsWith('evidence') && activity.entityType === 'REPORT' && activity.entityId) {
    return `/dashboard/reports/${activity.entityId}/evidence`
  }
  if (activity.entityType === 'REPORT' && activity.entityId) {
    return `/dashboard/reports/${activity.entityId}/edit`
  }
  if (activity.entityType === 'EVIDENCE' && activity.meta?.reportId) {
    return `/dashboard/reports/${activity.meta.reportId}/evidence`
  }
  return '/dashboard/activity'
}
