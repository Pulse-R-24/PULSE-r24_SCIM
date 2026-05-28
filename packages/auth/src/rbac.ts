import { AuthSession, PermissionName, RoleName } from './types'

const rolePermissions: Record<RoleName, PermissionName[]> = {
  [RoleName.SUPER_ADMIN]: [
    'can_publish',
    'can_delete',
    'can_manage_users',
    'can_upload_media',
    'can_manage_settings',
    'can_view_analytics'
  ],
  [RoleName.ADMIN]: [
    'can_manage_users',
    'can_manage_settings',
    'can_view_analytics'
  ],
  [RoleName.ANALYST]: ['can_view_analytics'],
  [RoleName.EDITOR]: ['can_publish', 'can_upload_media'],
  [RoleName.FACT_CHECKER]: ['can_view_analytics'],
  [RoleName.PUBLISHER]: ['can_publish'],
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
