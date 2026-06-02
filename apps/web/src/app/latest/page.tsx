import { LivePublishedTicker } from '@/components/public/LivePublishedTicker'
import { PublicLayout } from '@/components/public/PublicLayout'
import { PublishedReportGrid } from '@/components/public/PublishedReportGrid'
import { listPublicReports } from '@modules/reports/services/reportService'

export const metadata = {
  title: 'Latest Intelligence | PULSE-R24'
}

export const dynamic = 'force-dynamic'

export default async function LatestPage() {
  const result = await listPublicReports({ take: 12 })

  return (
    <PublicLayout>
      <LivePublishedTicker reports={result.reports.slice(0, 8)} />
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-rose-800">Latest</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Latest Published Briefs</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Newest public reports disseminated through the PULSE-R24 workflow.</p>
        </div>
        <PublishedReportGrid reports={result.reports} />
      </section>
    </PublicLayout>
  )
}
