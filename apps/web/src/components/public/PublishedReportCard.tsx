import Link from 'next/link'
import { ArrowUpRight, Clock } from 'lucide-react'
import type { PublicReportSummary } from '@modules/reports/types'
import { formatPublicDate, getReportHref } from '@/components/public/publicUtils'

export function PublishedReportCard({ report }: { report: PublicReportSummary }) {
  return (
    <Link href={getReportHref(report)} className="group block overflow-hidden rounded-2xl border border-slate-900/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-rose-800/25 hover:shadow-xl">
      <div className="h-2 bg-gradient-to-r from-rose-900 via-rose-700 to-slate-900" />
      <div className="p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em]">
          {report.category && <span className="text-rose-800">{report.category.name}</span>}
          <span className="text-slate-400">{formatPublicDate(report.published_at)}</span>
        </div>
        <h3 className="line-clamp-3 text-xl font-black leading-tight tracking-tight text-slate-950 group-hover:text-rose-800">
          {report.title}
        </h3>
        <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-600">{report.excerpt}</p>
        <div className="mt-6 flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {report.readTime}
          </span>
          <span className="inline-flex items-center gap-1.5 text-rose-800">
            Read brief <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
