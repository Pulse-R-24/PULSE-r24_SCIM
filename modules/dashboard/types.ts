export interface DashboardStatCounts {
  totalReports: number
  draftReports: number
  reportsUnderReview: number
  approvedReports: number
  publishedReports: number
  archivedReports: number
  pendingAssignedReviews: number
  totalEvidenceItems: number
  unreadNotifications: number
  recentActivityCount: number
}

export interface DashboardStatusCount {
  key: string
  label: string
  count: number
}

export interface DashboardReportPreview {
  id: string
  slug?: string
  title: string
  status: string
  author?: string | null
  evidenceCount?: number
  assignmentCount?: number
  updated_at: string
  href: string
}

export interface DashboardAssignedReviewPreview extends DashboardReportPreview {
  assignmentId: string
  assigned_at: string
}

export interface DashboardEvidenceTypeCount {
  type: 'FILE' | 'IMAGE' | 'PDF' | 'VIDEO' | 'URL' | 'DOCUMENT'
  count: number
}

export interface DashboardEvidencePreview {
  id: string
  reportId: string
  title: string
  type: string
  reportTitle: string
  createdBy?: string | null
  created_at: string
  href: string
}

export interface DashboardActivityPreview {
  id: string
  action: string
  entityType: string
  title: string
  actor?: string | null
  created_at: string
  href: string
}

export interface DashboardNotificationPreview {
  id: string
  title: string
  body: string
  type: string
  read: boolean
  created_at: string
  href: string
}

export interface DashboardSummary {
  stats: DashboardStatCounts
  reportsByStatus: DashboardStatusCount[]
  pendingReviewQueue: DashboardReportPreview[]
  assignedReviews: DashboardAssignedReviewPreview[]
  recentlyPublishedReports: DashboardReportPreview[]
  recentlyUpdatedReports: DashboardReportPreview[]
  evidenceByType: DashboardEvidenceTypeCount[]
  recentEvidence: DashboardEvidencePreview[]
  activeReportEvidence: DashboardEvidencePreview[]
  recentActivity: DashboardActivityPreview[]
  recentNotifications: DashboardNotificationPreview[]
}
