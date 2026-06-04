import { MapPinned, ServerCog } from 'lucide-react'

export function IndiaMapFallback({ activeCount }: { activeCount: number }) {
  return (
    <div className="relative flex h-full min-h-[360px] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-[#07101b] text-white shadow-2xl shadow-slate-950/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(139,0,0,0.22),transparent_34%),linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:100%_100%,42px_42px,42px_42px]" />
      <div className="absolute inset-x-4 top-4 flex items-center justify-between rounded border border-white/10 bg-slate-950/88 px-3 py-2 backdrop-blur-md">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.24em] text-emerald-300">PULSE-R24 India City Signals</p>
          <p suppressHydrationWarning className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-400">
            {new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')} UTC
          </p>
        </div>
        <div className="rounded border border-white/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-slate-300">Tiles offline</div>
      </div>
      <div className="relative z-10 mx-6 max-w-md border border-white/10 bg-slate-950/88 p-6 text-center shadow-2xl backdrop-blur-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#8b0000]/35 bg-[#8b0000]/15 text-rose-200">
          <MapPinned className="h-6 w-6" />
        </div>
        <h3 className="font-editorial mt-5 text-3xl font-black leading-tight">Map tiles are not configured.</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Set <span className="font-mono text-rose-200">NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL</span> to enable the live India map.
        </p>
        <div className="mt-5 grid gap-2 border-t border-white/10 pt-5 text-left text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
          <span className="flex items-center gap-2"><ServerCog className="h-4 w-4 text-emerald-300" /> Protomaps PMTiles required</span>
          <span>{activeCount} published PULSE-R24 briefs ready for city markers</span>
          <span>No external news feeds or paid API keys are used</span>
        </div>
      </div>
    </div>
  )
}
