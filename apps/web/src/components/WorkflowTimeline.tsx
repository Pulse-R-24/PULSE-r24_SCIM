'use client'

import { cn, timeAgo, WORKFLOW_STATUS_MAP, type WorkflowKey } from '@/lib/utils'
import {
  CheckCircle2, XCircle, Clock, RefreshCcw,
  Send, Archive, Globe, MessageSquare,
} from 'lucide-react'

interface HistoryEntry {
  id: string
  action: string
  actorId?: string | null
  actor?: { name?: string | null; email: string } | null
  meta?: any
  created_at: string
}

const ACTION_CONFIG: Record<string, {
  label: string
  icon: React.ReactNode
  color: string
  bg: string
}> = {
  SUBMIT_FOR_REVIEW: {
    label: 'Submitted for Review',
    icon: <Send className="w-3.5 h-3.5" />,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20 border-blue-500/30',
  },
  APPROVE: {
    label: 'Approved',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20 border-emerald-500/30',
  },
  REJECT: {
    label: 'Rejected',
    icon: <XCircle className="w-3.5 h-3.5" />,
    color: 'text-red-400',
    bg: 'bg-red-500/20 border-red-500/30',
  },
  REQUEST_CHANGES: {
    label: 'Changes Requested',
    icon: <RefreshCcw className="w-3.5 h-3.5" />,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20 border-amber-500/30',
  },
  PUBLISH: {
    label: 'Published',
    icon: <Globe className="w-3.5 h-3.5" />,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/20 border-cyan-500/30',
  },
  ARCHIVE: {
    label: 'Archived',
    icon: <Archive className="w-3.5 h-3.5" />,
    color: 'text-zinc-400',
    bg: 'bg-zinc-500/20 border-zinc-500/30',
  },
}

function getActionConfig(action: string) {
  return ACTION_CONFIG[action] ?? {
    label: action.replace(/_/g, ' '),
    icon: <Clock className="w-3.5 h-3.5" />,
    color: 'text-slate-400',
    bg: 'bg-slate-500/20 border-slate-500/30',
  }
}

interface WorkflowTimelineProps {
  history: HistoryEntry[]
  currentStatus?: string
}

export function WorkflowTimeline({ history, currentStatus }: WorkflowTimelineProps) {
  const sorted = [...history].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="space-y-0">
      {/* Current status pill */}
      {currentStatus && (
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Current Status</span>
          <span className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
            WORKFLOW_STATUS_MAP[currentStatus as WorkflowKey]?.css ?? 'status-draft'
          )}>
            <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse',
              WORKFLOW_STATUS_MAP[currentStatus as WorkflowKey]?.dot ?? 'bg-slate-400'
            )} />
            {WORKFLOW_STATUS_MAP[currentStatus as WorkflowKey]?.label ?? currentStatus}
          </span>
        </div>
      )}

      {/* Timeline entries */}
      <div className="relative">
        {sorted.map((entry, i) => {
          const config = getActionConfig(entry.action)
          const isLast = i === sorted.length - 1
          const meta = typeof entry.meta === 'string'
            ? (() => { try { return JSON.parse(entry.meta) } catch { return null } })()
            : entry.meta

          return (
            <div key={entry.id} className="relative flex gap-4 pb-6">
              {/* Vertical line */}
              {!isLast && (
                <div className="absolute left-[19px] top-8 bottom-0 w-px bg-gradient-to-b from-slate-600/50 to-transparent" />
              )}

              {/* Icon bubble */}
              <div className={cn(
                'relative z-10 flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center',
                config.bg, config.color
              )}>
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className={cn('text-sm font-medium', config.color)}>
                    {config.label}
                  </span>
                  <span className="text-xs text-slate-500 flex-shrink-0">
                    {timeAgo(entry.created_at)}
                  </span>
                </div>

                {entry.actor && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    by {entry.actor.name || entry.actor.email}
                  </p>
                )}

                {meta?.comment && (
                  <div className="mt-2 flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <MessageSquare className="w-3 h-3 text-slate-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-slate-400 leading-relaxed">{meta.comment}</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {sorted.length === 0 && (
          <p className="text-sm text-slate-600 py-4">No history yet.</p>
        )}
      </div>
    </div>
  )
}
