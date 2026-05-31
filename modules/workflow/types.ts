export interface SubmitForReviewInput {
  reportId: string
  reviewerIds?: string[]
}

export interface ReviewActionInput {
  reportId: string
  comment?: string
}

export type WorkflowAction =
  | 'DRAFT_CREATED'
  | 'SUBMIT_FOR_REVIEW'
  | 'APPROVE'
  | 'REJECT'
  | 'REQUEST_CHANGES'
  | 'PUBLISH'
  | 'ARCHIVE'

export interface WorkflowHistoryListInput {
  reportId?: string
  status?: string
  action?: WorkflowAction | string
  search?: string
  skip?: number
  take?: number
}
