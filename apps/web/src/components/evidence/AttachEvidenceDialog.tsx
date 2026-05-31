import { Link2, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { EvidenceTypeBadge } from '@/components/evidence/EvidenceTypeBadge'
import type { EvidenceRecord } from '@/components/evidence/types'

interface AttachEvidenceDialogProps {
  reportId: string
  evidence: EvidenceRecord[]
  attachedIds: string[]
}

async function attachExisting(reportId: string, evidenceId: string) {
  const res = await fetch(`/api/reports/${reportId}/evidence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ evidenceId }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to attach evidence')
  }
  return res.json()
}

export function AttachEvidenceDialog({ reportId, evidence, attachedIds }: AttachEvidenceDialogProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const candidates = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return evidence
      .filter((item) => item.reportId !== reportId && !attachedIds.includes(item.id))
      .filter((item) => !needle || item.title.toLowerCase().includes(needle) || item.report?.title.toLowerCase().includes(needle))
      .slice(0, 20)
  }, [attachedIds, evidence, reportId, search])

  const mutation = useMutation({
    mutationFn: (evidenceId: string) => attachExisting(reportId, evidenceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-evidence', reportId] })
      queryClient.invalidateQueries({ queryKey: ['evidence-library'] })
      setOpen(false)
    },
  })

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
      <Button size="sm" variant="outline" icon={<Link2 className="w-4 h-4" />} onClick={() => setOpen((value) => !value)}>
        Attach Existing Evidence
      </Button>

      {open && (
        <div className="mt-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search existing evidence..."
              className="w-full rounded-lg border border-slate-700/60 bg-slate-950/70 pl-10 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-600"
            />
          </div>

          <div className="max-h-80 space-y-2 overflow-y-auto">
            {candidates.length === 0 && <p className="text-sm text-slate-600">No attachable evidence found.</p>}
            {candidates.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-slate-950/40 p-3">
                <div className="min-w-0">
                  <EvidenceTypeBadge evidence={item} />
                  <p className="mt-1 truncate text-sm font-semibold text-slate-100">{item.title}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{item.report?.title || 'No linked report'}</p>
                </div>
                <Button size="sm" loading={mutation.isPending} onClick={() => mutation.mutate(item.id)}>
                  Attach
                </Button>
              </div>
            ))}
          </div>
          {mutation.isError && <p className="text-xs text-red-400">{(mutation.error as Error).message}</p>}
        </div>
      )}
    </div>
  )
}
