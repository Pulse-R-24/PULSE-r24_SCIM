'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { Search, UserCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, EmptyState, Skeleton } from '@/components/ui/Card'
import { AssignedReviewTable } from '@/components/assigned/AssignedReviewTable'
import { AssignedReviewCard } from '@/components/assigned/AssignedReviewCard'
import type { AssignedReport, AssignedStatusFilter } from '@/components/assigned/types'
import { cn } from '@/lib/utils'

const reportSchema = z.object({
  id: z.string(),
  title: z.string(),
  updated_at: z.string(),
  workflowStateKey: z.string().optional(),
  status: z.object({ key: z.string() }).optional(),
  author: z.object({ name: z.string().nullable().optional(), email: z.string() }).nullable().optional(),
  categories: z.array(z.object({ category: z.object({ name: z.string() }) })).default([]),
  tags: z.array(z.object({ tag: z.object({ name: z.string() }) })).default([]),
  assignments: z.array(z.object({
    id: z.string(),
    reviewerId: z.string(),
    assigned_at: z.string(),
    completed_at: z.string().nullable().optional(),
    due_at: z.string().nullable().optional(),
    reviewer: z.object({ id: z.string(), name: z.string().nullable().optional(), email: z.string() }).nullable().optional(),
  })).default([]),
})
const reportsSchema = z.array(reportSchema)

async function fetchAssignedReviews() {
  const res = await fetch('/api/reports?assignedToMe=true', { cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to load assigned reviews')
  }
  const parsed = reportsSchema.parse(await res.json())
  return parsed.map((r) => ({
    ...r,
    workflowStateKey: r.workflowStateKey ?? r.status?.key ?? 'DRAFT',
  })) as AssignedReport[]
}

export function AssignedReviewsClient() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<AssignedStatusFilter>('UNDER_REVIEW')

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['assigned-reviews'],
    queryFn: fetchAssignedReviews,
  })

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return (data ?? []).filter((report) => {
      const statusMatch = statusFilter === 'ALL' ? true : report.workflowStateKey === statusFilter
      if (!statusMatch) return false
      if (!query) return true

      const title = report.title.toLowerCase()
      const categories = report.categories.map((c) => c.category.name.toLowerCase()).join(' ')
      const tags = report.tags.map((t) => t.tag.name.toLowerCase()).join(' ')
      return title.includes(query) || categories.includes(query) || tags.includes(query)
    })
  }, [data, search, statusFilter])

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-100">Assigned Reviews</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-1">Reviewer Workbench</p>
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, category, tag..."
            className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 pl-10 pr-3 py-2 text-sm
                       text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
      </header>

      <div className="flex items-center gap-2 flex-wrap">
        {(['UNDER_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'ALL'] as AssignedStatusFilter[]).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
              statusFilter === status
                ? 'bg-blue-500/15 text-blue-300 border-blue-500/40'
                : 'bg-transparent text-slate-400 border-slate-700/70 hover:text-slate-200'
            )}
          >
            {status.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            Assigned Report Queue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <>
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </>
          )}

          {isError && <p className="text-sm text-red-400">{(error as Error).message}</p>}

          {!isLoading && !isError && filtered.length === 0 && (
            <EmptyState
              icon={<UserCheck className="w-5 h-5" />}
              title="No assigned reviews found"
              description="Try a different status filter or search term."
            />
          )}

          {!isLoading && !isError && filtered.length > 0 && (
            <>
              <div className="hidden lg:block">
                <AssignedReviewTable reports={filtered} />
              </div>
              <div className="grid grid-cols-1 gap-4 lg:hidden">
                {filtered.map((report) => (
                  <AssignedReviewCard key={report.id} report={report} assignmentId={report.assignments[0]?.id || ''} />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
