import * as repo from '../repositories/evidenceRepository'
import { auditService } from '@pulse-r24/audit'
import { logActivity } from '@modules/activities'

export async function attachEvidence(data: {
  reportId: string
  title: string
  description?: string
  url?: string
  mediaId?: string
  userId?: string
}) {
  const record = await repo.createEvidenceRecord(data)
  
  await auditService.log({
    actorId: data.userId,
    action: 'upload',
    entity: 'EVIDENCE',
    entityId: record.id,
    meta: { title: data.title, reportId: data.reportId }
  })
  
  await logActivity(
    data.userId,
    'evidence_attached',
    'REPORT',
    data.reportId,
    { title: data.title, evidenceId: record.id }
  )
  
  return record
}

export async function getReportEvidence(reportId: string) {
  return repo.findEvidenceByReport(reportId)
}

export async function removeEvidence(evidenceId: string, userId?: string) {
  const record = await repo.deleteEvidenceRecord(evidenceId)
  
  await auditService.log({
    actorId: userId,
    action: 'report_delete',
    entity: 'EVIDENCE',
    entityId: evidenceId,
    meta: { reportId: record.reportId }
  })
  
  await logActivity(
    userId,
    'evidence_removed',
    'REPORT',
    record.reportId,
    { evidenceId }
  )
  
  return record
}
