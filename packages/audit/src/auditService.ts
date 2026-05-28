import { createAuditLog } from './auditRepository'
import type { AuditEntry } from './types'

export const auditService = {
  async log(entry: AuditEntry) {
    // Fire-and-forget logging, but preserve promise for callers who need it
    return createAuditLog(entry)
  }
}
