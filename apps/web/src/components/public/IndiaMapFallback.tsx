export function IndiaMapFallback({ pmtilesUrl }: { pmtilesUrl?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] bg-[#07101b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_48%,rgba(139,0,0,0.2),transparent_32%),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_100%,44px_44px,44px_44px]" />
      <svg viewBox="0 0 760 520" className="absolute inset-0 h-full w-full opacity-90" aria-hidden="true">
        <path
          d="M190 84 302 30 413 82 480 145 606 188 618 235 585 283 520 302 454 362 400 464 322 470 276 370 252 252 174 184Z"
          fill="#111827"
          stroke="#7b8494"
          strokeWidth="2.5"
        />
        <path d="M302 30 350 120 480 145 M252 252 392 250 520 302 M276 370 400 330 454 362" stroke="#475569" strokeWidth="1" opacity="0.65" />
        <text x="325" y="125" fill="#94a3b8" fontSize="15" letterSpacing="3">DELHI</text>
        <text x="228" y="326" fill="#94a3b8" fontSize="15" letterSpacing="3">MUMBAI</text>
        <text x="394" y="440" fill="#94a3b8" fontSize="15" letterSpacing="3">BENGALURU</text>
        <text x="538" y="258" fill="#94a3b8" fontSize="15" letterSpacing="3">KOLKATA</text>
      </svg>
      <div className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-1 text-[9px] font-bold text-slate-700">
        {pmtilesUrl ? 'MapLibre fallback while PMTiles loads' : 'Set NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL for Protomaps basemap'}
      </div>
    </div>
  )
}
