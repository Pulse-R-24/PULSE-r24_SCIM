import prisma from '@pulse-r24/database/src/client'

export async function createReviewAssignment(reportId: string, reviewerId: string) {
  return prisma.reviewAssignment.create({
    data: { reportId, reviewerId }
  })
}

export async function completeReviewAssignment(assignmentId: string) {
  return prisma.reviewAssignment.update({ where: { id: assignmentId }, data: { completed_at: new Date() } })
}

export async function createWorkflowHistory(reportId: string, action: string, actorId?: string, meta?: any) {
  return prisma.workflowHistory.create({
    data: {
      reportId,
      action,
      actorId,
      meta: meta ? JSON.stringify(meta) : null
    }
  })
}

export async function createReviewComment(reportId: string, authorId: string | undefined, body: string) {
  return prisma.reviewComment.create({ data: { reportId, authorId, body } })
}

export async function setReportWorkflowState(reportId: string, stateKey: string) {
  return prisma.report.update({ where: { id: reportId }, data: { workflowState: { connect: { key: stateKey } } } })
}
