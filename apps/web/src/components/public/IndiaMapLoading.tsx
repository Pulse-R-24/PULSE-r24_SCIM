import { Loader2 } from 'lucide-react'

export function IndiaMapLoading() {
  return (
    <div className="relative flex h-full min-h-[360px] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-[#06111d] text-white shadow-2xl shadow-slate-950/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(139,0,0,0.12),transparent_34%),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_100%,42px_42px,42px_42px]" />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500/80" />
        <span className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Loading map surface...</span>
      </div>
    </div>
  )
}
