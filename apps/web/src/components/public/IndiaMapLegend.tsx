export function IndiaMapLegend() {
  return (
    <div className="absolute inset-x-4 bottom-4 z-20 hidden items-center justify-between gap-4 rounded border border-white/10 bg-slate-950/88 px-4 py-2 text-white shadow-2xl backdrop-blur-md md:flex">
      <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-400">Published PULSE-R24 Brief</p>
      <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">
        <LegendItem color="bg-slate-500" label="No current brief" />
        <LegendItem color="bg-emerald-400" label="Low" />
        <LegendItem color="bg-amber-400" label="Elevated" />
        <LegendItem color="bg-[#8b0000]" label="High" />
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </span>
  )
}
