import prisma from '@pulse-r24/database/src/client'
import { PermissionName, RoleName } from '../types'

export async function findRoleByName(name: RoleName) {
  return prisma.role.findUnique({ where: { name } })
}

export async function createRole(name: RoleName, description?: string) {
  return prisma.role.upsert({
    where: { name },
    update: { description },
    create: { name, description }
  })
}

export async function findPermissionByName(name: PermissionName) {
  return prisma.permission.findUnique({ where: { name } })
}

export async function createPermission(name: PermissionName, description?: string) {
  return prisma.permission.upsert({
    where: { name },
    update: { description },
    create: { name, description }
  })
}

export async function assignPermissionToRole(roleId: string, permissionId: string) {
  return prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId, permissionId } },
    update: {},
    create: { roleId, permissionId }
  })
}
