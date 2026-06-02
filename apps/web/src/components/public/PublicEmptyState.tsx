import { FileSearch } from 'lucide-react'

export function PublicEmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-900/15 bg-white/70 px-6 py-16 text-center">
      <FileSearch className="mx-auto h-10 w-10 text-slate-300" />
      <h3 className="mt-4 text-lg font-black text-slate-900">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>}
    </div>
  )
}
