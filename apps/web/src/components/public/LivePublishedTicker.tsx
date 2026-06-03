import Link from 'next/link'
import type { PublicReportSummary } from '@modules/reports/types'
import { getIssueNumber, getReportHref } from '@/components/public/publicUtils'

export function LivePublishedTicker({ reports }: { reports: PublicReportSummary[] }) {
  const items = reports.length ? [...reports, ...reports, ...reports] : []

  return (
    <div className="relative h-10 overflow-hidden border-y border-slate-900 bg-black text-white shadow-[0_10px_22px_rgba(15,23,42,0.22)]">
      <div className="flex h-full items-center">
        <div className="z-10 flex h-full shrink-0 items-center border-r border-slate-800 bg-black px-4 text-[9px] font-black uppercase tracking-[0.22em] text-emerald-300">
          Live
        </div>
        {items.length ? <div className="animate-public-marquee flex min-w-max items-center whitespace-nowrap">
          {items.map((report, index) => (
            <Link key={`${report.slug}-${index}`} href={getReportHref(report)} className="mx-3 inline-flex items-center gap-3 rounded px-3 py-1 hover:bg-white/10">
              <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-emerald-300">Published</span>
              {report.category && <span className="text-[10px] font-black uppercase tracking-[0.18em] text-rose-300">[{report.category.name}]</span>}
              <span className="max-w-md truncate text-sm text-slate-200">{report.title}</span>
              <span className="text-slate-700">{'//'}</span>
            </Link>
          ))}
        </div> : (
          <div className="flex min-w-max items-center px-5 text-sm text-slate-300">
            Awaiting published intelligence briefs from the editorial workflow.
          </div>
        )}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden items-center border-l border-slate-800 bg-black/90 px-6 sm:flex">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">{getIssueNumber()}</span>
        </div>
      </div>
    </div>
  )
}
