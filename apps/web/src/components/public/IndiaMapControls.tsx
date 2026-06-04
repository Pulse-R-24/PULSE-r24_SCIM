import { Home, Maximize2, Minus, Plus } from 'lucide-react'

export function IndiaMapControls({
  onZoomIn,
  onZoomOut,
  onReset,
  onSet2d,
  onSet3d,
}: {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  onSet2d: () => void
  onSet3d: () => void
}) {
  return (
    <>
      <div className="absolute inset-x-4 top-4 z-20 flex items-center justify-between gap-3 rounded border border-white/10 bg-slate-950/88 px-3 py-2 text-white shadow-2xl backdrop-blur-md">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.24em] text-emerald-300">PULSE-R24 India City Signals</p>
          <p suppressHydrationWarning className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-400">
            {new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')} UTC
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={onSet2d} className="map-control-mode">2D</button>
          <button type="button" onClick={onSet3d} className="map-control-mode">3D</button>
          <button type="button" onClick={onReset} className="map-control-icon" aria-label="Reset India map view">
            <Home className="h-3.5 w-3.5" />
          </button>
          <span className="map-control-icon" aria-hidden="true">
            <Maximize2 className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      <div className="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col overflow-hidden rounded border border-white/10 bg-slate-950/88 text-white shadow-2xl backdrop-blur-md">
        <button type="button" onClick={onZoomIn} className="flex h-10 w-10 items-center justify-center border-b border-white/10 hover:bg-white/10" aria-label="Zoom in">
          <Plus className="h-4 w-4" />
        </button>
        <button type="button" onClick={onZoomOut} className="flex h-10 w-10 items-center justify-center border-b border-white/10 hover:bg-white/10" aria-label="Zoom out">
          <Minus className="h-4 w-4" />
        </button>
        <button type="button" onClick={onReset} className="flex h-10 w-10 items-center justify-center hover:bg-white/10" aria-label="Reset map">
          <Home className="h-4 w-4" />
        </button>
      </div>
    </>
  )
}
