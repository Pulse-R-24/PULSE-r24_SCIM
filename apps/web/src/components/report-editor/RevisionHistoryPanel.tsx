import { History } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'
import type { ReportRevision } from '@/components/report-editor/types'

export function RevisionHistoryPanel({ revisions }: { revisions: ReportRevision[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          Revisions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {revisions.length === 0 && <p className="text-sm text-slate-600">No revisions yet.</p>}
        {revisions.slice(0, 8).map((revision) => (
          <div key={revision.id} className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
            <p className="text-xs font-semibold text-slate-300">{formatDate(revision.created_at)}</p>
            <p className="mt-1 text-xs text-slate-500">
              {revision.created_by?.name || revision.created_by?.email || 'System'} · {revision.body_markdown.length} chars
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
