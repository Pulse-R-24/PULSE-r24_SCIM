'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { Archive, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, EmptyState, Skeleton } from '@/components/ui/Card'
import { EvidenceCard } from '@/components/evidence/EvidenceCard'
import { EvidencePreviewPanel } from '@/components/evidence/EvidencePreviewPanel'
import { EvidenceTable } from '@/components/evidence/EvidenceTable'
import { EvidenceTypeBadge } from '@/components/evidence/EvidenceTypeBadge'
import type { EvidenceRecord, EvidenceTypeFilter } from '@/components/evidence/types'
import { getEvidenceType } from '@/components/evidence/types'
import { cn } from '@/lib/utils'

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

async function fetchEvidence(search: string) {
  const params = new URLSearchParams()
  if (search.trim()) params.set('search', search.trim())
  const res = await fetch(params.toString() ? `/api/evidence?${params}` : '/api/evidence', { cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to load evidence')
  }
  return evidenceListSchema.parse(await res.json()) as EvidenceRecord[]
}

const TYPE_OPTIONS: EvidenceTypeFilter[] = ['ALL', 'FILE', 'IMAGE', 'PDF', 'VIDEO', 'URL', 'DOCUMENT']

export function EvidenceLibraryClient() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState<EvidenceTypeFilter>('ALL')
  const [reportFilter, setReportFilter] = useState('ALL')
  const [selectedId, setSelectedId] = useState<string>()

  const query = useQuery({
    queryKey: ['evidence-library', search],
    queryFn: () => fetchEvidence(search),
  })

  const evidence = useMemo(() => query.data ?? [], [query.data])
  const reportOptions = useMemo(() => {
    const map = new Map<string, string>()
    evidence.forEach((item) => {
      if (item.report) map.set(item.report.id, item.report.title)
    })
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }))
  }, [evidence])

  const filtered = useMemo(() => evidence.filter((item) => {
    const typeMatch = type === 'ALL' || getEvidenceType(item) === type
    const reportMatch = reportFilter === 'ALL' || item.reportId === reportFilter
    return typeMatch && reportMatch
  }), [evidence, reportFilter, type])

  useEffect(() => {
    if (!selectedId && filtered[0]) setSelectedId(filtered[0].id)
    if (selectedId && !filtered.some((item) => item.id === selectedId)) setSelectedId(filtered[0]?.id)
  }, [filtered, selectedId])

  const selected = filtered.find((item) => item.id === selectedId)

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-100">Evidence Library</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-1">Investigation Artifact Index</p>
        </div>
        <div className="space-y-3">
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search evidence, URL, report..." className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 pl-10 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500" />
          </div>
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map((item) => (
              <button key={item} onClick={() => setType(item)} className={cn('rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors', type === item ? 'border-blue-500/40 bg-blue-500/15 text-blue-300' : 'border-slate-700/70 text-slate-400 hover:text-slate-200')}>
                {item === 'ALL' ? 'ALL' : <EvidenceTypeBadge type={item} />}
              </button>
            ))}
          </div>
          <select value={reportFilter} onChange={(event) => setReportFilter(event.target.value)} className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-200">
            <option value="ALL">All linked reports</option>
            {reportOptions.map((report) => <option key={report.id} value={report.id}>{report.title}</option>)}
          </select>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Archive className="w-4 h-4 text-blue-400" /> Evidence Records</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {query.isLoading && <><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /></>}
            {query.isError && <p className="text-sm text-red-400">{(query.error as Error).message}</p>}
            {!query.isLoading && !query.isError && filtered.length === 0 && <EmptyState icon={<Archive className="w-5 h-5" />} title="No evidence found" description="Adjust the search, type, or report filters." />}
            {!query.isLoading && !query.isError && filtered.length > 0 && (
              <>
                <div className="hidden lg:block"><EvidenceTable evidence={filtered} selectedId={selectedId} onSelect={(item) => setSelectedId(item.id)} /></div>
                <div className="grid grid-cols-1 gap-4 lg:hidden">{filtered.map((item) => <EvidenceCard key={item.id} evidence={item} onSelect={(record) => setSelectedId(record.id)} />)}</div>
              </>
            )}
          </CardContent>
        </Card>
        <EvidencePreviewPanel evidence={selected} />
      </div>
    </div>
  )
}
