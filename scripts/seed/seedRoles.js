require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const rolePermissions = {
  SUPER_ADMIN: [
    'can_publish',
    'can_delete',
    'can_manage_users',
    'can_upload_media',
    'can_manage_settings',
    'can_view_analytics',
    'can_view_reports',
    'can_view_evidence',
    'can_upload_evidence',
    'can_delete_evidence',
    'can_create_reports',
    'can_edit_reports',
    'can_publish_reports',
    'can_delete_reports',
    'can_submit_reports',
    'can_review_reports',
    'can_approve_reports',
    'can_archive_reports'
  ],
  ADMIN: [
    'can_manage_users',
    'can_manage_settings',
    'can_view_analytics',
    'can_view_reports',
    'can_view_evidence',
    'can_upload_evidence',
    'can_delete_evidence',
    'can_create_reports',
    'can_edit_reports',
    'can_delete_reports',
    'can_submit_reports',
    'can_review_reports',
    'can_approve_reports',
    'can_archive_reports'
  ],
  ANALYST: [
    'can_view_analytics',
    'can_view_reports',
    'can_view_evidence',
    'can_upload_evidence',
    'can_create_reports',
    'can_edit_reports',
    'can_submit_reports'
  ],
  EDITOR: [
    'can_publish',
    'can_upload_media',
    'can_view_reports',
    'can_view_evidence',
    'can_upload_evidence',
    'can_delete_evidence',
    'can_create_reports',
    'can_edit_reports',
    'can_submit_reports',
    'can_review_reports',
    'can_approve_reports'
  ],
  FACT_CHECKER: [
    'can_view_analytics',
    'can_view_reports',
    'can_view_evidence',
    'can_review_reports',
    'can_approve_reports'
  ],
  PUBLISHER: [
    'can_publish',
    'can_view_reports',
    'can_view_evidence',
    'can_publish_reports',
    'can_archive_reports'
  ],
  VIEWER: ['can_view_reports', 'can_view_evidence']
}

async function main() {
  const permissionNames = Array.from(new Set(Object.values(rolePermissions).flat()))
  const permissions = new Map()

  for (const name of permissionNames) {
    const permission = await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name }
    })
    permissions.set(name, permission)
  }

  for (const [roleName, permissionList] of Object.entries(rolePermissions)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName }
    })

    for (const permissionName of permissionList) {
      const permission = permissions.get(permissionName)
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id }
      })
    }
  }

  console.log('Seeded roles and permissions.')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
