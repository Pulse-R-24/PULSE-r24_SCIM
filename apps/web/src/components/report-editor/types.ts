export interface ReportCategoryOption {
  id: string
  name: string
}

export interface ReportTagOption {
  id: string
  name: string
}

export interface ReportEvidence {
  id: string
  title: string
  description?: string | null
  url?: string | null
  created_at: string
}

export interface ReportRevision {
  id: string
  summary?: string | null
  body_markdown: string
  created_at: string
  created_by?: { name?: string | null; email: string } | null
}

export interface ReportEditorRecord {
  id: string
  slug: string
  title: string
  body_markdown: string
  updated_at: string
  lockedById?: string | null
  locked_at?: string | null
  locked_by?: { name?: string | null; email: string } | null
  status?: { key: string; label?: string | null } | null
  categories: { category: ReportCategoryOption }[]
  tags: { tag: ReportTagOption }[]
  evidence: ReportEvidence[]
  revisions: ReportRevision[]
}

export interface ReportEditorDraft {
  title: string
  body_markdown: string
  categoryIds: string[]
  tagNames: string[]
}

export type SaveState = 'idle' | 'saving' | 'saved' | 'error'
