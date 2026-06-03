import Link from 'next/link'
import { ArrowUpRight, Clock } from 'lucide-react'
import type { PublicReportSummary } from '@modules/reports/types'
import { formatPublicDate, getReportHref } from '@/components/public/publicUtils'

export function PublishedReportCard({ report }: { report: PublicReportSummary }) {
  return (
    <Link href={getReportHref(report)} className="group flex flex-col">
      <div className="mb-5 flex h-52 items-center justify-center overflow-hidden rounded-sm bg-[linear-gradient(135deg,#111827,#1f2937)] text-center text-[10px] font-black uppercase tracking-[0.32em] text-white/35 transition group-hover:brightness-110">
        Intelligence Brief
      </div>
      <div className="flex flex-1 flex-col">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em]">
          {report.category && <span className="text-[#8b0000]">{report.category.name}</span>}
          <span className="rounded-sm border border-[#8b0000]/10 bg-[#8b0000]/5 px-1.5 py-0.5 text-[#8b0000]">Public</span>
          <span className="text-slate-400">{formatPublicDate(report.published_at)}</span>
        </div>
        <h3 className="font-editorial line-clamp-3 text-2xl font-black leading-tight tracking-tight text-slate-950 group-hover:text-rose-800">
          {report.title}
        </h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-slate-500">{report.excerpt}</p>
        <div className="mt-5 flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {report.readTime}
          </span>
          <span className="inline-flex items-center gap-3 text-[#8b0000]">
            <span className="h-px w-8 bg-[#8b0000] transition-all group-hover:w-12" />
            Read full brief <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
