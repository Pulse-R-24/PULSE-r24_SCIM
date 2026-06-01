'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Activity, Archive, Clock3, FileText, RadioTower } from 'lucide-react'
import { ActivityTrendChart } from '@/components/analytics/ActivityTrendChart'
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters'
import { AnalyticsMetricCard } from '@/components/analytics/AnalyticsMetricCard'
import { CategoryBreakdownChart } from '@/components/analytics/CategoryBreakdownChart'
import { EvidenceTypeChart } from '@/components/analytics/EvidenceTypeChart'
import { PublicationTrendChart } from '@/components/analytics/PublicationTrendChart'
import { ReportsTrendChart } from '@/components/analytics/ReportsTrendChart'
import { ReviewOutcomeChart } from '@/components/analytics/ReviewOutcomeChart'
import { WorkflowStatusChart } from '@/components/analytics/WorkflowStatusChart'
import { fetchAnalytics } from '@/components/analytics/analyticsApi'
import type { AnalyticsFiltersState } from '@/components/analytics/types'
import { Card, Skeleton } from '@/components/ui/Card'

const DEFAULT_FILTERS: AnalyticsFiltersState = {
  dateFrom: '',
  dateTo: '',
  categoryId: '',
  status: '',
  actorId: '',
}

export function AnalyticsClient() {
  const [filters, setFilters] = useState<AnalyticsFiltersState>(DEFAULT_FILTERS)
  const query = useQuery({
    queryKey: ['analytics', filters],
    queryFn: () => fetchAnalytics(filters),
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="relative overflow-hidden rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-slate-950 via-blue-950/40 to-emerald-950/20 p-6">
        <div className="absolute right-10 top-8 h-28 w-28 rounded-full bg-cyan-500/10 blur-2xl" />
        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300">Operational Intelligence Metrics</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-100 lg:text-4xl">Basic Analytics</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Track editorial throughput, review outcomes, evidence intake, publication cadence, and activity volume using live platform data.
          </p>
        </div>
      </header>

      <AnalyticsFilters filters={filters} options={query.data?.filters} onChange={setFilters} />

      {query.isLoading && (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-32" />)}
          </section>
          <div className="grid gap-6 xl:grid-cols-2">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </>
      )}

      {query.isError && (
        <Card className="border-red-500/20 bg-red-500/[0.04]">
          <p className="text-sm text-red-300">{(query.error as Error).message}</p>
        </Card>
      )}

      {query.data && !query.isLoading && !query.isError && (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <AnalyticsMetricCard label="Reports Created" value={query.data.metrics.reportsCreated} icon={<FileText className="h-4 w-4" />} tone="blue" />
            <AnalyticsMetricCard label="Evidence Added" value={query.data.metrics.evidenceAdded} icon={<Archive className="h-4 w-4" />} tone="amber" />
            <AnalyticsMetricCard label="Publications" value={query.data.metrics.publications} icon={<RadioTower className="h-4 w-4" />} tone="violet" />
            <AnalyticsMetricCard label="Activity Events" value={query.data.metrics.activityEvents} icon={<Activity className="h-4 w-4" />} tone="cyan" />
            <AnalyticsMetricCard
              label="Avg Review Time"
              value={query.data.metrics.avgReviewCompletionHours == null ? 'N/A' : `${query.data.metrics.avgReviewCompletionHours}h`}
              icon={<Clock3 className="h-4 w-4" />}
              caption="Completed assignments"
              tone="emerald"
            />
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <ReportsTrendChart data={query.data.reportsCreatedOverTime} />
            <WorkflowStatusChart data={query.data.reportsByWorkflowStatus} />
          </div>

          <CategoryBreakdownChart categories={query.data.reportsByCategory} authors={query.data.reportsByAuthor} />

          <div className="grid gap-6 xl:grid-cols-2">
            <ReviewOutcomeChart data={query.data.reviewOutcomes} />
            <PublicationTrendChart data={query.data.publicationCountOverTime} />
          </div>

          <EvidenceTypeChart typeData={query.data.evidenceByType} trendData={query.data.evidenceAddedOverTime} />
          <ActivityTrendChart data={query.data.activityCountOverTime} />
        </>
      )}
    </div>
  )
}
