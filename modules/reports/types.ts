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
