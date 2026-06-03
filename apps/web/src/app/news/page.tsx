import { PublicFilters } from '@/components/public/PublicFilters'
import { PublicLayout } from '@/components/public/PublicLayout'
import { PublishedReportGrid } from '@/components/public/PublishedReportGrid'
import { listPublicReports } from '@modules/reports/services/reportService'

export const metadata = {
  title: 'Published Intelligence | PULSE-R24'
}

export const dynamic = 'force-dynamic'

export default async function NewsPage() {
  const result = await listPublicReports({ take: 18 })

  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <div>
          <div className="public-rule-label">
            <span className="h-px w-10 bg-[#8b0000]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#8b0000]" />
            <span>Public Archive</span>
          </div>
          <h1 className="font-editorial mt-5 text-5xl font-black tracking-tight text-slate-950">Published Intelligence</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Browse disseminated PULSE-R24 reports. Draft, review, approved-but-unpublished, and archived reports are excluded.
          </p>
        </div>
        <PublicFilters categories={result.categories} />
        <PublishedReportGrid reports={result.reports} />
      </section>
    </PublicLayout>
  )
}
