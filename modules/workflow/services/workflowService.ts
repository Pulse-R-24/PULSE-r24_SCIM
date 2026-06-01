import * as repo from '../repositories/workflowRepository'
import * as reportRepo from '@modules/reports/repositories/reportRepository'
import { submitForReviewSchema, reviewActionSchema } from '../validators/workflowValidator'
import { auditService } from '@pulse-r24/audit'
import { sendNotification } from '@modules/notifications'
import { logActivity } from '@modules/activities'
import type { SubmitForReviewInput, ReviewActionInput, WorkflowHistoryListInput } from '../types'

export async function listWorkflowHistory(input: WorkflowHistoryListInput = {}) {
  return repo.listWorkflowHistory(input)
}

export async function submitForReview(input: SubmitForReviewInput, actorId: string) {
  const parsed = submitForReviewSchema.parse(input)
  const existing = await reportRepo.findReportById(parsed.reportId)

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
        `You have been assigned to review "${existing?.title || parsed.reportId}".`,
        'ASSIGNMENT',
        { reportId: parsed.reportId, actorId, status: 'UNDER_REVIEW' }
      )
    }
  }

  if (existing?.authorId) {
    await sendNotification(
      existing.authorId,
      'Report Submitted for Review',
      `Your report "${existing.title}" was submitted for review.`,
      'WORKFLOW_SUBMITTED',
      { reportId: parsed.reportId, actorId, status: 'UNDER_REVIEW' }
    )
  }

  await repo.createWorkflowHistory(parsed.reportId, 'SUBMIT_FOR_REVIEW', actorId, {
    previousStatus: existing?.status?.key,
    nextStatus: 'UNDER_REVIEW'
  })
  await auditService.log({ actorId, action: 'review_submit', entity: 'REPORT', entityId: parsed.reportId })
  await logActivity(actorId, 'report_submitted', 'REPORT', parsed.reportId, {
    title: existing?.title,
    status: 'UNDER_REVIEW'
  })
}

export async function approveReport(input: ReviewActionInput, actorId: string) {
  const parsed = reviewActionSchema.parse(input)
  const report = await reportRepo.findReportById(parsed.reportId)

  await repo.setReportWorkflowState(parsed.reportId, 'APPROVED')
  await repo.completeActiveReviewAssignments(parsed.reportId, actorId)
  await repo.createWorkflowHistory(parsed.reportId, 'APPROVE', actorId, {
    previousStatus: report?.status?.key,
    nextStatus: 'APPROVED',
    comment: parsed.comment
  })
  if (parsed.comment) await repo.createReviewComment(parsed.reportId, actorId, parsed.comment)

  // Notify report author
  if (report?.authorId) {
    await sendNotification(
      report.authorId,
      'Report Approved',
      `Your report "${report.title}" has been approved.`,
      'WORKFLOW_STATE_CHANGE',
      { reportId: parsed.reportId, actorId, status: 'APPROVED' }
    )

    if (parsed.comment) {
      await sendNotification(
        report.authorId,
        'Review Comment Added',
        `A reviewer added a comment to "${report.title}".`,
        'COMMENT',
        { reportId: parsed.reportId, actorId, comment: parsed.comment }
      )
    }
  }

  await auditService.log({ actorId, action: 'review_approve', entity: 'REPORT', entityId: parsed.reportId })
  await logActivity(actorId, 'report_approved', 'REPORT', parsed.reportId, {
    title: report?.title,
    status: 'APPROVED'
  })
  if (parsed.comment) {
    await logActivity(actorId, 'review_comment_added', 'REPORT', parsed.reportId, {
      title: report?.title,
      comment: parsed.comment
    })
  }
}

export async function rejectReport(input: ReviewActionInput, actorId: string) {
  const parsed = reviewActionSchema.parse(input)
  const report = await reportRepo.findReportById(parsed.reportId)

  await repo.setReportWorkflowState(parsed.reportId, 'DRAFT')
  await repo.completeActiveReviewAssignments(parsed.reportId, actorId)
  await repo.createWorkflowHistory(parsed.reportId, 'REJECT', actorId, {
    previousStatus: report?.status?.key,
    nextStatus: 'DRAFT',
    comment: parsed.comment
  })
  if (parsed.comment) await repo.createReviewComment(parsed.reportId, actorId, parsed.comment)

  // Notify report author
  if (report?.authorId) {
    await sendNotification(
      report.authorId,
      'Report Rejected',
      `Your report "${report.title}" was rejected and returned to draft status.`,
      'WORKFLOW_STATE_CHANGE',
      { reportId: parsed.reportId, actorId, status: 'DRAFT', comment: parsed.comment }
    )

    if (parsed.comment) {
      await sendNotification(
        report.authorId,
        'Review Comment Added',
        `A reviewer added a rejection note to "${report.title}".`,
        'COMMENT',
        { reportId: parsed.reportId, actorId, comment: parsed.comment }
      )
    }
  }

  await auditService.log({ actorId, action: 'review_reject', entity: 'REPORT', entityId: parsed.reportId })
  await logActivity(actorId, 'report_rejected', 'REPORT', parsed.reportId, {
    title: report?.title,
    status: 'DRAFT',
    comment: parsed.comment
  })
  if (parsed.comment) {
    await logActivity(actorId, 'review_comment_added', 'REPORT', parsed.reportId, {
      title: report?.title,
      comment: parsed.comment
    })
  }
}

