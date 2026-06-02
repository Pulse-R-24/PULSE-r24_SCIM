import Link from 'next/link'
import { ArrowRight, Radar } from 'lucide-react'
import { PublicIssueHeader } from '@/components/public/PublicIssueHeader'
import type { PublicReportSummary } from '@modules/reports/types'

export function PublicHero({ featured }: { featured?: PublicReportSummary }) {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 lg:px-8 lg:pb-32 lg:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(136,19,55,0.14),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.86),rgba(248,245,239,0))]" />
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
            A forward-looking security intelligence bulletin delivering situational awareness on emerging risks across India&apos;s strategic urban and institutional landscape.
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

        <div className="rounded-[1.6rem] border border-slate-900/10 bg-[#070b24] p-3 shadow-2xl shadow-slate-950/20">
          <div className="relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(136,19,55,0.25),transparent_45%),linear-gradient(135deg,#0d1630,#050814)] p-6 text-white">
            <div className="absolute right-6 top-6 h-36 w-36 rounded-full border border-rose-500/15" />
            <div className="absolute right-14 top-14 h-20 w-20 rounded-full border border-rose-500/20" />
            <div className="absolute inset-x-8 bottom-10 h-px bg-white/10" />
            <div className="absolute bottom-8 left-8 right-8 grid grid-cols-5 gap-2 opacity-40">
              {Array.from({ length: 15 }).map((_, index) => <span key={index} className="h-10 rounded border border-white/10" />)}
            </div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
              <Radar className="h-3.5 w-3.5" /> Bulletin Signal
            </div>
            {featured ? (
              <Link href={`/news/${featured.slug}`} className="group block">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-rose-300">Featured Report</p>
                <h3 className="font-editorial mt-4 text-4xl font-black leading-tight tracking-tight text-white group-hover:text-rose-200">
                  {featured.title}
                </h3>
                <p className="mt-4 line-clamp-4 text-sm leading-7 text-white/60">{featured.excerpt}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                  {featured.category && <span className="text-rose-300">{featured.category.name}</span>}
                  <span>{featured.readTime}</span>
                </div>
              </Link>
            ) : (
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-rose-300">Featured Report</p>
                <h3 className="mt-4 text-3xl font-black tracking-tight text-white">Awaiting published intelligence</h3>
                <p className="mt-4 text-sm leading-7 text-white/55">Reports will appear here after the publisher disseminates them.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
