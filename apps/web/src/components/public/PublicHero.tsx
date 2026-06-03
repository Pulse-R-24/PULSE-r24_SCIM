import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PublicIssueHeader } from '@/components/public/PublicIssueHeader'
import type { PublicReportSummary } from '@modules/reports/types'
import { PublicThreatMap } from '@/components/public/PublicThreatMap'

export function PublicHero({ reports }: { reports: PublicReportSummary[] }) {
  return (
    <section className="relative flex min-h-[calc(100vh-6rem)] items-center overflow-hidden bg-white px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,0,0,0.08),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0))]" />
      <div className="absolute left-0 top-20 hidden h-px w-24 bg-rose-900/30 lg:block" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div>
          <div className="mb-7 flex items-center gap-3">
            <span className="h-px w-10 bg-[#8b0000]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#8b0000]" />
            <span className="font-mono text-[10px] font-semibold uppercase leading-tight tracking-[0.28em] text-slate-500">
              WHERE THE NATION&apos;S PULSE MEETS INSIGHTS
            </span>
          </div>
          <h2 className="font-editorial mt-8 max-w-3xl text-6xl font-black leading-[0.88] tracking-tight text-slate-950 sm:text-7xl lg:text-8xl">
            Intelligence,<br />
            <span className="text-[#8b0000]">Risk</span> and<br />
            Resilience
          </h2>
          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600">
            A forward-looking security intelligence bulletin delivering situational awareness on emerging threats across India&apos;s Tier-1 cities.
          </p>
          <div className="mt-8">
            <PublicIssueHeader />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/latest" className="inline-flex items-center gap-2 bg-[#8b0000] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-rose-900/20 hover:bg-[#600000]">
              LATEST BRIEFS <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/public-search" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-700 hover:border-[#8b0000]/30 hover:text-[#8b0000]">
              SEARCH ARCHIVE
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
