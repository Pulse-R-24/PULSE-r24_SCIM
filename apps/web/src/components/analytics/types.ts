export interface AnalyticsFiltersState {
  dateFrom: string
  dateTo: string
  categoryId: string
  status: string
  actorId: string
}

export interface AnalyticsPoint {
  label: string
  count: number
}

export interface AnalyticsBreakdownItem {
  id?: string
  label: string
  count: number
}

export interface AnalyticsMetricSummary {
  reportsCreated: number
  evidenceAdded: number
  publications: number
  activityEvents: number
  avgReviewCompletionHours?: number | null
}

export interface AnalyticsFilterOption {
  id: string
  label: string
}

export interface AnalyticsResult {
  metrics: AnalyticsMetricSummary
  reportsCreatedOverTime: AnalyticsPoint[]
  reportsByWorkflowStatus: AnalyticsBreakdownItem[]
  reportsByCategory: AnalyticsBreakdownItem[]
  reportsByAuthor: AnalyticsBreakdownItem[]
  reviewOutcomes: AnalyticsBreakdownItem[]
  evidenceByType: AnalyticsBreakdownItem[]
  evidenceAddedOverTime: AnalyticsPoint[]
  publicationCountOverTime: AnalyticsPoint[]
  activityCountOverTime: AnalyticsPoint[]
  filters: {
    categories: AnalyticsFilterOption[]
    statuses: AnalyticsFilterOption[]
    actors: AnalyticsFilterOption[]
  }
}
