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
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-rose-800">Public Archive</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Published Intelligence</h1>
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
