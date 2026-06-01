import prisma from '@pulse-r24/database/src/client'
import type { AnalyticsBreakdownItem, AnalyticsFilters, AnalyticsPoint, AnalyticsResult } from '../types'

const STATUS_KEYS = ['DRAFT', 'UNDER_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'PUBLISHED', 'ARCHIVED'] as const
const REVIEW_ACTIONS = ['APPROVE', 'REJECT', 'REQUEST_CHANGES'] as const
const EVIDENCE_TYPES = ['FILE', 'IMAGE', 'PDF', 'VIDEO', 'URL', 'DOCUMENT'] as const

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  UNDER_REVIEW: 'Under Review',
  CHANGES_REQUESTED: 'Changes Requested',
  APPROVED: 'Approved',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived'
}

const REVIEW_LABELS: Record<string, string> = {
  APPROVE: 'Approved',
  REJECT: 'Rejected',
  REQUEST_CHANGES: 'Changes Requested'
}

function dateRange(filters: AnalyticsFilters) {
  if (!filters.dateFrom && !filters.dateTo) return undefined
  return {
    ...(filters.dateFrom ? { gte: new Date(filters.dateFrom) } : {}),
    ...(filters.dateTo ? { lte: new Date(`${filters.dateTo}T23:59:59.999`) } : {})
  }
}

function dayLabel(date: Date) {
  return date.toISOString().slice(0, 10)
}

function groupByDay<T>(items: T[], getDate: (item: T) => Date): AnalyticsPoint[] {
  const counts = new Map<string, number>()
  items.forEach((item) => {
    const label = dayLabel(getDate(item))
    counts.set(label, (counts.get(label) ?? 0) + 1)
  })
  return Array.from(counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, count]) => ({ label, count }))
}

function classifyEvidence(item: { url?: string | null; mediaId?: string | null; media?: { mime_type: string } | null }) {
  const mime = item.media?.mime_type || ''
  if (item.url && !item.mediaId) return 'URL'
  if (mime.startsWith('image/')) return 'IMAGE'
  if (mime === 'application/pdf') return 'PDF'
  if (mime.startsWith('video/')) return 'VIDEO'
  if (mime.includes('document') || mime.includes('text')) return 'DOCUMENT'
  if (item.mediaId) return 'FILE'
  return 'DOCUMENT'
}

function increment(map: Map<string, AnalyticsBreakdownItem>, key: string, label: string, id?: string) {
  const existing = map.get(key)
  if (existing) {
    existing.count += 1
  } else {
    map.set(key, { id, label, count: 1 })
  }
}

function reportWhere(filters: AnalyticsFilters, useCreatedAt = true) {
  return {
    deleted_at: null,
    ...(useCreatedAt && dateRange(filters) ? { created_at: dateRange(filters) } : {}),
    ...(filters.status ? { status: { key: filters.status } } : {}),
    ...(filters.actorId ? { authorId: filters.actorId } : {}),
    ...(filters.categoryId ? { categories: { some: { categoryId: filters.categoryId } } } : {})
  }
}

function evidenceWhere(filters: AnalyticsFilters) {
  return {
    deleted_at: null,
    ...(dateRange(filters) ? { created_at: dateRange(filters) } : {}),
    ...(filters.actorId ? { createdById: filters.actorId } : {}),
    ...((filters.status || filters.categoryId)
      ? {
          report: {
            ...(filters.status ? { status: { key: filters.status } } : {}),
            ...(filters.categoryId ? { categories: { some: { categoryId: filters.categoryId } } } : {})
          }
        }
      : {})
  }
}

function workflowWhere(filters: AnalyticsFilters, actions?: readonly string[]) {
  return {
    ...(dateRange(filters) ? { created_at: dateRange(filters) } : {}),
    ...(actions ? { action: { in: [...actions] } } : {}),
    ...(filters.actorId ? { actorId: filters.actorId } : {}),
    report: {
      deleted_at: null,
      ...(filters.status ? { status: { key: filters.status } } : {}),
      ...(filters.categoryId ? { categories: { some: { categoryId: filters.categoryId } } } : {})
    }
  }
}

function averageReviewHours(assignments: { assigned_at: Date; completed_at: Date | null }[]) {
  const completed = assignments.filter((item) => item.completed_at)
  if (completed.length === 0) return null
  const totalMs = completed.reduce((sum, item) => sum + (item.completed_at!.getTime() - item.assigned_at.getTime()), 0)
  return Math.round((totalMs / completed.length / 3_600_000) * 10) / 10
}

