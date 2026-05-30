import * as repo from '../repositories/workflowRepository'
import * as reportRepo from '@modules/reports/repositories/reportRepository'
import { submitForReviewSchema, reviewActionSchema } from '../validators/workflowValidator'
import { auditService } from '@pulse-r24/audit'
import type { SubmitForReviewInput, ReviewActionInput } from '../types'

export async function submitForReview(input: SubmitForReviewInput, actorId: string) {
  const parsed = submitForReviewSchema.parse(input)

  // Move report to UNDER_REVIEW
  await repo.setReportWorkflowState(parsed.reportId, 'UNDER_REVIEW')

  // Create review assignments
  if (parsed.reviewerIds) {
    for (const reviewerId of parsed.reviewerIds) {
      await repo.createReviewAssignment(parsed.reportId, reviewerId)
    }
  }

  await repo.createWorkflowHistory(parsed.reportId, 'SUBMIT_FOR_REVIEW', actorId)

  await auditService.log({ actorId, action: 'review_submit', entity: 'REPORT', entityId: parsed.reportId })
}

export async function approveReport(input: ReviewActionInput, actorId: string) {
  const parsed = reviewActionSchema.parse(input)

  await repo.setReportWorkflowState(parsed.reportId, 'APPROVED')
  await repo.createWorkflowHistory(parsed.reportId, 'APPROVE', actorId)
  if (parsed.comment) await repo.createReviewComment(parsed.reportId, actorId, parsed.comment)

  await auditService.log({ actorId, action: 'review_approve', entity: 'REPORT', entityId: parsed.reportId })
}

export async function rejectReport(input: ReviewActionInput, actorId: string) {
  const parsed = reviewActionSchema.parse(input)

  await repo.setReportWorkflowState(parsed.reportId, 'DRAFT')
  await repo.createWorkflowHistory(parsed.reportId, 'REJECT', actorId, { comment: parsed.comment })
  if (parsed.comment) await repo.createReviewComment(parsed.reportId, actorId, parsed.comment)

  await auditService.log({ actorId, action: 'review_reject', entity: 'REPORT', entityId: parsed.reportId })
}

export async function publishReport(reportId: string, actorId: string) {
  // ensure report exists
  const existing = await reportRepo.findReportById(reportId)
  if (!existing) throw new Error('Report not found')

  await repo.setReportWorkflowState(reportId, 'PUBLISHED')
  await repo.createWorkflowHistory(reportId, 'PUBLISH', actorId)
  await auditService.log({ actorId, action: 'report_publish', entity: 'REPORT', entityId: reportId })
  return await reportRepo.findReportById(reportId)
}

export async function archiveReport(reportId: string, actorId: string) {
  const existing = await reportRepo.findReportById(reportId)
  if (!existing) throw new Error('Report not found')

  await repo.setReportWorkflowState(reportId, 'ARCHIVED')
  await repo.createWorkflowHistory(reportId, 'ARCHIVE', actorId)
  await auditService.log({ actorId, action: 'report_archive', entity: 'REPORT', entityId: reportId })
  return await reportRepo.findReportById(reportId)
}
