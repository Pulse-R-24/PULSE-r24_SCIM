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
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-rose-800">Public Search</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Search Published Reports</h1>
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
