'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, XCircle, RefreshCcw, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type Action = 'approve' | 'reject' | 'request-changes'
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'

async function postWorkflowAction(action: Action, reportId: string, comment?: string) {
  const endpoint = `/api/reports/workflow/${action}`
  const res = await fetch(endpoint, {
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

interface ReviewActionsProps {
  reportId: string
  reportTitle: string
  onSuccess?: () => void
}

export function ReviewActions({ reportId, reportTitle, onSuccess }: ReviewActionsProps) {
  const queryClient = useQueryClient()
  const [activeAction, setActiveAction] = useState<Action | null>(null)
  const [comment, setComment] = useState('')

  const mutation = useMutation({
    mutationFn: (action: Action) => postWorkflowAction(action, reportId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['report', reportId] })
      queryClient.invalidateQueries({ queryKey: ['workflow-history', reportId] })
      setActiveAction(null)
      setComment('')
      onSuccess?.()
    },
  })

  const actions: { key: Action; label: string; icon: React.ReactNode; variant: ButtonVariant; needsComment: boolean }[] = [
    {
      key: 'approve',
      label: 'Approve',
      icon: <CheckCircle2 className="w-4 h-4" />,
      variant: 'primary' as const,
      needsComment: false,
    },
    {
      key: 'request-changes',
      label: 'Request Changes',
      icon: <RefreshCcw className="w-4 h-4" />,
      variant: 'outline' as const,
      needsComment: true,
    },
    {
      key: 'reject',
      label: 'Reject',
      icon: <XCircle className="w-4 h-4" />,
      variant: 'danger' as const,
      needsComment: true,
    },
  ]

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {actions.map((a) => (
          <Button
            key={a.key}
            variant={a.variant}
            size="sm"
            icon={a.icon}
            onClick={() => setActiveAction(activeAction === a.key ? null : a.key)}
            className={cn(activeAction === a.key && 'ring-1 ring-white/20')}
          >
            {a.label}
          </Button>
        ))}
      </div>

      {/* Inline comment + confirm panel */}
      {activeAction && (
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] space-y-3 animate-fade-in">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>
              {activeAction === 'approve'
                ? `Confirm approval of "${reportTitle}"?`
                : `Leave a comment for "${reportTitle}" (optional for approve, recommended otherwise)`}
            </span>
          </div>

          <textarea
            className="w-full text-sm bg-slate-900/60 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-200
                       placeholder:text-slate-600 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            rows={3}
            placeholder="Add a review comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={activeAction === 'reject' ? 'danger' : activeAction === 'approve' ? 'primary' : 'outline'}
              loading={mutation.isPending}
              onClick={() => mutation.mutate(activeAction)}
            >
              Confirm {actions.find((a) => a.key === activeAction)?.label}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { setActiveAction(null); setComment('') }}
            >
              Cancel
            </Button>

            {mutation.isError && (
              <span className="text-xs text-red-400 ml-2">
                {(mutation.error as Error).message}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
