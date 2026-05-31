import { Activity, Archive, FileText, GitBranch } from 'lucide-react'
import { EmptySearchState } from '@/components/search/EmptySearchState'
import { SearchResultCard } from '@/components/search/SearchResultCard'
import type { GlobalSearchResult, SearchResultItem } from '@/components/search/types'

const SECTIONS: { key: keyof GlobalSearchResult; label: string; icon: React.ReactNode }[] = [
  { key: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4 text-blue-400" /> },
  { key: 'evidence', label: 'Evidence', icon: <Archive className="w-4 h-4 text-amber-400" /> },
  { key: 'workflow', label: 'Workflow Events', icon: <GitBranch className="w-4 h-4 text-emerald-400" /> },
  { key: 'activity', label: 'Activity Events', icon: <Activity className="w-4 h-4 text-cyan-400" /> },
]

export function SearchResultsList({ results }: { results: GlobalSearchResult }) {
  const total = Object.values(results).reduce((sum, group) => sum + group.length, 0)
  if (total === 0) return <EmptySearchState />

  return (
    <div className="space-y-6">
      {SECTIONS.map((section) => {
        const items = results[section.key] as SearchResultItem[]
        if (items.length === 0) return null
        return (
          <section key={section.key} className="space-y-3">
            <div className="flex items-center gap-2">
              {section.icon}
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{section.label}</h2>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-500">{items.length}</span>
            </div>
            <div className="grid gap-3">
              {items.map((item) => <SearchResultCard key={`${item.type}-${item.id}`} result={item} />)}
            </div>
          </section>
        )
      })}
    </div>
  )
}
