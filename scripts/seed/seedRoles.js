const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const roleNames = [
    'SUPER_ADMIN',
    'ADMIN',
    'ANALYST',
    'EDITOR',
    'FACT_CHECKER',
    'PUBLISHER',
    'VIEWER'
  ]

  const permissionNames = [
    'can_publish',
    'can_delete',
    'can_manage_users',
    'can_upload_media',
    'can_manage_settings',
    'can_view_analytics'
  ]

  const permissions = []
  for (const name of permissionNames) {
    const p = await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name }
    })
    permissions.push(p)
  }

  const roles = []
  for (const name of roleNames) {
    const r = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name }
    })
    roles.push(r)
  }

  const superRole = roles.find((r) => r.name === 'SUPER_ADMIN')
  if (superRole) {
    for (const p of permissions) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: superRole.id, permissionId: p.id } },
        update: {},
        create: { roleId: superRole.id, permissionId: p.id }
      })
    }
  }

  console.log('Seeded roles and permissions')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
