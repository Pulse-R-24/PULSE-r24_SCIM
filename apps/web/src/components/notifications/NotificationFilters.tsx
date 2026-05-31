import { Search } from 'lucide-react'
import { NotificationTypeBadge } from '@/components/notifications/NotificationTypeBadge'
import type { NotificationReadFilter, NotificationTypeFilter } from '@/components/notifications/types'
import { cn } from '@/lib/utils'

const READ_OPTIONS: NotificationReadFilter[] = ['ALL', 'UNREAD']
const TYPE_OPTIONS: NotificationTypeFilter[] = ['ALL', 'ASSIGNMENT', 'WORKFLOW_SUBMITTED', 'WORKFLOW_STATE_CHANGE', 'EVIDENCE_ATTACHED', 'COMMENT']

interface NotificationFiltersProps {
  search: string
  readFilter: NotificationReadFilter
  typeFilter: NotificationTypeFilter
  onSearchChange: (value: string) => void
  onReadFilterChange: (value: NotificationReadFilter) => void
  onTypeFilterChange: (value: NotificationTypeFilter) => void
}

export function NotificationFilters({
  search,
  readFilter,
  typeFilter,
  onSearchChange,
  onReadFilterChange,
  onTypeFilterChange,
}: NotificationFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="relative w-full lg:w-96">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search notifications..."
          className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 pl-10 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {READ_OPTIONS.map((item) => (
          <button
            key={item}
            onClick={() => onReadFilterChange(item)}
            className={cn('rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors', readFilter === item ? 'border-blue-500/40 bg-blue-500/15 text-blue-300' : 'border-slate-700/70 text-slate-400 hover:text-slate-200')}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {TYPE_OPTIONS.map((item) => (
          <button
            key={item}
            onClick={() => onTypeFilterChange(item)}
            className={cn('rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors', typeFilter === item ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300' : 'border-slate-700/70 text-slate-400 hover:text-slate-200')}
          >
            {item === 'ALL' ? 'ALL TYPES' : <NotificationTypeBadge type={item} />}
          </button>
        ))}
      </div>
    </div>
  )
}
