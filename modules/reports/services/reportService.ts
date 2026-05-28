import { reportCreateSchema, reportUpdateSchema } from '../validators/reportValidator'
import * as repo from '../repositories/reportRepository'
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

  await repo.upsertReportCategories(report.id, parsed.categoryIds)
  await repo.connectReportTags(report.id, parsed.tagNames)
  await repo.createReportRevision(report.id, parsed.body_markdown, authorId)

  await auditService.log({
    actorId: authorId,
    action: 'REPORT_CREATED',
    entity: 'REPORT',
    entityId: report.id,
    meta: { title: report.title, status: parsed.status }
  })

  return report
}

export async function updateReport(reportId: string, input: ReportUpdateInput, actorId: string) {
  const parsed = reportUpdateSchema.parse(input)

  const existing = await repo.findReportById(reportId)
  if (!existing) {
    throw new Error('Report not found')
  }

  const updated = await repo.updateReportRecord(reportId, {
    title: parsed.title,
    body_markdown: parsed.body_markdown,
    status: parsed.status
  })

  if (parsed.categoryIds) {
    await repo.upsertReportCategories(reportId, parsed.categoryIds)
  }

  if (parsed.tagNames) {
    await repo.connectReportTags(reportId, parsed.tagNames)
  }

  if (parsed.body_markdown) {
    await repo.createReportRevision(reportId, parsed.body_markdown, actorId)
  }

  await auditService.log({
    actorId,
    action: 'REPORT_UPDATED',
    entity: 'REPORT',
    entityId: reportId,
    meta: {
      changes: parsed,
      previousStatus: existing.workflowState?.key,
      newStatus: parsed.status ?? existing.workflowState?.key
    }
  })

  return updated
}

export async function getReport(reportId: string) {
  return repo.findReportById(reportId)
}

export async function listDrafts(authorId: string) {
  return repo.findDraftsByAuthor(authorId)
}
