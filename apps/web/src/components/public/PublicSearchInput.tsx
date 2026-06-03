import { Search } from 'lucide-react'

export function PublicSearchInput({ defaultValue = '', action = '/public-search' }: { defaultValue?: string; action?: string }) {
  return (
    <form action={action} className="grid w-full gap-3 bg-white md:grid-cols-[minmax(0,1fr)_180px_auto_180px_auto] md:items-center">
      <div className="relative min-w-0">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          suppressHydrationWarning
          name="q"
          defaultValue={defaultValue}
          placeholder="Search bulletins..."
          className="h-12 w-full border border-slate-300 bg-white pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#8b0000] focus:ring-2 focus:ring-[#8b0000]/10"
        />
      </div>
      <input
        suppressHydrationWarning
        aria-label="From date"
        name="from"
        type="date"
        className="h-12 border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-600 outline-none focus:border-[#8b0000] focus:ring-2 focus:ring-[#8b0000]/10"
      />
      <span className="hidden text-center text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 md:block">to</span>
      <input
        suppressHydrationWarning
        aria-label="To date"
        name="to"
        type="date"
        className="h-12 border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-600 outline-none focus:border-[#8b0000] focus:ring-2 focus:ring-[#8b0000]/10"
      />
      <button className="h-12 bg-[#8b0000] px-8 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#600000]">
        SEARCH
      </button>
    </form>
  )
}
