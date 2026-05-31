'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Activity } from 'lucide-react'
import { ActivityFilters } from '@/components/activity/ActivityFilters'
import { ActivityTimeline } from '@/components/activity/ActivityTimeline'
import { fetchActivity } from '@/components/activity/activityApi'
import type { ActivityTypeFilter } from '@/components/activity/types'
import { Card, CardContent, CardHeader, CardTitle, EmptyState, Skeleton } from '@/components/ui/Card'

export function ActivityFeedClient() {
  const [search, setSearch] = useState('')
  const [action, setAction] = useState<ActivityTypeFilter>('ALL')

  const query = useQuery({
    queryKey: ['activity-feed', { search, action }],
    queryFn: () => fetchActivity({ search, action, take: 60 }),
  })

  const activities = query.data ?? []

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-100">Activity Feed</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-1">Editorial Operations Timeline</p>
        </div>
        <ActivityFilters search={search} action={action} onSearchChange={setSearch} onActionChange={setAction} />
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {query.isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
          )}
          {query.isError && <p className="text-sm text-red-400">{(query.error as Error).message}</p>}
          {!query.isLoading && !query.isError && activities.length === 0 && (
            <EmptyState icon={<Activity className="w-5 h-5" />} title="No activity found" description="Adjust the filters or check back after workflow activity." />
          )}
          {!query.isLoading && !query.isError && activities.length > 0 && <ActivityTimeline activities={activities} />}
        </CardContent>
      </Card>
    </div>
  )
}
