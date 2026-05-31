'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FileSearch } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/components/ui/Card'
import { SearchInput } from '@/components/search/SearchInput'
import { SearchFiltersPanel } from '@/components/search/SearchFiltersPanel'
import { SearchResultsList } from '@/components/search/SearchResultsList'
import { fetchGlobalSearch, fetchTaxonomy } from '@/components/search/searchApi'
import type { SearchFilters } from '@/components/search/types'

const DEFAULT_FILTERS: SearchFilters = {
  q: '',
  categoryId: '',
  tagName: '',
  status: 'ALL',
  evidenceType: 'ALL',
  actor: '',
  dateFrom: '',
  dateTo: '',
  resultType: 'ALL',
}

export function GlobalSearchClient() {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)

  const searchQuery = useQuery({
    queryKey: ['global-search', filters],
    queryFn: () => fetchGlobalSearch(filters),
  })
  const taxonomyQuery = useQuery({
    queryKey: ['report-taxonomy'],
    queryFn: fetchTaxonomy,
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="space-y-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-100">Global Search</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-1">Reports, Evidence, Workflow, Activity</p>
        </div>
        <SearchInput value={filters.q} onChange={(q) => setFilters((current) => ({ ...current, q }))} />
        <SearchFiltersPanel
          filters={filters}
          categories={taxonomyQuery.data?.categories ?? []}
          tags={taxonomyQuery.data?.tags ?? []}
          onChange={setFilters}
        />
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-blue-400" />
            Search Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {searchQuery.isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
          )}
          {searchQuery.isError && <p className="text-sm text-red-400">{(searchQuery.error as Error).message}</p>}
          {!searchQuery.isLoading && !searchQuery.isError && searchQuery.data && <SearchResultsList results={searchQuery.data} />}
        </CardContent>
      </Card>
    </div>
  )
}
