import type { CitySignal } from '@/components/public/indiaSignalMapData'
import { LiveNewsCard } from '@/components/public/LiveNewsCard'

export function LiveNewsPopup({ signal }: { signal: CitySignal }) {
  const reports = signal.reports.slice(0, 5)

  return (
    <div className="w-full max-w-sm border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#8b0000]">India City Signal</p>
          <h3 className="mt-1 font-editorial text-2xl font-black leading-none text-slate-950">{signal.city}</h3>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{signal.state}</p>
        </div>
        <div className="border border-[#8b0000]/15 bg-white px-2 py-1 text-right">
          <p className="text-lg font-black text-[#8b0000]">{reports.length}</p>
          <p className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">Briefs</p>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {reports.length > 0 ? (
          reports.map((report) => <LiveNewsCard key={report.slug} report={report} compact />)
        ) : (
          <p className="border border-dashed border-slate-300 bg-white p-4 text-sm leading-6 text-slate-500">
            No published PULSE-R24 briefs are currently mapped to this city.
          </p>
        )}
      </div>
    </div>
  )
}
