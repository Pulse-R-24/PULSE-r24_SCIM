import Link from 'next/link'
import type { PublicReportSummary } from '@modules/reports/types'
import { getReportHref } from '@/components/public/publicUtils'

export function LivePublishedTicker({ reports }: { reports: PublicReportSummary[] }) {
  if (reports.length === 0) return null
  const items = [...reports, ...reports]

  return (
    <div className="h-12 overflow-hidden border-y border-black bg-black text-white shadow-[0_10px_22px_rgba(15,23,42,0.22)]">
      <div className="flex h-full items-center">
        <div className="z-10 flex h-full shrink-0 items-center bg-black px-4 text-[9px] font-black uppercase tracking-[0.22em] text-emerald-300">
          Live
        </div>
        <div className="animate-public-marquee flex min-w-max items-center whitespace-nowrap">
          {items.map((report, index) => (
            <Link key={`${report.slug}-${index}`} href={getReportHref(report)} className="mx-3 inline-flex items-center gap-3 rounded px-3 py-1 hover:bg-white/10">
              {report.category && <span className="text-[10px] font-black uppercase tracking-[0.18em] text-rose-300">[{report.category.name}]</span>}
              <span className="max-w-md truncate text-sm text-slate-200">{report.title}</span>
              <span className="text-slate-700">{'//'}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
