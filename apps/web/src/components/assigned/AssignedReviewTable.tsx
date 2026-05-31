import { ReviewStatusBadge } from '@/components/assigned/ReviewStatusBadge'
import { ReviewActionPanel } from '@/components/assigned/ReviewActionPanel'
import { formatDate } from '@/lib/utils'
import type { AssignedReport } from '@/components/assigned/types'

interface AssignedReviewTableProps {
  reports: AssignedReport[]
}

export function AssignedReviewTable({ reports }: AssignedReviewTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-white/[0.03]">
          <tr className="text-left text-slate-400">
            <th className="px-4 py-3 font-semibold">Report</th>
            <th className="px-4 py-3 font-semibold">Assignment</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => {
            const assignment = report.assignments[0]
            return (
              <tr key={report.id} className="border-t border-white/5 align-top">
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-100">{report.title}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Categories: {report.categories.map((c) => c.category.name).join(', ') || 'None'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Tags: {report.tags.map((t) => t.tag.name).join(', ') || 'None'}
                  </p>
                </td>
                <td className="px-4 py-4 text-xs text-slate-400">
                  <p>Assigned: {assignment ? formatDate(assignment.assigned_at) : '-'}</p>
                  <p className="mt-1">Due: {assignment?.due_at ? formatDate(assignment.due_at) : 'Not set'}</p>
                  <p className="mt-1">Reviewer: {assignment?.reviewer?.name || assignment?.reviewer?.email || '-'}</p>
                </td>
                <td className="px-4 py-4">
                  <ReviewStatusBadge status={report.workflowStateKey} />
                  <details className="mt-2">
                    <summary className="text-xs text-blue-300 cursor-pointer">Open report details</summary>
                    <div className="mt-2 text-xs text-slate-400 space-y-1">
                      <p>Author: {report.author?.name || report.author?.email || 'Unknown'}</p>
                      <p>Last Updated: {formatDate(report.updated_at)}</p>
                      <p>Report ID: {report.id}</p>
                    </div>
                  </details>
                </td>
                <td className="px-4 py-4 min-w-[280px]">
                  <ReviewActionPanel reportId={report.id} reportTitle={report.title} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
