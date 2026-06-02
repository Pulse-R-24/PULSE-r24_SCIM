'use client'

import { useQuery } from '@tanstack/react-query'
import { Radar, RefreshCw } from 'lucide-react'
import { AssignedReviewsWidget } from '@/components/dashboard/AssignedReviewsWidget'
import { DashboardStatsGrid } from '@/components/dashboard/DashboardStatsGrid'
import { EvidenceSummaryWidget } from '@/components/dashboard/EvidenceSummaryWidget'
import { PendingReviewsWidget } from '@/components/dashboard/PendingReviewsWidget'
import { QuickActionsPanel } from '@/components/dashboard/QuickActionsPanel'
import { RecentActivityWidget } from '@/components/dashboard/RecentActivityWidget'
import { RecentEvidenceWidget } from '@/components/dashboard/RecentEvidenceWidget'
import { RecentNotificationsWidget } from '@/components/dashboard/RecentNotificationsWidget'
import { RecentReportsWidget } from '@/components/dashboard/RecentReportsWidget'
import { ReportsStatusWidget } from '@/components/dashboard/ReportsStatusWidget'
import { fetchDashboardSummary } from '@/components/dashboard/dashboardApi'
import { Card, Skeleton } from '@/components/ui/Card'

export function DashboardClient() {
  const query = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboardSummary,
  })

  if (query.isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <DashboardHeader />
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => <Skeleton key={index} className="h-32" />)}
        </section>
        <div className="grid gap-6 xl:grid-cols-3">
          <Skeleton className="h-96 xl:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  if (query.isError || !query.data) {
    return (
      <div className="space-y-8 animate-fade-in">
        <DashboardHeader />
        <Card className="border-red-500/20 bg-red-500/[0.04]">
          <p className="text-sm text-red-300">{(query.error as Error)?.message || 'Failed to load dashboard summary'}</p>
        </Card>
      </div>
    )
  }

  const summary = query.data

  return (
    <div className="space-y-8 animate-fade-in">
      <DashboardHeader />

      <DashboardStatsGrid stats={summary.stats} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <ReportsStatusWidget statuses={summary.reportsByStatus} />
          <div className="grid gap-6 lg:grid-cols-2">
            <PendingReviewsWidget reports={summary.pendingReviewQueue} />
            <AssignedReviewsWidget reviews={summary.assignedReviews} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <RecentReportsWidget title="Recently Published Reports" mode="published" reports={summary.recentlyPublishedReports} />
            <RecentReportsWidget title="Recently Updated Reports" mode="updated" reports={summary.recentlyUpdatedReports} />
          </div>
        </div>

        <aside className="space-y-6">
          <QuickActionsPanel />
          <RecentNotificationsWidget notifications={summary.recentNotifications} />
        </aside>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <EvidenceSummaryWidget evidenceByType={summary.evidenceByType} />
        <RecentEvidenceWidget recentEvidence={summary.recentEvidence} activeReportEvidence={summary.activeReportEvidence} />
        <RecentActivityWidget activity={summary.recentActivity} />
      </div>
    </div>
  )
}

function DashboardHeader() {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-rose-500/15 bg-[radial-gradient(circle_at_top_right,rgba(190,18,60,0.22),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.94),rgba(2,6,23,0.96))] p-6 shadow-2xl shadow-slate-950/20">
      <div className="absolute right-8 top-6 h-24 w-24 rounded-full bg-rose-500/10 blur-2xl" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-rose-500/60 via-cyan-300/25 to-transparent" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-200">
            <Radar className="h-3.5 w-3.5" />
            PULSE-R24 Editorial Operations
          </div>
          <h1 className="font-editorial text-4xl font-black tracking-tight text-slate-100 lg:text-5xl">Strategic Intelligence Dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Monitor report production, review pressure, evidence intake, notifications, and operator activity from one command surface.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          <RefreshCw className="h-4 w-4 text-cyan-300" />
          Live on refresh
        </div>
      </div>
    </header>
  )
}
