import Link from 'next/link'
import { ChevronRight, FileText } from 'lucide-react'
import type { PublicReportSummary } from '@modules/reports/types'
import { formatPublicDate, getReportHref } from '@/components/public/publicUtils'

export function FeaturedPublishedReport({ report }: { report?: PublicReportSummary }) {
  if (!report) return null

  return (
    <section>
      <Link href={getReportHref(report)} className="group grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="flex min-h-72 items-center justify-center overflow-hidden rounded-sm bg-[radial-gradient(circle_at_center,rgba(139,0,0,0.22),transparent_48%),linear-gradient(135deg,#080d20,#111827)] p-8 text-white md:min-h-80">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-rose-300" />
            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.35em] text-white/40">PULSE-R24 Bulletin Asset</p>
          </div>
        </div>
        <div className="py-4">
          <div className="mb-5 flex items-center gap-2">
            <span className="h-px w-8 bg-[#8b0000]" />
            <span className="h-2 w-2 rounded-full bg-[#8b0000]" />
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#8b0000]">Featured Report</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[0.18em]">
            {report.category && <span className="text-rose-800">{report.category.name}</span>}
            <span className="text-slate-400">{formatPublicDate(report.published_at)}</span>
            <span className="rounded-full border border-rose-900/10 bg-rose-50 px-2 py-0.5 text-rose-900">Published</span>
          </div>
          <h2 className="font-editorial mt-5 text-4xl font-black leading-tight tracking-tight text-slate-950 group-hover:text-rose-800 lg:text-5xl">
            {report.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-600">{report.excerpt}</p>
          <div className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-rose-800">
            Read full brief <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </section>
  )
}
