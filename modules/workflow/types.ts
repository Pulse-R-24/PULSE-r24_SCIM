export interface SubmitForReviewInput {
  reportId: string
  reviewerIds?: string[]
}

export interface ReviewActionInput {
  reportId: string
  comment?: string
}

export type WorkflowAction = 'SUBMIT' | 'APPROVE' | 'REJECT' | 'PUBLISH' | 'ARCHIVE'
