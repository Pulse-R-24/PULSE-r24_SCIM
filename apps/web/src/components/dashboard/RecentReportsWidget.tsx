import Link from 'next/link'
import { FileClock, RadioTower } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import type { DashboardReportPreview } from '@/components/dashboard/types'
import { formatDate } from '@/lib/utils'

interface RecentReportsWidgetProps {
  title: string
  mode: 'published' | 'updated'
  reports: DashboardReportPreview[]
}

export function RecentReportsWidget({ title, mode, reports }: RecentReportsWidgetProps) {
  const Icon = mode === 'published' ? RadioTower : FileClock

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-emerald-400" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {reports.length === 0 && <EmptyState title="No reports found" description="This section will populate as the workflow moves." />}
        {reports.map((report) => (
          <Link key={`${mode}-${report.id}`} href={report.href} className="block rounded-lg border border-white/10 bg-white/[0.025] p-3 hover:bg-white/[0.04]">
            <div className="flex items-start justify-between gap-3">
              <p className="line-clamp-2 text-sm font-semibold text-slate-100">{report.title}</p>
              <StatusBadge status={report.status} />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {formatDate(report.updated_at)}{typeof report.evidenceCount === 'number' ? ` • Evidence ${report.evidenceCount}` : ''}
            </p>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
