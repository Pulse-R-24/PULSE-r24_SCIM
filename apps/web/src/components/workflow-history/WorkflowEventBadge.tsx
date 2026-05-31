import { Archive, CheckCircle2, Clock, FileText, Globe, RefreshCcw, Send, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const ACTION_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  DRAFT_CREATED: {
    label: 'Draft Created',
    className: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    icon: <FileText className="w-3 h-3" />,
  },
  SUBMIT_FOR_REVIEW: {
    label: 'Submitted',
    className: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    icon: <Send className="w-3 h-3" />,
  },
  REQUEST_CHANGES: {
    label: 'Changes Requested',
    className: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    icon: <RefreshCcw className="w-3 h-3" />,
  },
  APPROVE: {
    label: 'Approved',
    className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  REJECT: {
    label: 'Rejected',
    className: 'bg-red-500/15 text-red-300 border-red-500/30',
    icon: <XCircle className="w-3 h-3" />,
  },
  PUBLISH: {
    label: 'Published',
    className: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    icon: <Globe className="w-3 h-3" />,
  },
  ARCHIVE: {
    label: 'Archived',
    className: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30',
    icon: <Archive className="w-3 h-3" />,
  },
}

export function getWorkflowActionLabel(action: string) {
  return ACTION_CONFIG[action]?.label ?? action.replace(/_/g, ' ')
}

export function WorkflowEventBadge({ action, className }: { action: string; className?: string }) {
  const config = ACTION_CONFIG[action] ?? {
    label: action.replace(/_/g, ' '),
    className: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    icon: <Clock className="w-3 h-3" />,
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
      config.className,
      className
    )}>
      {config.icon}
      {config.label}
    </span>
  )
}
