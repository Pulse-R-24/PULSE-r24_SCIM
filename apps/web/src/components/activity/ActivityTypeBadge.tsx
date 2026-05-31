import { Archive, CheckCircle2, FileCheck2, FilePenLine, MessageSquare, RefreshCcw, Send, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const ACTION_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  report_created: { label: 'Report Created', className: 'bg-blue-500/15 text-blue-300 border-blue-500/30', icon: <FilePenLine className="w-3 h-3" /> },
  report_updated: { label: 'Report Updated', className: 'bg-slate-500/15 text-slate-300 border-slate-500/30', icon: <FilePenLine className="w-3 h-3" /> },
  report_submitted: { label: 'Submitted', className: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30', icon: <Send className="w-3 h-3" /> },
  report_changes_requested: { label: 'Changes Requested', className: 'bg-amber-500/15 text-amber-300 border-amber-500/30', icon: <RefreshCcw className="w-3 h-3" /> },
  report_approved: { label: 'Approved', className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: <CheckCircle2 className="w-3 h-3" /> },
  report_rejected: { label: 'Rejected', className: 'bg-red-500/15 text-red-300 border-red-500/30', icon: <XCircle className="w-3 h-3" /> },
  report_published: { label: 'Published', className: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30', icon: <CheckCircle2 className="w-3 h-3" /> },
  report_archived: { label: 'Archived', className: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30', icon: <Archive className="w-3 h-3" /> },
  evidence_uploaded: { label: 'Evidence Uploaded', className: 'bg-violet-500/15 text-violet-300 border-violet-500/30', icon: <FileCheck2 className="w-3 h-3" /> },
  evidence_attached: { label: 'Evidence Attached', className: 'bg-blue-500/15 text-blue-300 border-blue-500/30', icon: <FileCheck2 className="w-3 h-3" /> },
  review_comment_added: { label: 'Review Comment', className: 'bg-amber-500/15 text-amber-300 border-amber-500/30', icon: <MessageSquare className="w-3 h-3" /> },
}

export function getActivityActionLabel(action: string) {
  return ACTION_CONFIG[action]?.label ?? action.replace(/_/g, ' ')
}

export function ActivityTypeBadge({ action, className }: { action: string; className?: string }) {
  const config = ACTION_CONFIG[action] ?? {
    label: action.replace(/_/g, ' '),
    className: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    icon: <Archive className="w-3 h-3" />,
  }

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold', config.className, className)}>
      {config.icon}
      {config.label}
    </span>
  )
}
