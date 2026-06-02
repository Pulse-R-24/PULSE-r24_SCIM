export type WorkflowStatus = 'DRAFT' | 'UNDER_REVIEW' | 'PUBLISHED'

export interface ReportInput {
  title: string
  body_markdown: string
  categoryIds: string[]
  tagNames: string[]
  status: WorkflowStatus
}

export interface ReportUpdateInput {
  title?: string
  body_markdown?: string
  categoryIds?: string[]
  tagNames?: string[]
  status?: WorkflowStatus
}

export interface PublicReportCategory {
  name: string
  slug: string
}

export interface PublicReportSummary {
  title: string
  slug: string
  excerpt: string
  published_at: string
  category?: PublicReportCategory | null
  tags: string[]
  byline: string
  readTime: string
}

export interface PublicReportDetail extends PublicReportSummary {
  body_markdown: string
}

export interface PublicReportListInput {
  q?: string
  categorySlug?: string
  tag?: string
  skip?: number
  take?: number
}

export interface PublicReportListResult {
  reports: PublicReportSummary[]
  total: number
  categories: PublicReportCategory[]
}
