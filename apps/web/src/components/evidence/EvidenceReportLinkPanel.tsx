import Link from 'next/link'
import { FilePenLine } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ReviewStatusBadge } from '@/components/assigned/ReviewStatusBadge'

interface EvidenceReportLinkPanelProps {
  report?: {
    id: string
    title: string
    status?: { key: string } | null
    author?: { name?: string | null; email: string } | null
  } | null
}

export function EvidenceReportLinkPanel({ report }: EvidenceReportLinkPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FilePenLine className="w-4 h-4 text-emerald-400" />
          Linked Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!report && <p className="text-sm text-slate-600">No linked report.</p>}
        {report && (
          <div className="space-y-3">
            <Link href={`/dashboard/reports/${report.id}/edit`} className="block text-sm font-semibold text-blue-300 hover:text-blue-200">
              {report.title}
            </Link>
            {report.status?.key && <ReviewStatusBadge status={report.status.key} />}
            <p className="text-xs text-slate-500">Author: {report.author?.name || report.author?.email || 'Unknown'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
