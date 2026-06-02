import type { PublicReportSummary } from '@modules/reports/types'

const cityPositions: Record<string, { x: number; y: number }> = {
  delhi: { x: 47, y: 30 },
  mumbai: { x: 32, y: 60 },
  bengaluru: { x: 44, y: 76 },
  chennai: { x: 53, y: 79 },
  hyderabad: { x: 48, y: 65 },
  kolkata: { x: 70, y: 52 },
  pune: { x: 36, y: 63 },
}

function getPoints(reports: PublicReportSummary[]) {
  const points = reports.flatMap((report) => {
    const haystack = [report.title, report.excerpt, report.category?.name, ...report.tags].join(' ').toLowerCase()
    return Object.entries(cityPositions)
      .filter(([city]) => haystack.includes(city))
      .map(([city, position]) => ({ city, position, report }))
  })
  return points.length ? points : reports.slice(0, 5).map((report, index) => ({
    city: 'national',
    position: { x: 30 + index * 12, y: 42 + (index % 2) * 16 },
    report
  }))
}

export function PublicThreatMap({ reports }: { reports: PublicReportSummary[] }) {
  const points = getPoints(reports)

  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-slate-800 bg-[#050814] p-5 text-white shadow-2xl shadow-slate-950/20">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
      <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(190,18,60,0.18),transparent)] blur-sm" />
      <div className="relative h-[340px] rounded-3xl border border-white/10 bg-slate-950/70 md:h-[460px]">
        <div className="absolute left-4 top-4 rounded-xl border border-slate-700/70 bg-slate-950/90 p-3">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
            Published Signal Map
          </div>
          <p className="mt-1 text-[10px] text-slate-500">Visual index of public reports</p>
        </div>
        <div className="absolute inset-10 rounded-[45%] border border-white/10 opacity-50" />
        <div className="absolute left-[30%] top-[24%] text-[10px] uppercase tracking-[0.2em] text-white/20">Delhi</div>
        <div className="absolute left-[26%] top-[60%] text-[10px] uppercase tracking-[0.2em] text-white/20">Mumbai</div>
        <div className="absolute left-[46%] top-[74%] text-[10px] uppercase tracking-[0.2em] text-white/20">Bengaluru</div>
        <div className="absolute right-[20%] top-[48%] text-[10px] uppercase tracking-[0.2em] text-white/20">Kolkata</div>

        {points.map((point, index) => (
          <div
            key={`${point.report.slug}-${index}`}
            className="group absolute"
            style={{ left: `${point.position.x}%`, top: `${point.position.y}%` }}
          >
            <div className="h-4 w-4 rounded-full border border-rose-200 bg-rose-600 shadow-[0_0_24px_rgba(225,29,72,0.75)]" />
            <div className="pointer-events-none absolute left-5 top-0 hidden w-56 rounded-xl border border-white/10 bg-slate-950/95 p-3 text-xs shadow-2xl group-hover:block">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-rose-300">{point.city}</p>
              <p className="mt-1 line-clamp-2 font-semibold text-white">{point.report.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
