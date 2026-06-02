import Link from 'next/link'
import { ChevronRight, FileText } from 'lucide-react'
import type { PublicReportSummary } from '@modules/reports/types'
import { formatPublicDate, getReportHref } from '@/components/public/publicUtils'

export function FeaturedPublishedReport({ report }: { report?: PublicReportSummary }) {
  if (!report) return null

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="public-rule-label mb-6">
        <span className="h-px w-10 bg-rose-800" />
        <span className="h-2.5 w-2.5 rounded-full bg-rose-800" />
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">Featured Report</p>
      </div>
      <Link href={getReportHref(report)} className="group grid overflow-hidden border border-slate-900/10 bg-white shadow-xl shadow-slate-950/5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex min-h-72 items-center justify-center bg-[radial-gradient(circle_at_center,rgba(136,19,55,0.22),transparent_48%),linear-gradient(135deg,#080d20,#111827)] p-8 text-white">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-rose-300" />
            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.35em] text-white/40">PULSE-R24 Bulletin Asset</p>
          </div>
        </div>
        <div className="p-8 lg:p-10">
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
            Read intelligence brief <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </section>
  )
}
