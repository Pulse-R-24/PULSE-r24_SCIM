'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { Save } from 'lucide-react'
import { AutoSaveIndicator } from '@/components/report-editor/AutoSaveIndicator'
import { CategorySelector } from '@/components/report-editor/CategorySelector'
import { EvidenceAttachmentPanel } from '@/components/report-editor/EvidenceAttachmentPanel'
import { ReportMarkdownEditor } from '@/components/report-editor/ReportMarkdownEditor'
import { ReportTitleInput } from '@/components/report-editor/ReportTitleInput'
import { ReportWorkflowStatusPanel } from '@/components/report-editor/ReportWorkflowStatusPanel'
import { RevisionHistoryPanel } from '@/components/report-editor/RevisionHistoryPanel'
import { TagSelector } from '@/components/report-editor/TagSelector'
import { UnsavedChangesGuard } from '@/components/report-editor/UnsavedChangesGuard'
import type {
  ReportCategoryOption,
  ReportEditorDraft,
  ReportEditorRecord,
  ReportTagOption,
  SaveState,
} from '@/components/report-editor/types'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/components/ui/Card'

const reportSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  body_markdown: z.string(),
  updated_at: z.string(),
  lockedById: z.string().nullable().optional(),
  locked_at: z.string().nullable().optional(),
  locked_by: z.object({ name: z.string().nullable().optional(), email: z.string() }).nullable().optional(),
  status: z.object({ key: z.string(), label: z.string().nullable().optional() }).nullable().optional(),
  categories: z.array(z.object({ category: z.object({ id: z.string(), name: z.string() }) })).default([]),
  tags: z.array(z.object({ tag: z.object({ id: z.string(), name: z.string() }) })).default([]),
  evidence: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable().optional(),
    url: z.string().nullable().optional(),
    created_at: z.string(),
  })).default([]),
  revisions: z.array(z.object({
    id: z.string(),
    summary: z.string().nullable().optional(),
    body_markdown: z.string(),
    created_at: z.string(),
    created_by: z.object({ name: z.string().nullable().optional(), email: z.string() }).nullable().optional(),
  })).default([]),
})

const taxonomySchema = z.object({
  categories: z.array(z.object({ id: z.string(), name: z.string() })).default([]),
  tags: z.array(z.object({ id: z.string(), name: z.string() })).default([]),
})

