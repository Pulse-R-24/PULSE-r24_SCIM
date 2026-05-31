import { GitBranch } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, EmptyState, Skeleton } from '@/components/ui/Card'
import { ReviewStatusBadge } from '@/components/assigned/ReviewStatusBadge'
import { WorkflowTimeline } from '@/components/workflow-history/WorkflowTimeline'
import type { WorkflowHistoryRecord } from '@/components/workflow-history/types'

interface WorkflowHistoryPanelProps {
  reportTitle?: string
  currentStatus?: string
  records: WorkflowHistoryRecord[]
  isLoading: boolean
}

export function WorkflowHistoryPanel({ reportTitle, currentStatus, records, isLoading }: WorkflowHistoryPanelProps) {
  return (
    <Card className="lg:sticky lg:top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-emerald-400" />
          Report Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!reportTitle && !isLoading && (
          <EmptyState
            icon={<GitBranch className="w-5 h-5" />}
            title="Select a workflow event"
            description="Choose a report from the history table to inspect its lifecycle."
          />
        )}

        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        )}

        {reportTitle && !isLoading && (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-slate-100">{reportTitle}</p>
              {currentStatus && (
                <div className="mt-2">
                  <ReviewStatusBadge status={currentStatus} />
                </div>
              )}
            </div>
            <WorkflowTimeline records={records} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
