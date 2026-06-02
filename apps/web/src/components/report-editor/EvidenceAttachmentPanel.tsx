import { ExternalLink, Link2, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { ReportEvidence } from '@/components/report-editor/types'

interface EvidenceAttachmentPanelProps {
  reportId?: string
  evidence: ReportEvidence[]
  disabled?: boolean
}

async function attachEvidence(reportId: string, input: { title: string; description?: string; url?: string }) {
  const res = await fetch(`/api/reports/${reportId}/evidence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to attach evidence')
  }
  return res.json()
}

async function removeEvidence(reportId: string, evidenceId: string) {
  const res = await fetch(`/api/reports/${reportId}/evidence?evidenceId=${evidenceId}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to remove evidence')
  }
  return res.json()
}

export function EvidenceAttachmentPanel({ reportId, evidence, disabled }: EvidenceAttachmentPanelProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const queryClient = useQueryClient()

  const attachMutation = useMutation({
    mutationFn: () => attachEvidence(reportId || '', { title, url, description }),
    onSuccess: () => {
      setTitle('')
      setUrl('')
      setDescription('')
      queryClient.invalidateQueries({ queryKey: ['report', reportId] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: (evidenceId: string) => removeEvidence(reportId || '', evidenceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['report', reportId] }),
  })

  const canAttach = Boolean(reportId && title.trim())

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-blue-400" />
          Evidence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!reportId && (
          <p className="rounded-lg border border-white/10 bg-white/[0.025] p-3 text-xs text-slate-500">
            Save the report before attaching evidence.
          </p>
        )}

        <div className="space-y-2">
          <input suppressHydrationWarning
            value={title}
            disabled={disabled || !reportId}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Evidence title"
            className="w-full rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 disabled:opacity-60"
          />
          <input suppressHydrationWarning
            value={url}
            disabled={disabled || !reportId}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Evidence URL"
            className="w-full rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 disabled:opacity-60"
          />
          <textarea suppressHydrationWarning
            value={description}
            disabled={disabled || !reportId}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Evidence note"
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 disabled:opacity-60"
          />
          <Button
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            disabled={!canAttach || disabled}
            loading={attachMutation.isPending}
            onClick={() => attachMutation.mutate()}
          >
            Attach Evidence
          </Button>
        </div>

        <div className="space-y-2">
          {reportId && (
            <Link href={`/dashboard/reports/${reportId}/evidence`} className="inline-flex text-xs font-semibold text-blue-300 hover:text-blue-200">
              Open evidence workspace
            </Link>
          )}
          {evidence.length === 0 && <p className="text-sm text-slate-600">No evidence attached.</p>}
          {evidence.map((item) => (
            <div key={item.id} className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-blue-300">
                      <ExternalLink className="w-3 h-3" />
                      {item.url}
                    </a>
                  )}
                  {item.description && <p className="mt-2 text-xs text-slate-500">{item.description}</p>}
                </div>
                <button
                  type="button"
                  disabled={disabled || removeMutation.isPending}
                  onClick={() => removeMutation.mutate(item.id)}
                  className="rounded-md p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-60"
                  title="Remove evidence"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {(attachMutation.isError || removeMutation.isError) && (
          <p className="text-xs text-red-400">{((attachMutation.error || removeMutation.error) as Error).message}</p>
        )}
      </CardContent>
    </Card>
  )
}
