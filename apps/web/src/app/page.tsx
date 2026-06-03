import { FeaturedPublishedReport } from '@/components/public/FeaturedPublishedReport'
import { LivePublishedTicker } from '@/components/public/LivePublishedTicker'
import { PublicAboutSection } from '@/components/public/PublicAboutSection'
import { PublicFilters } from '@/components/public/PublicFilters'
import { PublicHero } from '@/components/public/PublicHero'
import { PublicLayout } from '@/components/public/PublicLayout'
import { PublishedReportGrid } from '@/components/public/PublishedReportGrid'
import { listPublicReports } from '@modules/reports/services/reportService'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const result = await listPublicReports({ take: 9 })
  const [featured, ...rest] = result.reports

  return (
    <PublicLayout>
      <PublicHero reports={result.reports.slice(0, 8)} />
      <LivePublishedTicker reports={result.reports.slice(0, 8)} />
      <div id="feed" className="border-b border-slate-200 bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
        <PublicFilters categories={result.categories} />
        </div>
      </div>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center justify-between gap-4">
          <div className="public-rule-label">
            <span className="h-px w-10 bg-[#8b0000]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#8b0000]" />
            <p>Latest Intelligence Briefs</p>
          </div>
          <p className="text-xs font-mono text-slate-400">{result.total} bulletins</p>
        </div>
        <FeaturedPublishedReport report={featured} />
        <div className="mt-12">
        <PublishedReportGrid reports={rest.length ? rest : result.reports} />
        </div>
      </section>
      <PublicAboutSection />
    </PublicLayout>
  )
}
