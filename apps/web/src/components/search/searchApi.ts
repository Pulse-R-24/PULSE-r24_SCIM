import { z } from 'zod'
import type { GlobalSearchResult, SearchFilters } from '@/components/search/types'

const itemSchema = z.object({
  id: z.string(),
  type: z.enum(['REPORT', 'EVIDENCE', 'WORKFLOW', 'ACTIVITY']),
  title: z.string(),
  summary: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  subtype: z.string().nullable().optional(),
  user: z.string().nullable().optional(),
  href: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

const searchResultSchema = z.object({
  reports: z.array(itemSchema),
  evidence: z.array(itemSchema),
  workflow: z.array(itemSchema),
  activity: z.array(itemSchema),
})

export async function fetchGlobalSearch(filters: SearchFilters) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'ALL') params.set(key, value)
  })

  const res = await fetch(`/api/search?${params}`, { cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to search')
  }

  return searchResultSchema.parse(await res.json()) as GlobalSearchResult
}

export const taxonomySchema = z.object({
  categories: z.array(z.object({ id: z.string(), name: z.string() })).default([]),
  tags: z.array(z.object({ id: z.string(), name: z.string() })).default([]),
})

export async function fetchTaxonomy() {
  const res = await fetch('/api/reports/taxonomy', { cache: 'no-store' })
  if (!res.ok) return { categories: [], tags: [] }
  return taxonomySchema.parse(await res.json())
}