async function fetchReport(reportId: string) {
  const res = await fetch(`/api/reports?id=${reportId}`, { cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to load report')
  }
  return reportSchema.parse(await res.json()) as ReportEditorRecord
}

async function fetchTaxonomy() {
  const res = await fetch('/api/reports/taxonomy', { cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to load taxonomy')
  }
  return taxonomySchema.parse(await res.json()) as { categories: ReportCategoryOption[]; tags: ReportTagOption[] }
}

async function saveReport(reportId: string | undefined, draft: ReportEditorDraft) {
  const payload = { ...draft, status: 'DRAFT' }
  const res = await fetch('/api/reports', {
    method: reportId ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reportId ? { ...payload, reportId } : payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to save report')
  }
  return reportSchema.parse(await res.json()) as ReportEditorRecord
}

async function submitReport(reportId: string) {
  const res = await fetch('/api/reports/workflow/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reportId }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to submit report')
  }
  return res.json()
}

async function acquireLock(reportId: string) {
  const res = await fetch(`/api/reports/${reportId}/lock`, { method: 'POST' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to acquire edit lock')
  }
  return res.json()
}

function releaseLock(reportId: string) {
  void fetch(`/api/reports/${reportId}/lock`, { method: 'DELETE' })
}

function draftFromReport(report?: ReportEditorRecord): ReportEditorDraft {
  return {
    title: report?.title ?? '',
    body_markdown: report?.body_markdown ?? '',
    categoryIds: report?.categories.map((item) => item.category.id) ?? [],
    tagNames: report?.tags.map((item) => item.tag.name) ?? [],
  }
}

function isSavable(draft: ReportEditorDraft) {
  return draft.title.trim().length >= 5 && draft.body_markdown.trim().length >= 10
}

export function ReportEditorClient({ reportId: initialReportId }: { reportId?: string }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [reportId, setReportId] = useState(initialReportId)
  const [draft, setDraft] = useState<ReportEditorDraft>(() => draftFromReport())
  const [lastSavedDraft, setLastSavedDraft] = useState<ReportEditorDraft>(() => draftFromReport())
  const [preview, setPreview] = useState(false)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [lockError, setLockError] = useState<string>()

  const reportQuery = useQuery({
    queryKey: ['report', reportId],
    queryFn: () => fetchReport(reportId || ''),
    enabled: Boolean(reportId),
  })

  const taxonomyQuery = useQuery({
    queryKey: ['report-taxonomy'],
    queryFn: fetchTaxonomy,
  })

  const report = reportQuery.data
  const lockedBy = lockError || report?.locked_by?.name || report?.locked_by?.email
  const editingDisabled = Boolean(lockError)

  useEffect(() => {
    if (!report) return
    const nextDraft = draftFromReport(report)
    setDraft(nextDraft)
    setLastSavedDraft(nextDraft)
    setLastSavedAt(new Date(report.updated_at))
  }, [report])

  useEffect(() => {
    if (!reportId) return
    let active = true
    acquireLock(reportId)
      .then(() => {
        if (active) setLockError(undefined)
      })
      .catch((error: Error) => {
        if (active) setLockError(error.message)
      })
    return () => {
      active = false
      releaseLock(reportId)
    }
  }, [reportId])

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(lastSavedDraft),
    [draft, lastSavedDraft]
  )

  const saveMutation = useMutation({
    mutationFn: () => saveReport(reportId, draft),
    onMutate: () => setSaveState('saving'),
    onSuccess: (saved) => {
      setReportId(saved.id)
      setLastSavedDraft(draftFromReport(saved))
      setLastSavedAt(new Date(saved.updated_at))
      setSaveState('saved')
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['report', saved.id] })
      if (!reportId) {
        router.replace(`/dashboard/reports/${saved.id}/edit`)
      }
    },
    onError: () => setSaveState('error'),
  })

  const submitMutation = useMutation({
    mutationFn: async () => {
      const saved = hasUnsavedChanges || !reportId ? await saveReport(reportId, draft) : report
      if (!saved?.id) throw new Error('Save the report before submitting')
      if (!reportId) {
        setReportId(saved.id)
        router.replace(`/dashboard/reports/${saved.id}/edit`)
      }
      await submitReport(saved.id)
      return saved.id
    },
    onSuccess: (savedReportId) => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['report', savedReportId] })
      queryClient.invalidateQueries({ queryKey: ['workflow-history'] })
    },
  })

  const saveDraft = useCallback(() => {
    if (!isSavable(draft) || editingDisabled || saveMutation.isPending) return
    saveMutation.mutate()
  }, [draft, editingDisabled, saveMutation])

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (hasUnsavedChanges) saveDraft()
    }, 45_000)
    return () => window.clearInterval(interval)
  }, [hasUnsavedChanges, saveDraft])

  const canSave = isSavable(draft) && !editingDisabled && !saveMutation.isPending
  const canSubmit = canSave && !submitMutation.isPending

  return (
    <div className="space-y-6 animate-fade-in">
      <UnsavedChangesGuard enabled={hasUnsavedChanges} />

      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-100">
            {reportId ? 'Edit Report' : 'New Report'}
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-1">Intelligence Report Editor</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <AutoSaveIndicator state={saveState} lastSavedAt={lastSavedAt} />
          <Button
            icon={<Save className="w-4 h-4" />}
            disabled={!canSave}
            loading={saveMutation.isPending}
            onClick={saveDraft}
          >
            Save Draft
          </Button>
        </div>
      </header>

      {reportQuery.isLoading && reportId ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Skeleton className="h-[560px]" />
          <Skeleton className="h-[360px]" />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Draft</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ReportTitleInput
                  value={draft.title}
                  disabled={editingDisabled}
                  onChange={(title) => setDraft((current) => ({ ...current, title }))}
                />
                <ReportMarkdownEditor
                  value={draft.body_markdown}
                  disabled={editingDisabled}
                  preview={preview}
                  onPreviewChange={setPreview}
                  onChange={(body_markdown) => setDraft((current) => ({ ...current, body_markdown }))}
                />
              </CardContent>
            </Card>

            {reportQuery.isError && <p className="text-sm text-red-400">{(reportQuery.error as Error).message}</p>}
            {saveMutation.isError && <p className="text-sm text-red-400">{(saveMutation.error as Error).message}</p>}
            {submitMutation.isError && <p className="text-sm text-red-400">{(submitMutation.error as Error).message}</p>}
          </div>

          <aside className="space-y-6">
            <ReportWorkflowStatusPanel
              status={report?.status?.key ?? 'DRAFT'}
              lockedBy={lockedBy}
              canSubmit={canSubmit}
              isSubmitting={submitMutation.isPending}
              onSubmit={() => submitMutation.mutate()}
              publicSlug={report?.status?.key === 'PUBLISHED' ? report.slug : undefined}
            />

            <Card>
              <CardHeader>
                <CardTitle>Classification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <CategorySelector
                  categories={taxonomyQuery.data?.categories ?? []}
                  selectedIds={draft.categoryIds}
                  disabled={editingDisabled}
                  onChange={(categoryIds) => setDraft((current) => ({ ...current, categoryIds }))}
                />
                <TagSelector
                  tags={taxonomyQuery.data?.tags ?? []}
                  selectedNames={draft.tagNames}
                  disabled={editingDisabled}
                  onChange={(tagNames) => setDraft((current) => ({ ...current, tagNames }))}
                />
              </CardContent>
            </Card>

            <EvidenceAttachmentPanel
              reportId={reportId}
              evidence={report?.evidence ?? []}
              disabled={editingDisabled}
            />

            <RevisionHistoryPanel revisions={report?.revisions ?? []} />
          </aside>
        </div>
      )}
    </div>
  )
}
