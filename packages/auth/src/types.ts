export enum RoleName {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  ANALYST = 'ANALYST',
  EDITOR = 'EDITOR',
  FACT_CHECKER = 'FACT_CHECKER',
  PUBLISHER = 'PUBLISHER',
  VIEWER = 'VIEWER'
}

export type PermissionName =
  | 'can_publish'
  | 'can_delete'
  | 'can_manage_users'
  | 'can_upload_media'
  | 'can_manage_settings'
  | 'can_view_analytics'
  | 'can_view_reports'
  | 'can_view_evidence'
  | 'can_upload_evidence'
  | 'can_delete_evidence'
  | 'can_create_reports'
  | 'can_edit_reports'
  | 'can_publish_reports'
  | 'can_delete_reports'
  | 'can_submit_reports'
  | 'can_review_reports'
  | 'can_approve_reports'
  | 'can_archive_reports'

export interface AuthUser {
  id: string
  email: string
  name?: string
  roles: RoleName[]
}

export interface AuthSession {
  user: AuthUser
  expires?: string
}
