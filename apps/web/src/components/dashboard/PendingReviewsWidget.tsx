import Link from 'next/link'
import { ClipboardList } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import type { DashboardReportPreview } from '@/components/dashboard/types'
import { formatDate } from '@/lib/utils'

export function PendingReviewsWidget({ reports }: { reports: DashboardReportPreview[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-blue-400" />
          Pending Review Queue
        </CardTitle>
        <Link href="/dashboard/review-queue" className="text-xs font-semibold text-blue-300 hover:text-blue-200">Open</Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {reports.length === 0 && <EmptyState title="No reports awaiting review" description="The editorial queue is clear." />}
        {reports.map((report) => (
          <Link key={report.id} href={report.href} className="block rounded-lg border border-white/10 bg-white/[0.025] p-3 hover:bg-white/[0.04]">
            <div className="flex items-start justify-between gap-3">
              <p className="line-clamp-2 text-sm font-semibold text-slate-100">{report.title}</p>
              <StatusBadge status={report.status} />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Updated {formatDate(report.updated_at)}{report.author ? ` by ${report.author}` : ''}
            </p>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