export async function getAnalytics(filters: AnalyticsFilters): Promise<AnalyticsResult> {
  const [
    reportRows,
    evidenceRows,
    reviewHistoryRows,
    publicationRows,
    activityRows,
    reviewAssignments,
    categories,
    workflowStates,
    actors
  ] = await Promise.all([
    prisma.report.findMany({
      where: reportWhere(filters),
      include: {
        status: true,
        author: true,
        categories: { include: { category: true } }
      },
      orderBy: { created_at: 'asc' }
    }),
    prisma.evidence.findMany({
      where: evidenceWhere(filters),
      include: { media: true },
      orderBy: { created_at: 'asc' }
    }),
    prisma.workflowHistory.findMany({
      where: workflowWhere(filters, REVIEW_ACTIONS),
      orderBy: { created_at: 'asc' }
    }),
    prisma.workflowHistory.findMany({
      where: workflowWhere(filters, ['PUBLISH']),
      orderBy: { created_at: 'asc' }
    }),
    prisma.activityFeed.findMany({
      where: {
        ...(dateRange(filters) ? { created_at: dateRange(filters) } : {}),
        ...(filters.actorId ? { actorId: filters.actorId } : {})
      },
      orderBy: { created_at: 'asc' }
    }),
    prisma.reviewAssignment.findMany({
      where: {
        completed_at: { not: null },
        ...(dateRange(filters) ? { completed_at: dateRange(filters) } : {}),
        ...(filters.actorId ? { reviewerId: filters.actorId } : {}),
        report: {
          deleted_at: null,
          ...(filters.status ? { status: { key: filters.status } } : {}),
          ...(filters.categoryId ? { categories: { some: { categoryId: filters.categoryId } } } : {})
        }
      },
      select: { assigned_at: true, completed_at: true }
    }),
    prisma.category.findMany({
      where: { deleted_at: null },
      orderBy: { name: 'asc' },
      select: { id: true, name: true }
    }),
    prisma.workflowState.findMany({
      orderBy: { label: 'asc' },
      select: { key: true, label: true }
    }),
    prisma.user.findMany({
      orderBy: { email: 'asc' },
      select: { id: true, name: true, email: true }
    })
  ])

  const statusCounts = new Map<string, AnalyticsBreakdownItem>()
  STATUS_KEYS.forEach((key) => statusCounts.set(key, { id: key, label: STATUS_LABELS[key], count: 0 }))
  const categoryCounts = new Map<string, AnalyticsBreakdownItem>()
  const authorCounts = new Map<string, AnalyticsBreakdownItem>()
  const outcomeCounts = new Map<string, AnalyticsBreakdownItem>()
  REVIEW_ACTIONS.forEach((action) => outcomeCounts.set(action, { id: action, label: REVIEW_LABELS[action], count: 0 }))
  const evidenceTypeCounts = new Map<string, AnalyticsBreakdownItem>()
  EVIDENCE_TYPES.forEach((type) => evidenceTypeCounts.set(type, { id: type, label: type, count: 0 }))

  reportRows.forEach((report) => {
    increment(statusCounts, report.status.key, report.status.label || STATUS_LABELS[report.status.key] || report.status.key, report.status.key)
    increment(authorCounts, report.authorId || 'unknown', report.author?.name || report.author?.email || 'Unknown Author', report.authorId || undefined)
    report.categories.forEach((item) => {
      increment(categoryCounts, item.categoryId, item.category.name, item.categoryId)
    })
  })

  reviewHistoryRows.forEach((item) => {
    increment(outcomeCounts, item.action, REVIEW_LABELS[item.action] || item.action.replace(/_/g, ' '), item.action)
  })

  evidenceRows.forEach((item) => {
    const type = classifyEvidence(item)
    increment(evidenceTypeCounts, type, type, type)
  })

  return {
    metrics: {
      reportsCreated: reportRows.length,
      evidenceAdded: evidenceRows.length,
      publications: publicationRows.length,
      activityEvents: activityRows.length,
      avgReviewCompletionHours: averageReviewHours(reviewAssignments)
    },
    reportsCreatedOverTime: groupByDay(reportRows, (item) => item.created_at),
    reportsByWorkflowStatus: Array.from(statusCounts.values()),
    reportsByCategory: Array.from(categoryCounts.values()).sort((a, b) => b.count - a.count),
    reportsByAuthor: Array.from(authorCounts.values()).sort((a, b) => b.count - a.count),
    reviewOutcomes: Array.from(outcomeCounts.values()),
    evidenceByType: Array.from(evidenceTypeCounts.values()),
    evidenceAddedOverTime: groupByDay(evidenceRows, (item) => item.created_at),
    publicationCountOverTime: groupByDay(publicationRows, (item) => item.created_at),
    activityCountOverTime: groupByDay(activityRows, (item) => item.created_at),
    filters: {
      categories: categories.map((item) => ({ id: item.id, label: item.name })),
      statuses: workflowStates.map((item) => ({ id: item.key, label: item.label })),
      actors: actors.map((item) => ({ id: item.id, label: item.name || item.email }))
    }
  }
}
