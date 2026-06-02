import Link from 'next/link'
import { ExternalLink, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ReviewStatusBadge } from '@/components/assigned/ReviewStatusBadge'

interface ReportWorkflowStatusPanelProps {
  status?: string
  lockedBy?: string
  canSubmit: boolean
  isSubmitting: boolean
  onSubmit: () => void
  publicSlug?: string | undefined
}

export function ReportWorkflowStatusPanel({
  status = 'DRAFT',
  lockedBy,
  canSubmit,
  isSubmitting,
  onSubmit,
  publicSlug,
}: ReportWorkflowStatusPanelProps) {
  const canViewPublicReport = status === 'PUBLISHED' && publicSlug

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

        {canViewPublicReport && (
          <Link
            href={`/news/${publicSlug}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:border-rose-400/60 hover:bg-rose-500/20"
          >
            <ExternalLink className="h-4 w-4" />
            View Public Report
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
