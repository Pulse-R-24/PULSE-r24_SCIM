import Link from 'next/link'
import { CalendarDays, ChevronRight } from 'lucide-react'
import type { CitySignalReport } from '@/components/public/indiaSignalMapData'
import { formatPublicDate, getReportHref } from '@/components/public/publicUtils'

export function LiveNewsCard({ report, compact = false }: { report: CitySignalReport; compact?: boolean }) {
  return (
    <article className="grid grid-cols-[4.25rem_minmax(0,1fr)] gap-3 border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex min-h-16 items-center justify-center bg-[radial-gradient(circle_at_center,rgba(139,0,0,0.18),transparent_58%),linear-gradient(135deg,#080d20,#172033)] text-white">
        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-rose-200">Brief</span>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-[#8b0000]">
          <span>Published PULSE-R24 Brief</span>
        </div>
        <h4 className={`mt-1 font-editorial font-black leading-tight text-slate-950 ${compact ? 'text-base' : 'text-lg'}`}>
          {report.title}
        </h4>
        {!compact && <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">{report.excerpt}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {formatPublicDate(report.published_at)}
          </span>
          <span>{report.categoryName}</span>
        </div>
        <Link href={getReportHref(report)} className="mt-2 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#8b0000] hover:text-[#600000]">
          Read brief <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  )
}
