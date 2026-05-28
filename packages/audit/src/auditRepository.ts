import prisma from '@pulse-r24/database/src/client'
import type { AuditEntry } from './types'

export async function createAuditLog(entry: AuditEntry) {
  return prisma.auditLog.create({
    data: {
      actorId: entry.actorId,
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId,
      meta: entry.meta,
      created_at: new Date()
    }
  })
}
