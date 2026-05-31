import { z } from 'zod'
import type { ActivityRecord } from '@/components/activity/types'

const activitySchema = z.object({
  id: z.string(),
  actorId: z.string().nullable().optional(),
  actor: z.object({ name: z.string().nullable().optional(), email: z.string() }).nullable().optional(),
  action: z.string(),
  entityType: z.string(),
  entityId: z.string().nullable().optional(),
  meta: z.object({
    title: z.string().optional(),
    reportTitle: z.string().optional(),
    status: z.string().optional(),
    previousStatus: z.string().optional(),
    comment: z.string().optional(),
    reportId: z.string().optional(),
    evidenceId: z.string().optional(),
    mediaId: z.string().optional(),
  }).nullable().optional(),
  created_at: z.string(),
})

const activityListSchema = z.array(activitySchema)

export interface FetchActivityInput {
  action?: string
  actorId?: string
  entityType?: string
  entityId?: string
  search?: string
  take?: number
}

export async function fetchActivity(input: FetchActivityInput = {}) {
  const params = new URLSearchParams()
  if (input.action && input.action !== 'ALL') params.set('action', input.action)
  if (input.actorId) params.set('actorId', input.actorId)
  if (input.entityType) params.set('entityType', input.entityType)
  if (input.entityId) params.set('entityId', input.entityId)
  if (input.search?.trim()) params.set('search', input.search.trim())
  if (input.take) params.set('take', String(input.take))

  const res = await fetch(params.toString() ? `/api/activities?${params}` : '/api/activities', { cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to load activity')
  }

  return activityListSchema.parse(await res.json()) as ActivityRecord[]
}
