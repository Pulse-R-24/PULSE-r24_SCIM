import { WorkflowEventCard } from '@/components/workflow-history/WorkflowEventCard'
import type { WorkflowHistoryRecord } from '@/components/workflow-history/types'

export function WorkflowTimeline({ records }: { records: WorkflowHistoryRecord[] }) {
  const sorted = [...records].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  if (sorted.length === 0) {
    return <p className="py-6 text-sm text-slate-600">No workflow events recorded.</p>
  }

  return (
    <div className="relative space-y-4">
      {sorted.map((record, index) => (
        <div key={record.id} className="relative pl-7">
          {index < sorted.length - 1 && (
            <div className="absolute left-[7px] top-6 bottom-[-20px] w-px bg-gradient-to-b from-blue-500/40 to-transparent" />
          )}
          <div className="absolute left-0 top-5 h-3.5 w-3.5 rounded-full border border-blue-400/50 bg-blue-500/20" />
          <WorkflowEventCard record={record} />
        </div>
      ))}
    </div>
  )
}
