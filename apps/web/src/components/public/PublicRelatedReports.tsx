import type { PublicReportSummary } from '@modules/reports/types'
import { PublishedReportCard } from '@/components/public/PublishedReportCard'

export function PublicRelatedReports({ reports }: { reports: PublicReportSummary[] }) {
  if (reports.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px w-10 bg-rose-800" />
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">Related Intelligence</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {reports.map((report) => <PublishedReportCard key={report.slug} report={report} />)}
      </div>
    </section>
  )
}
