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
