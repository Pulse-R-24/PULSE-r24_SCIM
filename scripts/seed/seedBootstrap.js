require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@pulse-r24.local'
  const password = process.env.ADMIN_PASSWORD || 'SuperSecret123!'
  const name = process.env.ADMIN_NAME || 'Super Admin'

  const hashedPassword = await bcrypt.hash(password, 10)

  const permissionNames = [
    'can_publish',
    'can_delete',
    'can_manage_users',
    'can_upload_media',
    'can_manage_settings',
    'can_view_analytics'
  ]

  const roleNames = [
    'SUPER_ADMIN',
    'ADMIN',
    'ANALYST',
    'EDITOR',
    'FACT_CHECKER',
    'PUBLISHER',
    'VIEWER'
  ]

  const permissions = []
  for (const name of permissionNames) {
    const permission = await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name }
    })
    permissions.push(permission)
  }

  const roles = []
  for (const name of roleNames) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name }
    })
    roles.push(role)
  }

  const superAdminRole = roles.find((role) => role.name === 'SUPER_ADMIN')
  if (!superAdminRole) {
    throw new Error('SUPER_ADMIN role not found')
  }

  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: permission.id } },
      update: {},
      create: { roleId: superAdminRole.id, permissionId: permission.id }
    })
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: { hashed_password: hashedPassword, name },
    create: {
      email,
      name,
      hashed_password: hashedPassword
    }
  })

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: superAdminRole.id } },
    update: {},
    create: { userId: user.id, roleId: superAdminRole.id }
  })

  console.log(`Bootstrapped SUPER_ADMIN ${email}`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
