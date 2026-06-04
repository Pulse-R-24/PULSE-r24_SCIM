'use client'

import { X } from 'lucide-react'
import type { CitySignal } from '@/components/public/indiaSignalMapData'
import { LiveNewsPopup } from '@/components/public/LiveNewsPopup'

export function MapMobileSheet({
  signal,
  onClose,
}: {
  signal: CitySignal | null
  onClose: () => void
}) {
  if (!signal) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[900] border-t border-slate-200 bg-white p-4 shadow-[0_-18px_50px_rgba(15,23,42,0.22)] md:hidden">
      <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-slate-200" />
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-500"
        aria-label="Close map city updates"
      >
        <X className="h-4 w-4" />
      </button>
      <LiveNewsPopup signal={signal} />
    </div>
  )
}
