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

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  roles?: RoleName[]
}

export type WorkflowKey = 'DRAFT' | 'UNDER_REVIEW' | 'PUBLISHED'

export interface Report {
  id: string
  title: string
  slug: string
  body_markdown: string
  authorId?: string
  workflowStateKey: WorkflowKey
  created_at: string
  updated_at: string
}

export interface Media {
  id: string
  bucket: string
  path: string
  mime_type: string
  size: number
  uploadedById?: string
  created_at: string
}
