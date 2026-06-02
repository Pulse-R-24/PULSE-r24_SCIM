import type { AnalyticsFiltersState, AnalyticsResult } from '@/components/analytics/types'

interface AnalyticsFiltersProps {
  filters: AnalyticsFiltersState
  options?: AnalyticsResult['filters']
  onChange: (filters: AnalyticsFiltersState) => void
}

export function AnalyticsFilters({ filters, options, onChange }: AnalyticsFiltersProps) {
  const update = (patch: Partial<AnalyticsFiltersState>) => onChange({ ...filters, ...patch })

  return (
    <div className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 md:grid-cols-2 xl:grid-cols-5">
      <input suppressHydrationWarning
        type="date"
        value={filters.dateFrom}
        onChange={(event) => update({ dateFrom: event.target.value })}
        className="rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200"
        aria-label="Start date"
      />
      <input suppressHydrationWarning
        type="date"
        value={filters.dateTo}
        onChange={(event) => update({ dateTo: event.target.value })}
        className="rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200"
        aria-label="End date"
      />
      <select value={filters.categoryId} onChange={(event) => update({ categoryId: event.target.value })} className="rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200">
        <option value="">All categories</option>
        {(options?.categories ?? []).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
      <select value={filters.status} onChange={(event) => update({ status: event.target.value })} className="rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200">
        <option value="">All statuses</option>
        {(options?.statuses ?? []).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
      <select value={filters.actorId} onChange={(event) => update({ actorId: event.target.value })} className="rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200">
        <option value="">All authors / actors</option>
        {(options?.actors ?? []).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
    </div>
  )
}
