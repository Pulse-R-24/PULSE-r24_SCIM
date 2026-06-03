import { Search } from 'lucide-react'

export function PublicSearchInput({ defaultValue = '', action = '/public-search' }: { defaultValue?: string; action?: string }) {
  return (
    <form action={action} className="flex w-full flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input suppressHydrationWarning
          name="q"
          defaultValue={defaultValue}
          placeholder="Search published bulletins..."
          className="w-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#8b0000]/50 focus:ring-4 focus:ring-[#8b0000]/5"
        />
      </div>
      <button className="bg-[#8b0000] px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-white hover:bg-[#600000]">
        Search
      </button>
    </form>
  )
}
