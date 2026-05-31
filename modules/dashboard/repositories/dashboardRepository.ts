import prisma from '@pulse-r24/database/src/client'
import type {
  DashboardActivityPreview,
  DashboardAssignedReviewPreview,
  DashboardEvidencePreview,
  DashboardEvidenceTypeCount,
  DashboardNotificationPreview,
  DashboardReportPreview,
  DashboardStatusCount,
  DashboardSummary
} from '../types'

const STATUS_KEYS = ['DRAFT', 'UNDER_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'PUBLISHED', 'ARCHIVED'] as const
const ACTIVE_STATUS_KEYS = ['DRAFT', 'UNDER_REVIEW', 'CHANGES_REQUESTED', 'APPROVED'] as const
const EVIDENCE_TYPES = ['FILE', 'IMAGE', 'PDF', 'VIDEO', 'URL', 'DOCUMENT'] as const

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  UNDER_REVIEW: 'Under Review',
  CHANGES_REQUESTED: 'Changes Requested',
  APPROVED: 'Approved',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived'
}

function userLabel(user?: { name?: string | null; email?: string | null } | null) {
  return user?.name || user?.email || null
}

function parseMeta(meta?: string | null) {
  if (!meta) return null
  try {
    return JSON.parse(meta) as Record<string, unknown>
  } catch {
    return null
  }
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

function reportPreview(report: {
  id: string
  title: string
  updated_at: Date
  status: { key: string }
  author?: { name?: string | null; email?: string | null } | null
  _count?: { evidence?: number; assignments?: number }
}): DashboardReportPreview {
  return {
    id: report.id,
    title: report.title,
    status: report.status.key,
    author: userLabel(report.author),
    evidenceCount: report._count?.evidence,
    assignmentCount: report._count?.assignments,
    updated_at: report.updated_at.toISOString(),
    href: `/dashboard/reports/${report.id}/edit`
  }
}

function evidencePreview(item: {
  id: string
  reportId: string
  title: string
  url?: string | null
  mediaId?: string | null
  media?: { mime_type: string } | null
  report: { title: string }
  created_by?: { name?: string | null; email?: string | null } | null
  created_at: Date
}): DashboardEvidencePreview {
  return {
    id: item.id,
    reportId: item.reportId,
    title: item.title,
    type: classifyEvidence(item),
    reportTitle: item.report.title,
    createdBy: userLabel(item.created_by),
    created_at: item.created_at.toISOString(),
    href: `/dashboard/reports/${item.reportId}/evidence`
  }
}

function notificationHref(item: { type: string; meta?: string | null }) {
  const meta = parseMeta(item.meta)
  const reportId = typeof meta?.reportId === 'string' ? meta.reportId : null
  const evidenceId = typeof meta?.evidenceId === 'string' ? meta.evidenceId : null
  if (evidenceId && reportId) return `/dashboard/reports/${reportId}/evidence`
  if (item.type === 'ASSIGNMENT' && reportId) return '/dashboard/assigned-reviews'
  if (item.type.startsWith('WORKFLOW') && reportId) return '/dashboard/workflow-history'
  if (reportId) return `/dashboard/reports/${reportId}/edit`
  return '/dashboard/notifications'
}

function activityPreview(item: {
  id: string
  action: string
  entityType: string
  entityId?: string | null
  meta?: string | null
  actor?: { name?: string | null; email?: string | null } | null
  created_at: Date
}): DashboardActivityPreview {
  const meta = parseMeta(item.meta)
  const reportId = typeof meta?.reportId === 'string' ? meta.reportId : item.entityType === 'REPORT' ? item.entityId : null
  const title = String(meta?.title || meta?.reportTitle || item.entityId || item.entityType)

  return {
    id: item.id,
    action: item.action,
    entityType: item.entityType,
    title,
    actor: userLabel(item.actor),
    created_at: item.created_at.toISOString(),
    href: reportId ? `/dashboard/reports/${reportId}/edit` : '/dashboard/activity'
  }
}

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
  const recentSince = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalReports,
    statusCounts,
    pendingAssignedReviews,
    totalEvidenceItems,
    unreadNotifications,
    recentActivityCount,
    pendingReviewQueue,
    assignedReviewRows,
    recentlyPublishedReports,
    recentlyUpdatedReports,
    evidenceForTypeCounts,
    recentEvidenceRows,
    activeReportEvidenceRows,
    recentActivityRows,
    recentNotificationRows
  ] = await Promise.all([
    prisma.report.count({ where: { deleted_at: null } }),
    Promise.all(
      STATUS_KEYS.map(async (key): Promise<DashboardStatusCount> => ({
        key,
        label: STATUS_LABELS[key],
        count: await prisma.report.count({ where: { deleted_at: null, status: { key } } })
      }))
    ),
    prisma.reviewAssignment.count({ where: { reviewerId: userId, completed_at: null } }),
    prisma.evidence.count({ where: { deleted_at: null } }),
    prisma.notification.count({ where: { userId, read: false } }),
    prisma.activityFeed.count({ where: { created_at: { gte: recentSince } } }),
    prisma.report.findMany({
      where: { deleted_at: null, status: { key: 'UNDER_REVIEW' } },
      take: 5,
      orderBy: { updated_at: 'desc' },
      include: {
        status: true,
        author: true,
        _count: { select: { evidence: true, assignments: true } }
      }
    }),
    prisma.reviewAssignment.findMany({
      where: { reviewerId: userId, completed_at: null },
      take: 5,
      orderBy: { assigned_at: 'desc' },
      include: {
        report: {
          include: {
            status: true,
            author: true,
            _count: { select: { evidence: true, assignments: true } }
          }
        }
      }
    }),
    prisma.report.findMany({
      where: { deleted_at: null, status: { key: 'PUBLISHED' } },
      take: 5,
      orderBy: { updated_at: 'desc' },
      include: {
        status: true,
        author: true,
        _count: { select: { evidence: true, assignments: true } }
      }
    }),
    prisma.report.findMany({
      where: { deleted_at: null },
      take: 5,
      orderBy: { updated_at: 'desc' },
      include: {
        status: true,
        author: true,
        _count: { select: { evidence: true, assignments: true } }
      }
    }),
    prisma.evidence.findMany({
      where: { deleted_at: null },
      select: { url: true, mediaId: true, media: { select: { mime_type: true } } }
    }),
    prisma.evidence.findMany({
      where: { deleted_at: null },
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        media: true,
        report: true,
        created_by: true
      }
    }),
    prisma.evidence.findMany({
      where: { deleted_at: null, report: { status: { key: { in: [...ACTIVE_STATUS_KEYS] } } } },
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        media: true,
        report: true,
        created_by: true
      }
    }),
    prisma.activityFeed.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: { actor: true }
    }),
    prisma.notification.findMany({
      where: { userId },
      take: 5,
      orderBy: { created_at: 'desc' }
    })
  ])

  const evidenceByTypeMap = new Map<(typeof EVIDENCE_TYPES)[number], number>(EVIDENCE_TYPES.map((type) => [type, 0]))
  evidenceForTypeCounts.forEach((item) => {
    const type = classifyEvidence(item) as (typeof EVIDENCE_TYPES)[number]
    evidenceByTypeMap.set(type, (evidenceByTypeMap.get(type) ?? 0) + 1)
  })

  const byStatus = Object.fromEntries(statusCounts.map((item) => [item.key, item.count]))

  return {
    stats: {
      totalReports,
      draftReports: byStatus.DRAFT ?? 0,
      reportsUnderReview: byStatus.UNDER_REVIEW ?? 0,
      approvedReports: byStatus.APPROVED ?? 0,
      publishedReports: byStatus.PUBLISHED ?? 0,
      archivedReports: byStatus.ARCHIVED ?? 0,
      pendingAssignedReviews,
      totalEvidenceItems,
      unreadNotifications,
      recentActivityCount
    },
    reportsByStatus: statusCounts,
    pendingReviewQueue: pendingReviewQueue.map(reportPreview),
    assignedReviews: assignedReviewRows.map((assignment): DashboardAssignedReviewPreview => ({
      ...reportPreview(assignment.report),
      assignmentId: assignment.id,
      assigned_at: assignment.assigned_at.toISOString()
    })),
    recentlyPublishedReports: recentlyPublishedReports.map(reportPreview),
    recentlyUpdatedReports: recentlyUpdatedReports.map(reportPreview),
    evidenceByType: EVIDENCE_TYPES.map((type): DashboardEvidenceTypeCount => ({ type, count: evidenceByTypeMap.get(type) ?? 0 })),
    recentEvidence: recentEvidenceRows.map(evidencePreview),
    activeReportEvidence: activeReportEvidenceRows.map(evidencePreview),
    recentActivity: recentActivityRows.map(activityPreview),
    recentNotifications: recentNotificationRows.map((item): DashboardNotificationPreview => ({
      id: item.id,
      title: item.title,
      body: item.body,
      type: item.type,
      read: item.read,
      created_at: item.created_at.toISOString(),
      href: notificationHref(item)
    }))
  }
}
