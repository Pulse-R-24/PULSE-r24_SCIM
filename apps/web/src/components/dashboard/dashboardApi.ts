import { z } from 'zod'
import type { DashboardSummary } from '@/components/dashboard/types'

const statCountsSchema = z.object({
  totalReports: z.number(),
  draftReports: z.number(),
  reportsUnderReview: z.number(),
  approvedReports: z.number(),
  publishedReports: z.number(),
  archivedReports: z.number(),
  pendingAssignedReviews: z.number(),
  totalEvidenceItems: z.number(),
  unreadNotifications: z.number(),
  recentActivityCount: z.number(),
})

const statusCountSchema = z.object({
  key: z.string(),
  label: z.string(),
  count: z.number(),
})

const reportPreviewSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  author: z.string().nullable().optional(),
  evidenceCount: z.number().optional(),
  assignmentCount: z.number().optional(),
  updated_at: z.string(),
  href: z.string(),
})

const assignedReviewPreviewSchema = reportPreviewSchema.extend({
  assignmentId: z.string(),
  assigned_at: z.string(),
})

const evidenceTypeSchema = z.object({
  type: z.enum(['FILE', 'IMAGE', 'PDF', 'VIDEO', 'URL', 'DOCUMENT']),
  count: z.number(),
})

const evidencePreviewSchema = z.object({
  id: z.string(),
  reportId: z.string(),
  title: z.string(),
  type: z.string(),
  reportTitle: z.string(),
  createdBy: z.string().nullable().optional(),
  created_at: z.string(),
  href: z.string(),
})

const activityPreviewSchema = z.object({
  id: z.string(),
  action: z.string(),
  entityType: z.string(),
  title: z.string(),
  actor: z.string().nullable().optional(),
  created_at: z.string(),
  href: z.string(),
})

const notificationPreviewSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  type: z.string(),
  read: z.boolean(),
  created_at: z.string(),
  href: z.string(),
})

const dashboardSummarySchema = z.object({
  stats: statCountsSchema,
  reportsByStatus: z.array(statusCountSchema),
  pendingReviewQueue: z.array(reportPreviewSchema),
  assignedReviews: z.array(assignedReviewPreviewSchema),
  recentlyPublishedReports: z.array(reportPreviewSchema),
  recentlyUpdatedReports: z.array(reportPreviewSchema),
  evidenceByType: z.array(evidenceTypeSchema),
  recentEvidence: z.array(evidencePreviewSchema),
  activeReportEvidence: z.array(evidencePreviewSchema),
  recentActivity: z.array(activityPreviewSchema),
  recentNotifications: z.array(notificationPreviewSchema),
})

export async function fetchDashboardSummary() {
  const res = await fetch('/api/dashboard/summary', { cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to load dashboard summary')
  }

  return dashboardSummarySchema.parse(await res.json()) as DashboardSummary
}
