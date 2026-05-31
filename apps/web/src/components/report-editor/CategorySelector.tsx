import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReportCategoryOption } from '@/components/report-editor/types'

interface CategorySelectorProps {
  categories: ReportCategoryOption[]
  selectedIds: string[]
  disabled?: boolean
  onChange: (ids: string[]) => void
}

export function CategorySelector({ categories, selectedIds, disabled, onChange }: CategorySelectorProps) {
  function toggle(id: string) {
    if (disabled) return
    onChange(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id])
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Categories</p>
      <div className="flex flex-wrap gap-2">
        {categories.length === 0 && <p className="text-xs text-slate-600">No categories configured yet.</p>}
        {categories.map((category) => {
          const selected = selectedIds.includes(category.id)
          return (
            <button
              key={category.id}
              type="button"
              disabled={disabled}
              onClick={() => toggle(category.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60',
                selected
                  ? 'border-blue-500/40 bg-blue-500/15 text-blue-300'
                  : 'border-slate-700/70 text-slate-400 hover:text-slate-200'
              )}
            >
              {selected && <Check className="w-3 h-3" />}
              {category.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
