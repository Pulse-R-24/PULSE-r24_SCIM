import { Activity, Archive, FileSearch, FileText, GitBranch } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SearchResultType } from '@/components/search/types'

const TYPE_CONFIG: Record<Exclude<SearchResultType, 'ALL'>, { label: string; className: string; icon: React.ReactNode }> = {
  REPORT: { label: 'Report', className: 'bg-blue-500/15 text-blue-300 border-blue-500/30', icon: <FileText className="w-3 h-3" /> },
  EVIDENCE: { label: 'Evidence', className: 'bg-amber-500/15 text-amber-300 border-amber-500/30', icon: <Archive className="w-3 h-3" /> },
  WORKFLOW: { label: 'Workflow', className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: <GitBranch className="w-3 h-3" /> },
  ACTIVITY: { label: 'Activity', className: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30', icon: <Activity className="w-3 h-3" /> },
}

export function SearchTypeBadge({ type, className }: { type: Exclude<SearchResultType, 'ALL'>; className?: string }) {
  const config = TYPE_CONFIG[type] ?? {
    label: type,
    className: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    icon: <FileSearch className="w-3 h-3" />,
  }

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold', config.className, className)}>
      {config.icon}
      {config.label}
    </span>
  )
}
