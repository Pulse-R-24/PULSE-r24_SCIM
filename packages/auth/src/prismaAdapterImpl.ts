/**
 * Actual Prisma adapter wiring for Auth.js v5.
 * Requires `@authjs/prisma-adapter` to be installed in the monorepo.
 */
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@pulse-r24/database/src/client'

export function getPrismaAdapter() {
  // PrismaAdapter expects a Prisma client instance
  return PrismaAdapter(prisma as any)
}
