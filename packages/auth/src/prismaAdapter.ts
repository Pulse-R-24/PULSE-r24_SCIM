/**
 * Prisma adapter helper (placeholder)
 *
 * Usage:
 * 1. Install: `pnpm add @authjs/prisma-adapter @auth/core`
 * 2. Wire with your Prisma client:
 *
 * import { PrismaAdapter } from '@authjs/prisma-adapter'
 * import prisma from '@pulse-r24/database/src/client'
 * export const adapter = PrismaAdapter(prisma)
 *
 * This file intentionally throws to remind you to wire the real adapter.
 */

export function getPrismaAdapter() {
  throw new Error('getPrismaAdapter is a placeholder — implement by wiring @authjs/prisma-adapter with your Prisma client')
}
