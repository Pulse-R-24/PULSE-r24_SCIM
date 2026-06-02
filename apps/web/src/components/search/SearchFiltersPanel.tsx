import { DateRangeFilter } from '@/components/search/DateRangeFilter'
import type { SearchFilters, SearchResultType } from '@/components/search/types'

const STATUS_OPTIONS = ['ALL', 'DRAFT', 'UNDER_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'PUBLISHED', 'ARCHIVED']
const EVIDENCE_OPTIONS = ['ALL', 'FILE', 'IMAGE', 'PDF', 'VIDEO', 'URL', 'DOCUMENT']
const RESULT_OPTIONS: SearchResultType[] = ['ALL', 'REPORT', 'EVIDENCE', 'WORKFLOW', 'ACTIVITY']

interface SearchFiltersPanelProps {
  filters: SearchFilters
  categories: { id: string; name: string }[]
  tags: { id: string; name: string }[]
  onChange: (filters: SearchFilters) => void
}

export function SearchFiltersPanel({ filters, categories, tags, onChange }: SearchFiltersPanelProps) {
  const update = (patch: Partial<SearchFilters>) => onChange({ ...filters, ...patch })

  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-white/[0.025] p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <select value={filters.resultType} onChange={(event) => update({ resultType: event.target.value as SearchResultType })} className="rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200">
          {RESULT_OPTIONS.map((item) => <option key={item} value={item}>{item === 'ALL' ? 'All result types' : item}</option>)}
        </select>
        <select value={filters.status} onChange={(event) => update({ status: event.target.value })} className="rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200">
          {STATUS_OPTIONS.map((item) => <option key={item} value={item}>{item === 'ALL' ? 'All statuses' : item.replace(/_/g, ' ')}</option>)}
        </select>
        <select value={filters.evidenceType} onChange={(event) => update({ evidenceType: event.target.value })} className="rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200">
          {EVIDENCE_OPTIONS.map((item) => <option key={item} value={item}>{item === 'ALL' ? 'All evidence types' : item}</option>)}
        </select>
        <input suppressHydrationWarning value={filters.actor} onChange={(event) => update({ actor: event.target.value })} placeholder="Author or actor" className="rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <select value={filters.categoryId} onChange={(event) => update({ categoryId: event.target.value })} className="rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200">
          <option value="">All categories</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <select value={filters.tagName} onChange={(event) => update({ tagName: event.target.value })} className="rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200">
          <option value="">All tags</option>
          {tags.map((tag) => <option key={tag.id} value={tag.name}>{tag.name}</option>)}
        </select>
      </div>

      <DateRangeFilter
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        onDateFromChange={(dateFrom) => update({ dateFrom })}
        onDateToChange={(dateTo) => update({ dateTo })}
      />
    </div>
  )
}
