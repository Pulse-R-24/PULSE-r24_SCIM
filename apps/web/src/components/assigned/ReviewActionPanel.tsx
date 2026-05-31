'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, RefreshCcw, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ReviewCommentBox } from '@/components/assigned/ReviewCommentBox'
import { cn } from '@/lib/utils'

type Action = 'approve' | 'reject' | 'request-changes'

interface ReviewActionPanelProps {
  reportId: string
  reportTitle: string
}

async function postReviewAction(action: Action, reportId: string, comment: string) {
  const res = await fetch(`/api/reports/workflow/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reportId, comment }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Failed to ${action}`)
  }
  return res.json()
}

export function ReviewActionPanel({ reportId, reportTitle }: ReviewActionPanelProps) {
  const [activeAction, setActiveAction] = useState<Action | null>(null)
  const [comment, setComment] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (action: Action) => postReviewAction(action, reportId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assigned-reviews'] })
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['workflow-history', reportId] })
      setActiveAction(null)
      setComment('')
    },
  })

  const actions: { key: Action; label: string; icon: React.ReactNode; variant: 'primary' | 'outline' | 'danger' }[] = [
    { key: 'approve', label: 'Approve', icon: <CheckCircle2 className="w-4 h-4" />, variant: 'primary' },
    { key: 'request-changes', label: 'Request Changes', icon: <RefreshCcw className="w-4 h-4" />, variant: 'outline' },
    { key: 'reject', label: 'Reject', icon: <XCircle className="w-4 h-4" />, variant: 'danger' },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {actions.map((action) => (
          <Button
            key={action.key}
            size="sm"
            variant={action.variant}
            icon={action.icon}
            onClick={() => setActiveAction((prev) => prev === action.key ? null : action.key)}
            className={cn(activeAction === action.key && 'ring-1 ring-white/20')}
          >
            {action.label}
          </Button>
        ))}
      </div>

      {activeAction && (
        <div className="p-3 rounded-lg border border-white/10 bg-white/[0.03] space-y-2">
          <p className="text-xs text-slate-400">
            {activeAction === 'approve'
              ? `Confirm approval of "${reportTitle}"?`
              : `Add comment before ${activeAction.replace('-', ' ')} for "${reportTitle}".`}
          </p>
          <ReviewCommentBox value={comment} onChange={setComment} />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={activeAction === 'approve' ? 'primary' : activeAction === 'reject' ? 'danger' : 'outline'}
              loading={mutation.isPending}
              onClick={() => mutation.mutate(activeAction)}
            >
              Confirm
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setActiveAction(null)}>
              Cancel
            </Button>
            {mutation.isError && <p className="text-xs text-red-400">{(mutation.error as Error).message}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
