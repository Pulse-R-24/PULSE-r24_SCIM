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
  | 'can_create_reports'
  | 'can_edit_reports'
  | 'can_publish_reports'
  | 'can_delete_reports'
  | 'can_submit_reports'
  | 'can_review_reports'
  | 'can_approve_reports'
  | 'can_archive_reports'

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  roles?: RoleName[]
}

export type WorkflowKey = 'DRAFT' | 'UNDER_REVIEW' | 'CHANGES_REQUESTED' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED'

export interface Report {
  id: string
  title: string
  slug: string
  body_markdown: string
  authorId?: string
  workflowStateKey: WorkflowKey
  created_at: string
  updated_at: string
  deleted_at?: string | null
  createdById?: string | null
  updatedById?: string | null
  lockedById?: string | null
  locked_at?: string | null
  author?: User | null
  comments?: ReviewComment[]
  assignments?: ReviewAssignment[]
  history?: WorkflowHistory[]
  evidence?: Evidence[]
}

export interface ReviewComment {
  id: string
  reportId: string
  authorId?: string | null
  author?: User | null
  body: string
  created_at: string
  updatedById?: string | null
  updated_at?: string
}

export interface ReviewAssignment {
  id: string
  reportId: string
  reviewerId: string
  reviewer?: User
  assigned_at: string
  completed_at?: string | null
  createdById?: string | null
  updatedById?: string | null
}

export interface WorkflowHistory {
  id: string
  reportId: string
  action: string
  actorId?: string | null
  actor?: User | null
  meta?: any
  created_at: string
}

export interface Media {
  id: string
  bucket: string
  path: string
  mime_type: string
  size: number
  uploadedById?: string | null
  created_at: string
}

export interface Evidence {
  id: string
  reportId: string
  mediaId?: string | null
  media?: Media | null
  title: string
  description?: string | null
  url?: string | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
  createdById?: string | null
  updatedById?: string | null
}

export interface Notification {
  id: string
  userId: string
  title: string
  body: string
  read: boolean
  type: string
  meta?: any
  created_at: string
  updated_at: string
}

export interface ActivityFeed {
  id: string
  actorId?: string | null
  actor?: User | null
  action: string
  entityType: string
  entityId?: string | null
  meta?: any
  created_at: string
}

