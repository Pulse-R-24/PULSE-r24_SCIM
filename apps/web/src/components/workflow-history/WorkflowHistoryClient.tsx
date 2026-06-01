'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { GitBranch } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, EmptyState, Skeleton } from '@/components/ui/Card'
import { WorkflowFilters } from '@/components/workflow-history/WorkflowFilters'
import { WorkflowHistoryPanel } from '@/components/workflow-history/WorkflowHistoryPanel'
import { WorkflowHistoryTable } from '@/components/workflow-history/WorkflowHistoryTable'
import { WorkflowEventCard } from '@/components/workflow-history/WorkflowEventCard'
import type {
  WorkflowActionFilter,
  WorkflowHistoryRecord,
  WorkflowStatusFilter,
} from '@/components/workflow-history/types'

const userSchema = z.object({
  name: z.string().nullable().optional(),
  email: z.string(),
}).nullable().optional()

const workflowHistorySchema = z.object({
  id: z.string(),
  reportId: z.string(),
  action: z.string(),
  actorId: z.string().nullable().optional(),
  actor: userSchema,
  report: z.object({
    id: z.string(),
    title: z.string(),
    status: z.object({
      key: z.string(),
      label: z.string().nullable().optional(),
    }).nullable().optional(),
    author: userSchema,
  }),
  meta: z.union([z.string(), z.record(z.unknown())]).nullable().optional(),
  created_at: z.string(),
})

const workflowHistoryListSchema = z.array(workflowHistorySchema)

interface FetchWorkflowHistoryInput {
  search?: string
  status?: WorkflowStatusFilter
  action?: WorkflowActionFilter
  reportId?: string
}

function buildHistoryUrl(input: FetchWorkflowHistoryInput) {
  const params = new URLSearchParams()
  if (input.search) params.set('search', input.search)
  if (input.status && input.status !== 'ALL') params.set('status', input.status)
  if (input.action && input.action !== 'ALL') params.set('action', input.action)
  if (input.reportId) params.set('reportId', input.reportId)
  const query = params.toString()
  return query ? `/api/workflow-history?${query}` : '/api/workflow-history'
}

async function fetchWorkflowHistory(input: FetchWorkflowHistoryInput) {
  const res = await fetch(buildHistoryUrl(input), { cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to load workflow history')
  }

  return workflowHistoryListSchema.parse(await res.json()) as WorkflowHistoryRecord[]
}

export function WorkflowHistoryClient() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<WorkflowStatusFilter>('ALL')
  const [action, setAction] = useState<WorkflowActionFilter>('ALL')
  const [selectedReportId, setSelectedReportId] = useState<string>()

  const historyQuery = useQuery({
    queryKey: ['workflow-history', { search, status, action }],
    queryFn: () => fetchWorkflowHistory({ search: search.trim(), status, action }),
  })

  const records = useMemo(() => historyQuery.data ?? [], [historyQuery.data])

  useEffect(() => {
    if (records.length === 0) {
      setSelectedReportId(undefined)
      return
    }

    const selectedStillVisible = selectedReportId
      ? records.some((record) => record.reportId === selectedReportId)
      : false

    if (!selectedStillVisible) {
      setSelectedReportId(records[0]?.reportId)
    }
  }, [records, selectedReportId])

  const selectedReport = useMemo(
    () => records.find((record) => record.reportId === selectedReportId)?.report,
    [records, selectedReportId]
  )

  const timelineQuery = useQuery({
    queryKey: ['workflow-history', 'report', selectedReportId],
    queryFn: () => fetchWorkflowHistory({ reportId: selectedReportId }),
    enabled: Boolean(selectedReportId),
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-100">Workflow History</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-1">Report Lifecycle Ledger</p>
        </div>

        <WorkflowFilters
          search={search}
          status={status}
          action={action}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onActionChange={setAction}
        />
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-emerald-400" />
              Workflow Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {historyQuery.isLoading && (
              <>
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </>
            )}

            {historyQuery.isError && (
              <p className="text-sm text-red-400">{(historyQuery.error as Error).message}</p>
            )}

            {!historyQuery.isLoading && !historyQuery.isError && records.length === 0 && (
              <EmptyState
                icon={<GitBranch className="w-5 h-5" />}
                title="No workflow history found"
                description="Adjust the search, status, or action filters."
              />
            )}

            {!historyQuery.isLoading && !historyQuery.isError && records.length > 0 && (
              <>
                <div className="hidden lg:block">
                  <WorkflowHistoryTable
                    records={records}
                    selectedReportId={selectedReportId}
                    onSelectReport={setSelectedReportId}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 lg:hidden">
                  {records.map((record) => (
                    <button
                      key={record.id}
                      type="button"
                      onClick={() => setSelectedReportId(record.reportId)}
                      className="text-left"
                    >
                      <WorkflowEventCard record={record} />
                    </button>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <WorkflowHistoryPanel
          reportTitle={selectedReport?.title}
          currentStatus={selectedReport?.status?.key}
          records={timelineQuery.data ?? []}
          isLoading={timelineQuery.isLoading}
        />
      </div>
    </div>
  )
}
