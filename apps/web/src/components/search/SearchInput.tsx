import { Search } from 'lucide-react'

export function SearchInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
      <input suppressHydrationWarning
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search reports, evidence, workflow, activity..."
        className="w-full rounded-lg border border-slate-700/60 bg-slate-950/70 py-3 pl-12 pr-4 text-base text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      />
    </div>
  )
}
