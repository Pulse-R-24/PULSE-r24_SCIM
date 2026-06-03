import type { AuthSession, PermissionName } from '@pulse-r24/auth'
import { hasPermission } from '@pulse-r24/auth'

export function getDisplayName(session: AuthSession | null) {
  return session?.user.name || session?.user.email || 'Staff user'
}

export function getInitials(session: AuthSession | null) {
  const source = getDisplayName(session)
  const parts = source.includes('@') ? source.split('@')[0].split(/[._-]/) : source.split(/\s+/)
  return parts
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'PR'
}

export function getPrimaryRole(session: AuthSession | null) {
  return session?.user.roles?.[0]
}

export function formatRole(role?: string) {
  if (!role) return 'STAFF'
  return role.replace(/_/g, ' ')
}

export const permissionSummary: Array<{ permission: PermissionName; label: string }> = [
  { permission: 'can_view_reports', label: 'View reports' },
  { permission: 'can_create_reports', label: 'Create reports' },
  { permission: 'can_edit_reports', label: 'Edit reports' },
  { permission: 'can_submit_reports', label: 'Submit reports' },
  { permission: 'can_review_reports', label: 'Review reports' },
  { permission: 'can_publish_reports', label: 'Publish reports' },
  { permission: 'can_archive_reports', label: 'Archive reports' },
  { permission: 'can_view_evidence', label: 'View evidence' },
  { permission: 'can_upload_evidence', label: 'Upload evidence' }
]

export function getSessionPermissions(session: AuthSession | null) {
  return permissionSummary.filter((item) => hasPermission(session, item.permission))
}
