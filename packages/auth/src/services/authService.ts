import { hash } from 'bcryptjs'
import { RoleName, PermissionName } from '../types'
import {
  assignPermissionToRole,
  createPermission,
  createRole,
  findRoleByName
} from '../repositories/roleRepository'
import {
  assignRoleToUser,
  createUser,
  findUserByEmail,
  findUserByIdWithRoles
} from '../repositories/userRepository'

export async function bootstrapSuperAdmin(options: {
  email: string
  password: string
  name?: string
}) {
  const normalizedEmail = options.email.toLowerCase()
  const existing = await findUserByEmail(normalizedEmail)
  if (existing) {
    return existing
  }

  const permissions: PermissionName[] = [
    'can_publish',
    'can_delete',
    'can_manage_users',
    'can_upload_media',
    'can_manage_settings',
    'can_view_analytics'
  ]

  const roles = [
    RoleName.SUPER_ADMIN,
    RoleName.ADMIN,
    RoleName.ANALYST,
    RoleName.EDITOR,
    RoleName.FACT_CHECKER,
    RoleName.PUBLISHER,
    RoleName.VIEWER
  ]

  const createdRoles = await Promise.all(
    roles.map((role) => createRole(role, `${role} role`))
  )

  const createdPermissions = await Promise.all(
    permissions.map((permission) => createPermission(permission, `${permission} permission`))
  )

  const adminRole = createdRoles.find((role) => role.name === RoleName.SUPER_ADMIN)
  if (!adminRole) {
    throw new Error('SUPER_ADMIN role failed to create')
  }

  await Promise.all(
    createdPermissions.map((permission) =>
      assignPermissionToRole(adminRole.id, permission.id)
    )
  )

  const hashedPassword = await hash(options.password, 10)
  const user = await createUser({
    email: normalizedEmail,
    name: options.name,
    hashed_password: hashedPassword
  })

  await assignRoleToUser(user.id, adminRole.id)
  return findUserByIdWithRoles(user.id)
}
