import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WorkflowActionFilter, WorkflowStatusFilter } from '@/components/workflow-history/types'

const STATUS_OPTIONS: WorkflowStatusFilter[] = ['ALL', 'DRAFT', 'UNDER_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'PUBLISHED', 'ARCHIVED']
const ACTION_OPTIONS: WorkflowActionFilter[] = ['ALL', 'DRAFT_CREATED', 'SUBMIT_FOR_REVIEW', 'REQUEST_CHANGES', 'APPROVE', 'REJECT', 'PUBLISH', 'ARCHIVE']

interface WorkflowFiltersProps {
  search: string
  status: WorkflowStatusFilter
  action: WorkflowActionFilter
  onSearchChange: (value: string) => void
  onStatusChange: (value: WorkflowStatusFilter) => void
  onActionChange: (value: WorkflowActionFilter) => void
}

export function WorkflowFilters({
  search,
  status,
  action,
  onSearchChange,
  onStatusChange,
  onActionChange,
}: WorkflowFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="relative w-full lg:w-96">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input suppressHydrationWarning
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search report title..."
          className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 pl-10 pr-3 py-2 text-sm
                     text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_OPTIONS.map((item) => (
          <button
            key={item}
            onClick={() => onStatusChange(item)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
              status === item
                ? 'bg-blue-500/15 text-blue-300 border-blue-500/40'
                : 'bg-transparent text-slate-400 border-slate-700/70 hover:text-slate-200'
            )}
          >
            {item.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {ACTION_OPTIONS.map((item) => (
          <button
            key={item}
            onClick={() => onActionChange(item)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
              action === item
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                : 'bg-transparent text-slate-400 border-slate-700/70 hover:text-slate-200'
            )}
          >
            {item.replace(/_/g, ' ')}
          </button>
        ))}
      </div>
    </div>
  )
}
