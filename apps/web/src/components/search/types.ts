export type SearchResultType = 'ALL' | 'REPORT' | 'EVIDENCE' | 'WORKFLOW' | 'ACTIVITY'

export interface SearchResultItem {
  id: string
  type: Exclude<SearchResultType, 'ALL'>
  title: string
  summary?: string | null
  status?: string | null
  subtype?: string | null
  user?: string | null
  href: string
  created_at?: string
  updated_at?: string
}

export interface GlobalSearchResult {
  reports: SearchResultItem[]
  evidence: SearchResultItem[]
  workflow: SearchResultItem[]
  activity: SearchResultItem[]
}

export interface SearchFilters {
  q: string
  categoryId: string
  tagName: string
  status: string
  evidenceType: string
  actor: string
  dateFrom: string
  dateTo: string
  resultType: SearchResultType
}
