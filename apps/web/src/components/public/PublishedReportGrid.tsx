import type { PublicReportSummary } from '@modules/reports/types'
import { PublishedReportCard } from '@/components/public/PublishedReportCard'
import { PublicEmptyState } from '@/components/public/PublicEmptyState'

export function PublishedReportGrid({ reports }: { reports: PublicReportSummary[] }) {
  if (reports.length === 0) {
    return <PublicEmptyState title="No published reports found" description="Only published reports appear on the public website." />
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {reports.map((report) => <PublishedReportCard key={report.slug} report={report} />)}
    </div>
  )
}
