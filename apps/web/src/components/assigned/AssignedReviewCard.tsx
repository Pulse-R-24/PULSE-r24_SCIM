import { ReviewStatusBadge } from '@/components/assigned/ReviewStatusBadge'
import { ReviewActionPanel } from '@/components/assigned/ReviewActionPanel'
import { formatDate } from '@/lib/utils'
import type { AssignedReport } from '@/components/assigned/types'

interface AssignedReviewCardProps {
  report: AssignedReport
  assignmentId: string
}

export function AssignedReviewCard({ report, assignmentId }: AssignedReviewCardProps) {
  const assignment = report.assignments.find((a) => a.id === assignmentId)

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-slate-100">{report.title}</p>
          <p className="text-xs text-slate-500 mt-1">
            Assigned {assignment ? formatDate(assignment.assigned_at) : '-'}
            {assignment?.due_at ? ` • Due ${formatDate(assignment.due_at)}` : ' • Due: Not set'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Categories: {report.categories.map((c) => c.category.name).join(', ') || 'None'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Tags: {report.tags.map((t) => t.tag.name).join(', ') || 'None'}
          </p>
        </div>
        <ReviewStatusBadge status={report.workflowStateKey} />
      </div>

      <ReviewActionPanel reportId={report.id} reportTitle={report.title} />
      <details>
        <summary className="text-xs text-blue-300 cursor-pointer">Open report details</summary>
        <div className="mt-2 text-xs text-slate-400 space-y-1">
          <p>Author: {report.author?.name || report.author?.email || 'Unknown'}</p>
          <p>Last Updated: {formatDate(report.updated_at)}</p>
          <p>Report ID: {report.id}</p>
        </div>
      </details>
    </div>
  )
}
