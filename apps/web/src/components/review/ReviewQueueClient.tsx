'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { Search, ClipboardList } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, EmptyState, Skeleton } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { ReviewActions } from '@/components/ReviewActions'
import { cn, formatDate } from '@/lib/utils'

const reportSchema = z.object({
  id: z.string(),
  title: z.string(),
  workflowStateKey: z.string().optional(),
  status: z.object({ key: z.string() }).optional(),
  updated_at: z.string(),
  author: z.object({ name: z.string().nullable().optional(), email: z.string() }).nullable().optional(),
  evidence: z.array(z.unknown()).optional(),
})

const reportArraySchema = z.array(reportSchema)

type QueueFilter = 'ALL' | 'UNDER_REVIEW' | 'CHANGES_REQUESTED' | 'APPROVED'

async function fetchReports() {
  const res = await fetch('/api/reports', { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to load reports')
  }

  const data = await res.json()
  return reportArraySchema.parse(data)
}

export function ReviewQueueClient() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<QueueFilter>('UNDER_REVIEW')

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['reports'],
    queryFn: fetchReports,
  })

  const filtered = useMemo(() => {
    const items = data ?? []
    return items.filter((r) => {
      const status = r.workflowStateKey ?? r.status?.key ?? 'DRAFT'
      const matchesFilter = filter === 'ALL' ? true : status === filter
      const needle = search.trim().toLowerCase()
      const matchesSearch = needle.length === 0
        ? true
        : r.title.toLowerCase().includes(needle)
      return matchesFilter && matchesSearch
    })
  }, [data, filter, search])

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-100">Review Queue</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-1">Editorial Verification Pipeline</p>
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input suppressHydrationWarning
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search report title..."
            className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 pl-10 pr-3 py-2 text-sm
                       text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
      </header>

      <div className="flex items-center gap-2 flex-wrap">
        {(['UNDER_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'ALL'] as QueueFilter[]).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
              filter === k
                ? 'bg-blue-500/15 text-blue-300 border-blue-500/40'
                : 'bg-transparent text-slate-400 border-slate-700/70 hover:text-slate-200'
            )}
          >
            {k.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-blue-400" />
            Queue Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <>
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </>
          )}

          {isError && (
            <p className="text-sm text-red-400">{(error as Error).message}</p>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <EmptyState
              icon={<ClipboardList className="w-5 h-5" />}
              title="No reports in this queue"
              description="Try another status filter or adjust your search query."
            />
          )}

          {!isLoading && !isError && filtered.map((report) => (
            <div key={report.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-slate-100">
                    {report.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Updated {formatDate(report.updated_at)}
                    {report.author?.email ? ` • ${report.author.name || report.author.email}` : ''}
                    {` • Evidence ${report.evidence?.length ?? 0}`}
                  </p>
                </div>
                <StatusBadge status={report.workflowStateKey ?? report.status?.key ?? 'DRAFT'} />
              </div>

              <ReviewActions
                reportId={report.id}
                reportTitle={report.title}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
