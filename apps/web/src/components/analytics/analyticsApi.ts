import { z } from 'zod'
import type { AnalyticsFiltersState, AnalyticsResult } from '@/components/analytics/types'

const pointSchema = z.object({
  label: z.string(),
  count: z.number(),
})

const breakdownSchema = z.object({
  id: z.string().optional(),
  label: z.string(),
  count: z.number(),
})

const optionSchema = z.object({
  id: z.string(),
  label: z.string(),
})

const analyticsSchema = z.object({
  metrics: z.object({
    reportsCreated: z.number(),
    evidenceAdded: z.number(),
    publications: z.number(),
    activityEvents: z.number(),
    avgReviewCompletionHours: z.number().nullable().optional(),
  }),
  reportsCreatedOverTime: z.array(pointSchema),
  reportsByWorkflowStatus: z.array(breakdownSchema),
  reportsByCategory: z.array(breakdownSchema),
  reportsByAuthor: z.array(breakdownSchema),
  reviewOutcomes: z.array(breakdownSchema),
  evidenceByType: z.array(breakdownSchema),
  evidenceAddedOverTime: z.array(pointSchema),
  publicationCountOverTime: z.array(pointSchema),
  activityCountOverTime: z.array(pointSchema),
  filters: z.object({
    categories: z.array(optionSchema),
    statuses: z.array(optionSchema),
    actors: z.array(optionSchema),
  }),
})

export async function fetchAnalytics(filters: AnalyticsFiltersState) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })

  const res = await fetch(params.toString() ? `/api/analytics?${params}` : '/api/analytics', { cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to load analytics')
  }

  return analyticsSchema.parse(await res.json()) as AnalyticsResult
}
