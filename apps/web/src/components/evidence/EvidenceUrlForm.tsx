import { Link2, Plus } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'

interface EvidenceUrlFormProps {
  reportId: string
  disabled?: boolean
}

async function addUrlEvidence(reportId: string, input: { title: string; url: string; description?: string }) {
  const res = await fetch(`/api/reports/${reportId}/evidence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to add URL evidence')
  }
  return res.json()
}

export function EvidenceUrlForm({ reportId, disabled }: EvidenceUrlFormProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => addUrlEvidence(reportId, { title, url, description }),
    onSuccess: () => {
      setTitle('')
      setUrl('')
      setDescription('')
      queryClient.invalidateQueries({ queryKey: ['report-evidence', reportId] })
      queryClient.invalidateQueries({ queryKey: ['evidence-library'] })
    },
  })

  return (
    <div className="space-y-3 rounded-lg border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
        <Link2 className="w-4 h-4 text-blue-400" />
        URL Evidence
      </div>
      <input suppressHydrationWarning value={title} disabled={disabled} onChange={(event) => setTitle(event.target.value)} placeholder="Evidence title" className="w-full rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600" />
      <input suppressHydrationWarning value={url} disabled={disabled} onChange={(event) => setUrl(event.target.value)} placeholder="https://source.example/item" className="w-full rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600" />
      <textarea suppressHydrationWarning value={description} disabled={disabled} onChange={(event) => setDescription(event.target.value)} placeholder="Evidence note" rows={3} className="w-full resize-none rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600" />
      <Button size="sm" icon={<Plus className="w-4 h-4" />} disabled={disabled || !title.trim() || !url.trim()} loading={mutation.isPending} onClick={() => mutation.mutate()}>
        Add URL Evidence
      </Button>
      {mutation.isError && <p className="text-xs text-red-400">{(mutation.error as Error).message}</p>}
    </div>
  )
}
