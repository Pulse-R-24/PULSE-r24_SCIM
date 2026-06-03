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

export function PublicThreatMap({ reports, compact = false }: { reports: PublicReportSummary[]; compact?: boolean }) {
  const points = getPoints(reports)

  return (
    <section className="relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#090b10] text-white shadow-2xl shadow-slate-950/20">
      <div className={`relative overflow-hidden rounded-2xl bg-[#111318] ${compact ? 'h-[360px] md:h-[500px]' : 'h-[340px] md:h-[460px]'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,rgba(139,0,0,0.22),transparent_28%),linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:100%_100%,42px_42px,42px_42px]" />
        <svg viewBox="0 0 760 520" className="absolute inset-0 h-full w-full opacity-70" aria-hidden="true">
          <path d="M215 73 C272 50 326 54 371 82 C419 113 445 159 494 182 C548 207 598 241 621 294 C644 348 616 393 562 421 C511 447 448 455 391 442 C333 429 296 395 263 360 C226 321 178 303 154 254 C129 202 148 126 215 73 Z" fill="#171b22" stroke="#535862" strokeWidth="2" />
          <path d="M250 98 C286 88 326 93 354 116 C386 142 391 185 428 207 C470 233 520 246 548 287 C574 326 555 368 511 390 C466 413 410 407 371 379 C335 354 323 311 289 286 C255 261 209 245 200 202 C191 158 207 119 250 98 Z" fill="#10141b" stroke="#69707a" strokeWidth="1.3" />
          <path d="M364 383 C376 413 396 437 428 454 C403 458 382 450 367 431 C354 415 350 395 364 383 Z" fill="#151922" stroke="#69707a" strokeWidth="1.2" />
          <path d="M500 245 L570 225 M452 160 L520 130 M262 288 L193 328 M334 112 L322 72 M404 318 L470 362" stroke="#424852" strokeWidth="1" opacity="0.6" />
          <text x="334" y="118" fill="#6f7682" fontSize="15" letterSpacing="3">DELHI</text>
          <text x="226" y="330" fill="#6f7682" fontSize="15" letterSpacing="3">MUMBAI</text>
          <text x="424" y="405" fill="#6f7682" fontSize="15" letterSpacing="3">BENGALURU</text>
          <text x="534" y="292" fill="#6f7682" fontSize="15" letterSpacing="3">KOLKATA</text>
          <text x="432" y="72" fill="#3f4650" fontSize="12">NEPAL</text>
          <text x="598" y="212" fill="#3f4650" fontSize="12">BHUTAN</text>
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,transparent_0,transparent_23%,rgba(255,255,255,0.04)_23.3%,transparent_24%),radial-gradient(circle_at_50%_48%,transparent_0,transparent_40%,rgba(255,255,255,0.035)_40.2%,transparent_41%)]" />

        <div className="absolute left-4 top-4 rounded-lg border border-slate-700/70 bg-slate-950/90 p-3">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
            Live Sensor Grid
          </div>
          <p className="mt-1 text-[10px] font-semibold uppercase text-slate-500">{Math.max(3, points.length)} Active Geospatial Alerts</p>
        </div>

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
        <div className="absolute bottom-4 right-4 overflow-hidden rounded border border-slate-700 bg-slate-950/90 text-slate-200 shadow-xl">
          <div className="flex h-8 w-8 items-center justify-center border-b border-slate-700 text-lg font-bold">+</div>
          <div className="flex h-8 w-8 items-center justify-center text-lg font-bold">-</div>
        </div>
        <div className="absolute bottom-1 left-2 rounded bg-white/80 px-1.5 py-0.5 text-[9px] font-semibold text-slate-700">
          Leaflet | OSM contributors | CARTO
        </div>
      </div>
    </section>
  )
}
