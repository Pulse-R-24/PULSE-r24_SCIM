export type WorkflowStatusFilter =
  | 'ALL'
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'ARCHIVED'

export type WorkflowActionFilter =
  | 'ALL'
  | 'DRAFT_CREATED'
  | 'SUBMIT_FOR_REVIEW'
  | 'REQUEST_CHANGES'
  | 'APPROVE'
  | 'REJECT'
  | 'PUBLISH'
  | 'ARCHIVE'

export interface WorkflowHistoryMeta {
  comment?: string
  previousStatus?: string
  nextStatus?: string
}

export interface WorkflowHistoryRecord {
  id: string
  reportId: string
  action: string
  actorId?: string | null
  actor?: { name?: string | null; email: string } | null
  report: {
    id: string
    title: string
    status?: { key: string; label?: string | null } | null
    author?: { name?: string | null; email: string } | null
  }
  meta?: string | WorkflowHistoryMeta | null
  created_at: string
}
