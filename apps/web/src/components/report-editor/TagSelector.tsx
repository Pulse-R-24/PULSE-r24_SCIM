import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import type { ReportTagOption } from '@/components/report-editor/types'

interface TagSelectorProps {
  tags: ReportTagOption[]
  selectedNames: string[]
  disabled?: boolean
  onChange: (names: string[]) => void
}

export function TagSelector({ tags, selectedNames, disabled, onChange }: TagSelectorProps) {
  const [draft, setDraft] = useState('')

  function addTag(name: string) {
    const normalized = name.trim()
    if (!normalized || selectedNames.includes(normalized) || disabled) return
    onChange([...selectedNames, normalized])
    setDraft('')
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tags</p>
      <div className="flex gap-2">
        <input suppressHydrationWarning
          value={draft}
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              addTag(draft)
            }
          }}
          placeholder="Add tag"
          className="min-w-0 flex-1 rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200
                     placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-60"
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => addTag(draft)}
          className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-2 text-blue-300 transition-colors hover:bg-blue-500/15 disabled:opacity-60"
          title="Add tag"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedNames.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-300">
            {tag}
            <button type="button" disabled={disabled} onClick={() => onChange(selectedNames.filter((item) => item !== tag))} title={`Remove ${tag}`}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.filter((tag) => !selectedNames.includes(tag.name)).slice(0, 12).map((tag) => (
            <button
              key={tag.id}
              type="button"
              disabled={disabled}
              onClick={() => addTag(tag.name)}
              className="rounded-lg border border-slate-700/70 px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-300 disabled:opacity-60"
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
