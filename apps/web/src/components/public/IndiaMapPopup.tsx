import Link from 'next/link'
import { CalendarDays, ChevronRight } from 'lucide-react'
import type { IndiaCitySignal } from '@/components/public/indiaMapSignals'
import { formatPublicDate } from '@/components/public/publicUtils'

export function IndiaMapPopup({ signal, compact = false }: { signal: IndiaCitySignal; compact?: boolean }) {
  const briefs = signal.briefs.slice(0, 5)

  return (
    <section className={`border border-slate-200 bg-white p-4 text-slate-950 shadow-2xl ${compact ? 'w-full' : 'w-[24rem]'}`}>
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#8b0000]">India City Signal</p>
          <h3 className="font-editorial mt-1 text-3xl font-black leading-none">{signal.city}</h3>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{signal.state}</p>
        </div>
        <div className="border border-[#8b0000]/15 bg-white px-3 py-2 text-center">
          <p className="text-xl font-black text-[#8b0000]">{signal.briefs.length}</p>
          <p className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">Briefs</p>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {briefs.length > 0 ? (
          briefs.map((brief) => (
            <article key={brief.slug} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 border border-slate-200 bg-slate-50 p-2">
              <div className="flex min-h-16 items-center justify-center bg-[radial-gradient(circle_at_center,rgba(139,0,0,0.22),transparent_60%),linear-gradient(135deg,#08111f,#172033)] text-white">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-rose-200">Brief</span>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#8b0000]">Published PULSE-R24 Brief</p>
                <h4 className="font-editorial mt-1 text-lg font-black leading-tight">{brief.title}</h4>
                <p className="mt-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  <CalendarDays className="h-3 w-3" />
                  {formatPublicDate(brief.published_at)} / {brief.categoryName}
                </p>
                <Link href={`/news/${brief.slug}`} className="mt-2 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#8b0000]">
                  Read brief <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))
        ) : (
          <p className="border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
            No published PULSE-R24 briefs are currently mapped to this city.
          </p>
        )}
      </div>
    </section>
  )
}
