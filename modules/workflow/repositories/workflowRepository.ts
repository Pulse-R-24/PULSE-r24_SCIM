import prisma from '@pulse-r24/database/src/client'

export interface WorkflowHistoryFilters {
  reportId?: string
  status?: string
  action?: string
  search?: string
  skip?: number
  take?: number
}

export async function createReviewAssignment(reportId: string, reviewerId: string) {
  return prisma.reviewAssignment.create({
    data: { reportId, reviewerId }
  })
}

export async function completeReviewAssignment(assignmentId: string) {
  return prisma.reviewAssignment.update({ where: { id: assignmentId }, data: { completed_at: new Date() } })
}

export async function createWorkflowHistory(reportId: string, action: string, actorId?: string, meta?: Record<string, unknown>) {
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
  return prisma.report.update({ where: { id: reportId }, data: { status: { connect: { key: stateKey } } } })
}

export async function listWorkflowHistory(filters: WorkflowHistoryFilters = {}) {
  return prisma.workflowHistory.findMany({
    where: {
      ...(filters.reportId ? { reportId: filters.reportId } : {}),
      ...(filters.action ? { action: filters.action } : {}),
      report: {
        deleted_at: null,
        ...(filters.status ? { status: { key: filters.status } } : {}),
        ...(filters.search ? { title: { contains: filters.search } } : {})
      }
    },
    skip: filters.skip,
    take: filters.take,
    orderBy: { created_at: 'desc' },
    include: {
      actor: true,
      report: {
        include: {
          status: true,
          author: true
        }
      }
    }
  })
}
