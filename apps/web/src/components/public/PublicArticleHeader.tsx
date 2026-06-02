import Link from 'next/link'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import type { PublicReportDetail } from '@modules/reports/types'
import { formatPublicDate, getIssueNumber } from '@/components/public/publicUtils'
import { PublicShareToolbar } from '@/components/public/PublicShareToolbar'

export function PublicArticleHeader({ report }: { report: PublicReportDetail }) {
  return (
    <header className="border-b border-slate-900/10 bg-white">
      <div className="mx-auto max-w-4xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-rose-800">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/news" className="hover:text-rose-800">Intelligence Brief</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate text-slate-700">{report.title}</span>
        </div>
        <Link href="/news" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-rose-800">
          <ChevronLeft className="h-4 w-4" /> Back to bulletin feed
        </Link>
        <div className="mb-4 flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <span className="h-px w-6 bg-rose-800" />
          <span className="h-1.5 w-1.5 rounded-full bg-rose-800" />
          <span>{getIssueNumber(report.published_at)}</span>
          {report.category && <span className="rounded-full border border-rose-900/10 bg-rose-50 px-3 py-1 text-rose-900">{report.category.name}</span>}
        </div>
        <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">{report.title}</h1>
        <p className="mt-6 border-l-4 border-rose-700 pl-5 text-lg leading-8 text-slate-600">{report.excerpt}</p>
        <div className="mt-7 flex flex-col gap-4 border-t border-slate-900/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            <span>{formatPublicDate(report.published_at)}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {report.readTime}</span>
            <span>{report.byline}</span>
          </div>
          <PublicShareToolbar />
        </div>
      </div>
    </header>
  )
}
