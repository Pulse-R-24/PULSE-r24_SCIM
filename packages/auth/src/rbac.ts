import { AuthSession, PermissionName, RoleName } from './types'

const rolePermissions: Record<RoleName, PermissionName[]> = {
  [RoleName.SUPER_ADMIN]: [
    'can_publish',
    'can_delete',
    'can_manage_users',
    'can_upload_media',
    'can_manage_settings',
    'can_view_analytics',
    'can_create_reports',
    'can_edit_reports',
    'can_publish_reports',
    'can_delete_reports',
    'can_submit_reports',
    'can_review_reports',
    'can_approve_reports',
    'can_archive_reports'
  ],
  [RoleName.ADMIN]: [
    'can_manage_users',
    'can_manage_settings',
    'can_view_analytics',
    'can_create_reports',
    'can_edit_reports',
    'can_delete_reports',
    'can_submit_reports',
    'can_review_reports',
    'can_approve_reports',
    'can_archive_reports'
  ],
  [RoleName.ANALYST]: ['can_view_analytics'],
  [RoleName.EDITOR]: [
    'can_publish',
    'can_upload_media',
    'can_create_reports',
    'can_edit_reports',
    'can_submit_reports',
    'can_review_reports'
  ],
  [RoleName.FACT_CHECKER]: ['can_view_analytics'],
  [RoleName.PUBLISHER]: [
    'can_publish',
    'can_publish_reports',
    'can_archive_reports'
  ],
  [RoleName.VIEWER]: []
}

export function hasRole(session: AuthSession | null, role: RoleName) {
  return Boolean(session?.user?.roles?.includes(role))
}

export function hasAnyRole(session: AuthSession | null, roles: RoleName[]) {
  return Boolean(session?.user?.roles?.some((activeRole) => roles.includes(activeRole)))
}

export function hasPermission(session: AuthSession | null, permission: PermissionName) {
  if (!session?.user?.roles) return false
  return session.user.roles.some((role) => rolePermissions[role]?.includes(permission))
}

export function requireRole(session: AuthSession | null, role: RoleName) {
  if (!hasRole(session, role)) {
    throw new Error('Missing required role: ' + role)
  }
  return session
}

export function requirePermission(session: AuthSession | null, permission: PermissionName) {
  if (!hasPermission(session, permission)) {
    throw new Error('Missing required permission: ' + permission)
  }
  return session
}
