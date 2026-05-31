export type AssignedStatusFilter = 'UNDER_REVIEW' | 'CHANGES_REQUESTED' | 'APPROVED' | 'ALL'

export interface AssignedReviewer {
  id: string
  name?: string | null
  email: string
}

export interface AssignedReviewAssignment {
  id: string
  reviewerId: string
  assigned_at: string
  completed_at?: string | null
  due_at?: string | null
  reviewer?: AssignedReviewer | null
}

export interface AssignedReport {
  id: string
  title: string
  updated_at: string
  workflowStateKey: string
  author?: { name?: string | null; email: string } | null
  categories: { category: { name: string } }[]
  tags: { tag: { name: string } }[]
  assignments: AssignedReviewAssignment[]
}
