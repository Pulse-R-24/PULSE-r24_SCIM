import * as repo from '../repositories/workflowRepository'
import * as reportRepo from '@modules/reports/repositories/reportRepository'
import { submitForReviewSchema, reviewActionSchema } from '../validators/workflowValidator'
import { auditService } from '@pulse-r24/audit'
import { sendNotification } from '@modules/notifications'
import { logActivity } from '@modules/activities'
import type { SubmitForReviewInput, ReviewActionInput } from '../types'

export async function submitForReview(input: SubmitForReviewInput, actorId: string) {
  const parsed = submitForReviewSchema.parse(input)

  // Move report to UNDER_REVIEW
  await repo.setReportWorkflowState(parsed.reportId, 'UNDER_REVIEW')

  // Create review assignments
  if (parsed.reviewerIds) {
    for (const reviewerId of parsed.reviewerIds) {
      await repo.createReviewAssignment(parsed.reportId, reviewerId)
      // Notify the reviewer
      await sendNotification(
        reviewerId,
        'New Review Assignment',
        `You have been assigned to review the report: ${parsed.reportId}`,
        'ASSIGNMENT',
        { reportId: parsed.reportId }
      )
    }
  }

  await repo.createWorkflowHistory(parsed.reportId, 'SUBMIT_FOR_REVIEW', actorId)
  await auditService.log({ actorId, action: 'review_submit', entity: 'REPORT', entityId: parsed.reportId })
  await logActivity(actorId, 'report_submitted', 'REPORT', parsed.reportId)
}

export async function approveReport(input: ReviewActionInput, actorId: string) {
  const parsed = reviewActionSchema.parse(input)

  await repo.setReportWorkflowState(parsed.reportId, 'APPROVED')
  await repo.createWorkflowHistory(parsed.reportId, 'APPROVE', actorId)
  if (parsed.comment) await repo.createReviewComment(parsed.reportId, actorId, parsed.comment)

  // Notify report author
  const report = await reportRepo.findReportById(parsed.reportId)
  if (report?.authorId) {
    await sendNotification(
      report.authorId,
      'Report Approved',
      `Your report "${report.title}" has been approved.`,
      'WORKFLOW_STATE_CHANGE',
      { reportId: parsed.reportId, status: 'APPROVED' }
    )
  }

  await auditService.log({ actorId, action: 'review_approve', entity: 'REPORT', entityId: parsed.reportId })
  await logActivity(actorId, 'report_approved', 'REPORT', parsed.reportId)
}

export async function rejectReport(input: ReviewActionInput, actorId: string) {
  const parsed = reviewActionSchema.parse(input)

  await repo.setReportWorkflowState(parsed.reportId, 'DRAFT')
  await repo.createWorkflowHistory(parsed.reportId, 'REJECT', actorId, { comment: parsed.comment })
  if (parsed.comment) await repo.createReviewComment(parsed.reportId, actorId, parsed.comment)

  // Notify report author
  const report = await reportRepo.findReportById(parsed.reportId)
  if (report?.authorId) {
    await sendNotification(
      report.authorId,
      'Report Rejected',
      `Your report "${report.title}" was rejected and returned to draft status.`,
      'WORKFLOW_STATE_CHANGE',
      { reportId: parsed.reportId, status: 'DRAFT', comment: parsed.comment }
    )
  }

  await auditService.log({ actorId, action: 'review_reject', entity: 'REPORT', entityId: parsed.reportId })
  await logActivity(actorId, 'report_rejected', 'REPORT', parsed.reportId)
}

export async function requestChanges(input: ReviewActionInput, actorId: string) {
  const parsed = reviewActionSchema.parse(input)

  await repo.setReportWorkflowState(parsed.reportId, 'CHANGES_REQUESTED')
  await repo.createWorkflowHistory(parsed.reportId, 'REQUEST_CHANGES', actorId, { comment: parsed.comment })
  if (parsed.comment) await repo.createReviewComment(parsed.reportId, actorId, parsed.comment)

  // Notify report author
  const report = await reportRepo.findReportById(parsed.reportId)
  if (report?.authorId) {
    await sendNotification(
      report.authorId,
      'Changes Requested',
      `Changes have been requested on your report "${report.title}".`,
      'WORKFLOW_STATE_CHANGE',
      { reportId: parsed.reportId, status: 'CHANGES_REQUESTED', comment: parsed.comment }
    )
  }

  await auditService.log({
    actorId,
    action: 'review_reject',
    entity: 'REPORT',
    entityId: parsed.reportId,
    meta: { action: 'request_changes', comment: parsed.comment }
  })
  await logActivity(actorId, 'report_changes_requested', 'REPORT', parsed.reportId)
}

export async function publishReport(reportId: string, actorId: string) {
  const existing = await reportRepo.findReportById(reportId)
  if (!existing) throw new Error('Report not found')

  await repo.setReportWorkflowState(reportId, 'PUBLISHED')
  await repo.createWorkflowHistory(reportId, 'PUBLISH', actorId)

  // Notify report author
  if (existing.authorId && existing.authorId !== actorId) {
    await sendNotification(
      existing.authorId,
      'Report Published',
      `Your report "${existing.title}" is now published.`,
      'WORKFLOW_STATE_CHANGE',
      { reportId, status: 'PUBLISHED' }
    )
  }

  await auditService.log({ actorId, action: 'report_publish', entity: 'REPORT', entityId: reportId })
  await logActivity(actorId, 'report_published', 'REPORT', reportId)
  return await reportRepo.findReportById(reportId)
}

export async function archiveReport(reportId: string, actorId: string) {
  const existing = await reportRepo.findReportById(reportId)
  if (!existing) throw new Error('Report not found')

  await repo.setReportWorkflowState(reportId, 'ARCHIVED')
  await repo.createWorkflowHistory(reportId, 'ARCHIVE', actorId)

  await auditService.log({ actorId, action: 'report_archive', entity: 'REPORT', entityId: reportId })
  await logActivity(actorId, 'report_archived', 'REPORT', reportId)
  return await reportRepo.findReportById(reportId)
}

