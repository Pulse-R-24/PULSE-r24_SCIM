import * as repo from '../repositories/evidenceRepository'
import * as reportRepo from '@modules/reports/repositories/reportRepository'
import { auditService } from '@pulse-r24/audit'
import { logActivity } from '@modules/activities'
import { sendNotification } from '@modules/notifications'

export async function listEvidence(filters?: { search?: string; reportId?: string }) {
  return repo.findAllEvidence(filters)
}

export async function attachEvidence(data: {
  reportId: string
  title: string
  description?: string
  url?: string
  mediaId?: string
  userId?: string
}) {
  const report = await reportRepo.findReportById(data.reportId)
  const record = await repo.createEvidenceRecord(data)
  
  await auditService.log({
    actorId: data.userId,
    action: data.mediaId ? 'evidence_uploaded' : 'evidence_created',
    entity: 'EVIDENCE',
    entityId: record.id,
    meta: { title: data.title, reportId: data.reportId, mediaId: data.mediaId, url: data.url }
  })

  await auditService.log({
    actorId: data.userId,
    action: 'evidence_attached',
    entity: 'REPORT',
    entityId: data.reportId,
    meta: { title: data.title, evidenceId: record.id }
  })
  
  await logActivity(
    data.userId,
    'evidence_attached',
    'REPORT',
    data.reportId,
    { title: data.title, reportTitle: report?.title, evidenceId: record.id }
  )

  if (data.mediaId) {
    await logActivity(
      data.userId,
      'evidence_uploaded',
      'EVIDENCE',
      record.id,
      { title: data.title, reportId: data.reportId, reportTitle: report?.title, mediaId: data.mediaId }
    )
  }

  if (report?.authorId && report.authorId !== data.userId) {
    await sendNotification(
      report.authorId,
      'Evidence Attached',
      `Evidence "${data.title}" was attached to "${report.title}".`,
      'EVIDENCE_ATTACHED',
      { reportId: data.reportId, evidenceId: record.id, actorId: data.userId }
    )
  }
  
  return record
}

export async function attachExistingEvidence(data: {
  reportId: string
  evidenceId: string
  userId?: string
}) {
  const report = await reportRepo.findReportById(data.reportId)
  const existing = await repo.findEvidenceById(data.evidenceId)
  if (!existing) {
    throw new Error('Evidence not found')
  }

  const record = await repo.createEvidenceRecord({
    reportId: data.reportId,
    title: existing.title,
    description: existing.description ?? undefined,
    url: existing.url ?? undefined,
    mediaId: existing.mediaId ?? undefined,
    userId: data.userId
  })

  await auditService.log({
    actorId: data.userId,
    action: 'evidence_attached',
    entity: 'REPORT',
    entityId: data.reportId,
    meta: { evidenceId: record.id, sourceEvidenceId: data.evidenceId }
  })

  await logActivity(
    data.userId,
    'evidence_attached',
    'REPORT',
    data.reportId,
    { title: record.title, reportTitle: report?.title, evidenceId: record.id, sourceEvidenceId: data.evidenceId }
  )

  if (report?.authorId && report.authorId !== data.userId) {
    await sendNotification(
      report.authorId,
      'Evidence Attached',
      `Existing evidence "${record.title}" was attached to "${report.title}".`,
      'EVIDENCE_ATTACHED',
      { reportId: data.reportId, evidenceId: record.id, sourceEvidenceId: data.evidenceId, actorId: data.userId }
    )
  }

  return record
}

export async function getReportEvidence(reportId: string) {
  return repo.findEvidenceByReport(reportId)
}

export async function removeEvidence(evidenceId: string, userId?: string) {
  const record = await repo.deleteEvidenceRecord(evidenceId)
  
  await auditService.log({
    actorId: userId,
    action: 'evidence_removed',
    entity: 'EVIDENCE',
    entityId: evidenceId,
    meta: { reportId: record.reportId }
  })

  await auditService.log({
    actorId: userId,
    action: 'evidence_deleted',
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
