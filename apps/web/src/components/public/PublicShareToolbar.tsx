'use client'

import { useState } from 'react'
import { CheckCheck, Copy, Printer } from 'lucide-react'

export function PublicShareToolbar() {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Share</span>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-900/10 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:border-rose-800/40 hover:text-rose-800"
      >
        {copied ? <CheckCheck className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy link'}
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-900/10 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:border-rose-800/40 hover:text-rose-800"
      >
        <Printer className="h-3.5 w-3.5" /> Print
      </button>
    </div>
  )
}
