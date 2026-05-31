import { Archive, Bell, CheckCircle2, FileCheck2, MessageSquare, Send, UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const TYPE_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  ASSIGNMENT: {
    label: 'Assignment',
    className: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    icon: <UserCheck className="w-3 h-3" />,
  },
  WORKFLOW_SUBMITTED: {
    label: 'Submitted',
    className: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    icon: <Send className="w-3 h-3" />,
  },
  WORKFLOW_STATE_CHANGE: {
    label: 'Workflow',
    className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  EVIDENCE_ATTACHED: {
    label: 'Evidence',
    className: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    icon: <FileCheck2 className="w-3 h-3" />,
  },
  COMMENT: {
    label: 'Comment',
    className: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    icon: <MessageSquare className="w-3 h-3" />,
  },
}

export function NotificationTypeBadge({ type, className }: { type: string; className?: string }) {
  const config = TYPE_CONFIG[type] ?? {
    label: type.replace(/_/g, ' '),
    className: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    icon: type === 'EVIDENCE' ? <Archive className="w-3 h-3" /> : <Bell className="w-3 h-3" />,
  }

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold', config.className, className)}>
      {config.icon}
      {config.label}
    </span>
  )
}
