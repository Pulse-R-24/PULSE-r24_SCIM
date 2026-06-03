import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PublicIssueHeader } from '@/components/public/PublicIssueHeader'
import type { PublicReportSummary } from '@modules/reports/types'
import { PublicThreatMap } from '@/components/public/PublicThreatMap'

export function PublicHero({ reports }: { reports: PublicReportSummary[] }) {
  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] items-center overflow-hidden px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,0,0,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,245,239,0))]" />
      <div className="absolute left-0 top-20 hidden h-px w-24 bg-rose-900/30 lg:block" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div>
          <div className="public-rule-label mb-7">
            <span className="h-px w-10 bg-rose-800" />
            <span className="h-2.5 w-2.5 rounded-full bg-rose-800" />
            <span>Where the nation&apos;s pulse meets insights</span>
          </div>
          <PublicIssueHeader />
          <h2 className="font-editorial mt-8 max-w-3xl text-6xl font-black leading-[0.88] tracking-tight text-slate-950 sm:text-7xl lg:text-8xl">
            Intelligence, <span className="text-rose-900">Risk</span> and Resilience
          </h2>
          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600">
            A forward-looking security intelligence bulletin delivering situational awareness on emerging risks and threats across India&apos;s Tier-1 cities.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/latest" className="inline-flex items-center gap-2 rounded-sm bg-rose-900 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-rose-900/20 hover:bg-rose-800">
              Latest briefs <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/public-search" className="inline-flex items-center gap-2 rounded-sm border border-slate-900/10 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-700 hover:border-rose-800/30 hover:text-rose-800">
              Search archive
            </Link>
          </div>
        </div>

        <div className="relative flex min-h-[420px] items-center justify-center lg:min-h-[520px]">
          <PublicThreatMap reports={reports} compact />
        </div>
      </div>
    </section>
  )
}
