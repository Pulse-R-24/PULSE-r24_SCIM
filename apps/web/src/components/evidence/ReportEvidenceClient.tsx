'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { Archive, Trash2 } from 'lucide-react'
import { AttachEvidenceDialog } from '@/components/evidence/AttachEvidenceDialog'
import { EvidenceCard } from '@/components/evidence/EvidenceCard'
import { EvidencePreviewPanel } from '@/components/evidence/EvidencePreviewPanel'
import { EvidenceReportLinkPanel } from '@/components/evidence/EvidenceReportLinkPanel'
import { EvidenceTable } from '@/components/evidence/EvidenceTable'
import { EvidenceUploadDropzone } from '@/components/evidence/EvidenceUploadDropzone'
import { EvidenceUrlForm } from '@/components/evidence/EvidenceUrlForm'
import type { EvidenceRecord } from '@/components/evidence/types'
import { Card, CardContent, CardHeader, CardTitle, EmptyState, Skeleton } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'

const evidenceSchema = z.object({
  id: z.string(),
  reportId: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  mediaId: z.string().nullable().optional(),
  created_at: z.string(),
  media: z.object({
    id: z.string(),
    bucket: z.string(),
    path: z.string(),
    mime_type: z.string(),
    size: z.number(),
    uploadedById: z.string().nullable().optional(),
    created_at: z.string(),
  }).nullable().optional(),
  report: z.object({
    id: z.string(),
    title: z.string(),
    status: z.object({ key: z.string(), label: z.string().nullable().optional() }).nullable().optional(),
    author: z.object({ name: z.string().nullable().optional(), email: z.string() }).nullable().optional(),
  }).nullable().optional(),
  created_by: z.object({ name: z.string().nullable().optional(), email: z.string() }).nullable().optional(),
})
const evidenceListSchema = z.array(evidenceSchema)

async function fetchReportEvidence(reportId: string) {
  const res = await fetch(`/api/reports/${reportId}/evidence`, { cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to load report evidence')
  }
  return evidenceListSchema.parse(await res.json()) as EvidenceRecord[]
}

async function fetchEvidenceLibrary() {
  const res = await fetch('/api/evidence', { cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to load evidence library')
  }
  return evidenceListSchema.parse(await res.json()) as EvidenceRecord[]
}

async function removeEvidence(reportId: string, evidenceId: string) {
  const res = await fetch(`/api/reports/${reportId}/evidence?evidenceId=${evidenceId}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to remove evidence')
  }
  return res.json()
}

export function ReportEvidenceClient({ reportId }: { reportId: string }) {
  const [selectedId, setSelectedId] = useState<string>()
  const queryClient = useQueryClient()

  const reportEvidenceQuery = useQuery({
    queryKey: ['report-evidence', reportId],
    queryFn: () => fetchReportEvidence(reportId),
  })
  const libraryQuery = useQuery({
    queryKey: ['evidence-library'],
    queryFn: fetchEvidenceLibrary,
  })

  const evidence = reportEvidenceQuery.data ?? []
  useEffect(() => {
    if (!selectedId && evidence[0]) setSelectedId(evidence[0].id)
    if (selectedId && !evidence.some((item) => item.id === selectedId)) setSelectedId(evidence[0]?.id)
  }, [evidence, selectedId])

  const selected = evidence.find((item) => item.id === selectedId)
  const report = useMemo(() => selected?.report ?? evidence[0]?.report, [evidence, selected])

  const removeMutation = useMutation({
    mutationFn: (evidenceId: string) => removeEvidence(reportId, evidenceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-evidence', reportId] })
      queryClient.invalidateQueries({ queryKey: ['evidence-library'] })
    },
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-100">Report Evidence</h1>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-1">Evidence Collection and Source Control</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Archive className="w-4 h-4 text-blue-400" /> Attached Evidence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportEvidenceQuery.isLoading && <><Skeleton className="h-24" /><Skeleton className="h-24" /></>}
              {reportEvidenceQuery.isError && <p className="text-sm text-red-400">{(reportEvidenceQuery.error as Error).message}</p>}
              {!reportEvidenceQuery.isLoading && !reportEvidenceQuery.isError && evidence.length === 0 && <EmptyState icon={<Archive className="w-5 h-5" />} title="No evidence attached" description="Attach existing evidence, add a URL, or upload a file." />}
              {evidence.length > 0 && (
                <>
                  <div className="hidden lg:block"><EvidenceTable evidence={evidence} selectedId={selectedId} onSelect={(item) => setSelectedId(item.id)} /></div>
                  <div className="grid grid-cols-1 gap-4 lg:hidden">{evidence.map((item) => <EvidenceCard key={item.id} evidence={item} onSelect={(record) => setSelectedId(record.id)} />)}</div>
                  {selected && (
                    <button type="button" onClick={() => removeMutation.mutate(selected.id)} className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/15">
                      <Trash2 className="w-4 h-4" />
                      Remove Selected Evidence
                    </button>
                  )}
                </>
              )}
              {removeMutation.isError && <p className="text-xs text-red-400">{(removeMutation.error as Error).message}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Attach Evidence</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <AttachEvidenceDialog reportId={reportId} evidence={libraryQuery.data ?? []} attachedIds={evidence.map((item) => item.id)} />
              <EvidenceUrlForm reportId={reportId} />
              <EvidenceUploadDropzone reportId={reportId} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Evidence Timeline</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {evidence.length === 0 && <p className="text-sm text-slate-600">No evidence activity yet.</p>}
              {evidence.map((item) => (
                <div key={item.id} className="rounded-lg border border-white/10 bg-white/[0.025] p-3 text-sm text-slate-300">
                  <span className="font-semibold">{item.title}</span>
                  <span className="text-slate-500"> attached {formatDate(item.created_at)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <EvidencePreviewPanel evidence={selected} />
          <EvidenceReportLinkPanel report={report} />
        </div>
      </div>
    </div>
  )
}
