import { Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ReviewStatusBadge } from '@/components/assigned/ReviewStatusBadge'

interface ReportWorkflowStatusPanelProps {
  status?: string
  lockedBy?: string
  canSubmit: boolean
  isSubmitting: boolean
  onSubmit: () => void
}

export function ReportWorkflowStatusPanel({
  status = 'DRAFT',
  lockedBy,
  canSubmit,
  isSubmitting,
  onSubmit,
}: ReportWorkflowStatusPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</span>
          <ReviewStatusBadge status={status} />
        </div>

        {lockedBy && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-200">
            Locked by {lockedBy}
          </div>
        )}

        <Button
          size="md"
          className="w-full"
          icon={<Send className="w-4 h-4" />}
          disabled={!canSubmit}
          loading={isSubmitting}
          onClick={onSubmit}
        >
          Submit for Review
        </Button>
      </CardContent>
    </Card>
  )
}
