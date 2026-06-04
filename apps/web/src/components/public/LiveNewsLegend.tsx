export function LiveNewsLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-[440] hidden rounded border border-white/10 bg-slate-950/90 p-3 text-white shadow-2xl md:block">
      <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-400">Marker Intensity</p>
      <div className="mt-2 grid gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">
        <LegendItem color="bg-slate-500" label="No current brief" />
        <LegendItem color="bg-emerald-400" label="Low" />
        <LegendItem color="bg-amber-400" label="Medium" />
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
