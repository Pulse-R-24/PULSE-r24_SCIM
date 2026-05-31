import { reportCreateSchema, reportUpdateSchema } from '../validators/reportValidator'
import * as repo from '../repositories/reportRepository'
import { createWorkflowHistory } from '@modules/workflow/repositories/workflowRepository'
import { logActivity } from '@modules/activities'
import { auditService } from '@pulse-r24/audit'
import type { ReportInput, ReportUpdateInput } from '../types'

export async function createReport(input: ReportInput, authorId: string) {
  const parsed = reportCreateSchema.parse(input)

  const report = await repo.createReportRecord({
    title: parsed.title,
    body_markdown: parsed.body_markdown,
    authorId,
    status: parsed.status
  })

  await repo.upsertReportCategories(report.id, parsed.categoryIds, authorId)
  await repo.connectReportTags(report.id, parsed.tagNames, authorId)
  await repo.createReportRevision(report.id, parsed.body_markdown, authorId)
  await createWorkflowHistory(report.id, 'DRAFT_CREATED', authorId, {
    nextStatus: parsed.status
  })

  await auditService.log({
    actorId: authorId,
    action: 'report_create',
    entity: 'REPORT',
    entityId: report.id,
    meta: { title: report.title, status: parsed.status }
  })

  await logActivity(authorId, 'report_created', 'REPORT', report.id, {
    title: report.title,
    status: parsed.status
  })

  return report
}

export async function updateReport(reportId: string, input: ReportUpdateInput, actorId: string) {
  const parsed = reportUpdateSchema.parse(input)

  const existing = await repo.findReportById(reportId)
  if (!existing) {
    throw new Error('Report not found')
  }

  // Edit conflict/lock check
  if (existing.lockedById && existing.lockedById !== actorId) {
    throw new Error(`Conflict: Report is locked by ${existing.locked_by?.name || existing.lockedById}`)
  }

  const updated = await repo.updateReportRecord(reportId, {
    title: parsed.title,
    body_markdown: parsed.body_markdown,
    status: parsed.status,
    updatedById: actorId
  })

  if (parsed.categoryIds) {
    await repo.upsertReportCategories(reportId, parsed.categoryIds, actorId)
  }

  if (parsed.tagNames) {
    await repo.connectReportTags(reportId, parsed.tagNames, actorId)
  }

  if (parsed.body_markdown) {
    await repo.createReportRevision(reportId, parsed.body_markdown, actorId)
  }

  await auditService.log({
    actorId,
    action: 'report_edit',
    entity: 'REPORT',
    entityId: reportId,
    meta: {
      changes: parsed,
      previousStatus: existing.status?.key,
      newStatus: parsed.status ?? existing.status?.key
    }
  })

  await logActivity(actorId, 'report_updated', 'REPORT', reportId, {
    title: parsed.title ?? existing.title,
    previousStatus: existing.status?.key,
    status: parsed.status ?? existing.status?.key
  })

  return updated
}

export async function acquireLock(reportId: string, actorId: string) {
  const existing = await repo.findReportById(reportId)
  if (!existing) throw new Error('Report not found')
  
  if (existing.lockedById && existing.lockedById !== actorId) {
    // If lock is older than 5 minutes, we can allow breaking it. Otherwise throw error.
    const lockAgeMs = Date.now() - new Date(existing.locked_at!).getTime()
    if (lockAgeMs < 5 * 60 * 1000) {
      throw new Error(`Report is currently locked by ${existing.locked_by?.name || 'another editor'}`)
    }
  }

  return repo.acquireReportLock(reportId, actorId)
}

export async function releaseLock(reportId: string, actorId: string) {
  const existing = await repo.findReportById(reportId)
  if (!existing) throw new Error('Report not found')
  
  if (existing.lockedById && existing.lockedById !== actorId) {
    throw new Error('You do not own the lock on this report')
  }

  return repo.releaseReportLock(reportId)
}

export async function getReport(reportId: string) {
  return repo.findReportById(reportId)
}

export async function listDrafts(authorId: string) {
  return repo.findDraftsByAuthor(authorId)
}

export async function listReports(opts?: { skip?: number; take?: number; status?: string; assignedReviewerId?: string }) {
  return repo.listReports(opts)
}

export async function listReportTaxonomy() {
  const [categories, tags] = await Promise.all([
    repo.listCategories(),
    repo.listTags()
  ])

  return { categories, tags }
}

export async function publishReport(reportId: string, actorId: string) {
  const existing = await repo.findReportById(reportId)
  if (!existing) throw new Error('Report not found')

  const updated = await repo.updateReportRecord(reportId, { status: 'PUBLISHED', updatedById: actorId })

  await auditService.log({
    actorId,
    action: 'report_publish',
    entity: 'REPORT',
    entityId: reportId,
    meta: { previousStatus: existing.status?.key, newStatus: 'PUBLISHED' }
  })

  return updated
}

export async function deleteReport(reportId: string, actorId: string) {
  const existing = await repo.findReportById(reportId)
  if (!existing) throw new Error('Report not found')

  const deleted = await repo.deleteReport(reportId)

  await auditService.log({
    actorId,
    action: 'report_delete',
    entity: 'REPORT',
    entityId: reportId,
    meta: { title: existing.title }
  })

  return deleted
}
