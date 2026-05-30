export type AuditAction =
  | 'login'
  | 'logout'
  | 'report_create'
  | 'report_edit'
  | 'report_publish'
  | 'report_draft'
  | 'report_delete'
  | 'review_submit'
  | 'review_approve'
  | 'review_reject'
  | 'report_archive'
  | 'report_revision'
  | 'upload'
  | 'role_change'
  | 'settings_change'
  | 'ai_action'

export interface AuditMeta {
  [key: string]: unknown
}

export interface AuditEntry {
  actorId?: string
  action: AuditAction
  entity?: string
  entityId?: string
  meta?: AuditMeta
}
