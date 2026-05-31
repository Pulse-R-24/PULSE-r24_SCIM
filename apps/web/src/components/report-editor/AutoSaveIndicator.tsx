import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { SaveState } from '@/components/report-editor/types'

interface AutoSaveIndicatorProps {
  state: SaveState
  lastSavedAt?: Date | null
}

export function AutoSaveIndicator({ state, lastSavedAt }: AutoSaveIndicatorProps) {
  if (state === 'saving') {
    return <span className="inline-flex items-center gap-2 text-xs text-blue-300"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving</span>
  }

  if (state === 'error') {
    return <span className="inline-flex items-center gap-2 text-xs text-red-300"><AlertCircle className="w-3.5 h-3.5" /> Save failed</span>
  }

  if (lastSavedAt) {
    return <span className="inline-flex items-center gap-2 text-xs text-emerald-300"><CheckCircle2 className="w-3.5 h-3.5" /> Saved {formatDate(lastSavedAt)}</span>
  }

  return <span className="text-xs text-slate-600">Not saved yet</span>
}
