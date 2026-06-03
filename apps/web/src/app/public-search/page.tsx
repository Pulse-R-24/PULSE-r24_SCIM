import { PublicFilters } from '@/components/public/PublicFilters'
import { PublicLayout } from '@/components/public/PublicLayout'
import { PublishedReportGrid } from '@/components/public/PublishedReportGrid'
import { listPublicReports } from '@modules/reports/services/reportService'

export const metadata = {
  title: 'Public Search | PULSE-R24'
}

export const dynamic = 'force-dynamic'

export default async function PublicSearchPage({ searchParams }: { searchParams?: Promise<{ q?: string }> }) {
  const params = await searchParams
  const q = params?.q?.trim() ?? ''
  const result = await listPublicReports({ q, take: 18 })

  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <div>
          <div className="public-rule-label">
            <span className="h-px w-10 bg-[#8b0000]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#8b0000]" />
            <span>Public Search</span>
          </div>
          <h1 className="font-editorial mt-5 text-5xl font-black tracking-tight text-slate-950">Search Published Reports</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Search only public, published PULSE-R24 reports. Private workflow records and evidence are excluded.
          </p>
        </div>
        <PublicFilters categories={result.categories} query={q} />
        <PublishedReportGrid reports={result.reports} />
      </section>
    </PublicLayout>
  )
}
