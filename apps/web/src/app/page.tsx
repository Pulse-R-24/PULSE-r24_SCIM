import { FeaturedPublishedReport } from '@/components/public/FeaturedPublishedReport'
import { LivePublishedTicker } from '@/components/public/LivePublishedTicker'
import { PublicFilters } from '@/components/public/PublicFilters'
import { PublicHero } from '@/components/public/PublicHero'
import { PublicLayout } from '@/components/public/PublicLayout'
import { PublishedReportGrid } from '@/components/public/PublishedReportGrid'
import { PublicThreatMap } from '@/components/public/PublicThreatMap'
import { listPublicReports } from '@modules/reports/services/reportService'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const result = await listPublicReports({ take: 9 })
  const [featured, ...rest] = result.reports

  return (
    <PublicLayout>
      <PublicHero featured={featured} />
      <LivePublishedTicker reports={result.reports.slice(0, 8)} />
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        <PublicThreatMap reports={result.reports.slice(0, 8)} />
        <PublicFilters categories={result.categories} />
      </div>
      <FeaturedPublishedReport report={featured} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-rose-800" />
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">Published Intelligence</p>
          </div>
          <p className="text-xs font-mono text-slate-400">{result.total} bulletins</p>
        </div>
        <PublishedReportGrid reports={rest.length ? rest : result.reports} />
      </section>
    </PublicLayout>
  )
}
