import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type WorkflowKey =
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'ARCHIVED'

export const WORKFLOW_STATUS_MAP: Record<WorkflowKey, { label: string; css: string; dot: string }> = {
  DRAFT:             { label: 'Draft',             css: 'status-draft',             dot: 'bg-slate-400' },
  UNDER_REVIEW:      { label: 'Under Review',      css: 'status-under-review',      dot: 'bg-blue-400' },
  CHANGES_REQUESTED: { label: 'Changes Requested', css: 'status-changes-requested', dot: 'bg-amber-400' },
  APPROVED:          { label: 'Approved',          css: 'status-approved',          dot: 'bg-emerald-400' },
  PUBLISHED:         { label: 'Published',         css: 'status-published',         dot: 'bg-cyan-400' },
  ARCHIVED:          { label: 'Archived',          css: 'status-archived',          dot: 'bg-zinc-500' },
}

export function getStatusInfo(key: string) {
  return WORKFLOW_STATUS_MAP[key as WorkflowKey] ?? { label: key, css: 'status-draft', dot: 'bg-slate-400' }
}

export function timeAgo(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days  = Math.floor(hours / 24)
  if (days  > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (mins  > 0) return `${mins}m ago`
  return 'just now'
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(typeof date === 'string' ? new Date(date) : date)
}
