import { MessageSquare, MoveRight } from 'lucide-react'
import { ReviewStatusBadge } from '@/components/assigned/ReviewStatusBadge'
import { WorkflowEventBadge } from '@/components/workflow-history/WorkflowEventBadge'
import { getWorkflowMeta } from '@/components/workflow-history/WorkflowEventCard'
import { cn, formatDate } from '@/lib/utils'
import type { WorkflowHistoryRecord } from '@/components/workflow-history/types'

interface WorkflowHistoryTableProps {
  records: WorkflowHistoryRecord[]
  selectedReportId?: string
  onSelectReport: (reportId: string) => void
}

export function WorkflowHistoryTable({ records, selectedReportId, onSelectReport }: WorkflowHistoryTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-white/[0.03]">
          <tr className="text-left text-slate-400">
            <th className="px-4 py-3 font-semibold">Report</th>
            <th className="px-4 py-3 font-semibold">Action</th>
            <th className="px-4 py-3 font-semibold">State</th>
            <th className="px-4 py-3 font-semibold">Actor</th>
            <th className="px-4 py-3 font-semibold">Timestamp</th>
            <th className="px-4 py-3 font-semibold">Notes</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const meta = getWorkflowMeta(record)
            const selected = selectedReportId === record.reportId
            return (
              <tr
                key={record.id}
                className={cn(
                  'border-t border-white/5 align-top cursor-pointer transition-colors hover:bg-white/[0.035]',
                  selected && 'bg-blue-500/[0.06]'
                )}
                onClick={() => onSelectReport(record.reportId)}
              >
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-100">{record.report.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Author: {record.report.author?.name || record.report.author?.email || 'Unknown'}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <WorkflowEventBadge action={record.action} />
                </td>
                <td className="px-4 py-4">
                  {meta.previousStatus || meta.nextStatus ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      {meta.previousStatus && <ReviewStatusBadge status={meta.previousStatus} />}
                      <MoveRight className="w-3.5 h-3.5 text-slate-600" />
                      {meta.nextStatus && <ReviewStatusBadge status={meta.nextStatus} />}
                    </div>
                  ) : (
                    record.report.status?.key ? <ReviewStatusBadge status={record.report.status.key} /> : <span className="text-xs text-slate-600">No state data</span>
                  )}
                </td>
                <td className="px-4 py-4 text-xs text-slate-400">
                  {record.actor?.name || record.actor?.email || 'System'}
                </td>
                <td className="px-4 py-4 text-xs text-slate-400">
                  {formatDate(record.created_at)}
                </td>
                <td className="px-4 py-4">
                  {meta.comment ? (
                    <div className="flex items-start gap-2 text-xs text-slate-400 max-w-xs">
                      <MessageSquare className="w-3.5 h-3.5 mt-0.5 text-slate-500 shrink-0" />
                      <span className="line-clamp-2">{meta.comment}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-600">None</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
