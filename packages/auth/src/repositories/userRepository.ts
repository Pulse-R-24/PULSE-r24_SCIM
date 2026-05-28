import prisma from '@pulse-r24/database/src/client'

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      roles: {
        include: { role: true }
      }
    }
  })
}

export async function findUserByIdWithRoles(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      roles: {
        include: { role: true }
      }
    }
  })
}

export async function createUser(data: {
  email: string
  name?: string
  hashed_password?: string
}) {
  return prisma.user.create({
    data
  })
}

export async function assignRoleToUser(userId: string, roleId: string) {
  return prisma.userRole.upsert({
    where: { userId_roleId: { userId, roleId } },
    update: {},
    create: { userId, roleId }
  })
}