export async function requestChanges(input: ReviewActionInput, actorId: string) {
  const parsed = reviewActionSchema.parse(input)
  const report = await reportRepo.findReportById(parsed.reportId)

  await repo.setReportWorkflowState(parsed.reportId, 'CHANGES_REQUESTED')
  await repo.completeActiveReviewAssignments(parsed.reportId, actorId)
  await repo.createWorkflowHistory(parsed.reportId, 'REQUEST_CHANGES', actorId, {
    previousStatus: report?.status?.key,
    nextStatus: 'CHANGES_REQUESTED',
    comment: parsed.comment
  })
  if (parsed.comment) await repo.createReviewComment(parsed.reportId, actorId, parsed.comment)

  // Notify report author
  if (report?.authorId) {
    await sendNotification(
      report.authorId,
      'Changes Requested',
      `Changes have been requested on your report "${report.title}".`,
      'WORKFLOW_STATE_CHANGE',
      { reportId: parsed.reportId, actorId, status: 'CHANGES_REQUESTED', comment: parsed.comment }
    )

    if (parsed.comment) {
      await sendNotification(
        report.authorId,
        'Review Comment Added',
        `A reviewer added change notes to "${report.title}".`,
        'COMMENT',
        { reportId: parsed.reportId, actorId, comment: parsed.comment }
      )
    }
  }

  await auditService.log({
    actorId,
    action: 'review_reject',
    entity: 'REPORT',
    entityId: parsed.reportId,
    meta: { action: 'request_changes', comment: parsed.comment }
  })
  await logActivity(actorId, 'report_changes_requested', 'REPORT', parsed.reportId, {
    title: report?.title,
    status: 'CHANGES_REQUESTED',
    comment: parsed.comment
  })
  if (parsed.comment) {
    await logActivity(actorId, 'review_comment_added', 'REPORT', parsed.reportId, {
      title: report?.title,
      comment: parsed.comment
    })
  }
}

export async function publishReport(reportId: string, actorId: string) {
  const existing = await reportRepo.findReportById(reportId)
  if (!existing) throw new Error('Report not found')

  await repo.setReportWorkflowState(reportId, 'PUBLISHED')
  await repo.createWorkflowHistory(reportId, 'PUBLISH', actorId, {
    previousStatus: existing.status?.key,
    nextStatus: 'PUBLISHED'
  })

  // Notify report author
  if (existing.authorId && existing.authorId !== actorId) {
    await sendNotification(
      existing.authorId,
      'Report Published',
      `Your report "${existing.title}" is now published.`,
      'WORKFLOW_STATE_CHANGE',
      { reportId, actorId, status: 'PUBLISHED' }
    )
  }

  await auditService.log({ actorId, action: 'report_publish', entity: 'REPORT', entityId: reportId })
  await logActivity(actorId, 'report_published', 'REPORT', reportId, {
    title: existing.title,
    status: 'PUBLISHED'
  })
  return await reportRepo.findReportById(reportId)
}

export async function archiveReport(reportId: string, actorId: string) {
  const existing = await reportRepo.findReportById(reportId)
  if (!existing) throw new Error('Report not found')

  await repo.setReportWorkflowState(reportId, 'ARCHIVED')
  await repo.createWorkflowHistory(reportId, 'ARCHIVE', actorId, {
    previousStatus: existing.status?.key,
    nextStatus: 'ARCHIVED'
  })

  await auditService.log({ actorId, action: 'report_archive', entity: 'REPORT', entityId: reportId })
  await logActivity(actorId, 'report_archived', 'REPORT', reportId, {
    title: existing.title,
    status: 'ARCHIVED'
  })
  if (existing.authorId && existing.authorId !== actorId) {
    await sendNotification(
      existing.authorId,
      'Report Archived',
      `Your report "${existing.title}" has been archived.`,
      'WORKFLOW_STATE_CHANGE',
      { reportId, actorId, status: 'ARCHIVED' }
    )
  }
  return await reportRepo.findReportById(reportId)
}

