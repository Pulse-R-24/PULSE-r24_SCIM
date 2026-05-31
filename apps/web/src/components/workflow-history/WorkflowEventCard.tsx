import { MessageSquare, MoveRight, UserRound } from 'lucide-react'
import { ReviewStatusBadge } from '@/components/assigned/ReviewStatusBadge'
import { WorkflowEventBadge } from '@/components/workflow-history/WorkflowEventBadge'
import { formatDate } from '@/lib/utils'
import type { WorkflowHistoryMeta, WorkflowHistoryRecord } from '@/components/workflow-history/types'

function parseMeta(meta: WorkflowHistoryRecord['meta']): WorkflowHistoryMeta {
  if (!meta) return {}
  if (typeof meta !== 'string') return meta
  try {
    return JSON.parse(meta) as WorkflowHistoryMeta
  } catch {
    return {}
  }
}

export function getWorkflowMeta(record: WorkflowHistoryRecord) {
  return parseMeta(record.meta)
}

export function WorkflowEventCard({ record, compact = false }: { record: WorkflowHistoryRecord; compact?: boolean }) {
  const meta = parseMeta(record.meta)
  const actor = record.actor?.name || record.actor?.email || 'System'

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <WorkflowEventBadge action={record.action} />
            {record.report.status?.key && <ReviewStatusBadge status={record.report.status.key} />}
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-100 truncate">{record.report.title}</p>
        </div>
        <time className="text-xs text-slate-500 shrink-0">{formatDate(record.created_at)}</time>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <UserRound className="w-3.5 h-3.5" />
        <span>{actor}</span>
      </div>

      {(meta.previousStatus || meta.nextStatus) && (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {meta.previousStatus ? <ReviewStatusBadge status={meta.previousStatus} /> : <span className="text-slate-600">Unknown</span>}
          <MoveRight className="w-3.5 h-3.5 text-slate-600" />
          {meta.nextStatus ? <ReviewStatusBadge status={meta.nextStatus} /> : <span className="text-slate-600">Unknown</span>}
        </div>
      )}

      {!compact && meta.comment && (
        <div className="flex items-start gap-2 rounded-lg border border-white/5 bg-slate-950/40 p-3">
          <MessageSquare className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
          <p className="text-xs leading-relaxed text-slate-400">{meta.comment}</p>
        </div>
      )}
    </div>
  )
}
