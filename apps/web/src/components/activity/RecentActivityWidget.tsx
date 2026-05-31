'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Activity } from 'lucide-react'
import { ActivityTypeBadge } from '@/components/activity/ActivityTypeBadge'
import { fetchActivity } from '@/components/activity/activityApi'
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'

export function RecentActivityWidget() {
  const query = useQuery({
    queryKey: ['activity-feed', 'recent-widget'],
    queryFn: () => fetchActivity({ take: 6 }),
  })
  const activities = query.data ?? []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          Recent Activity
        </CardTitle>
        <Link href="/dashboard/activity" className="text-xs font-semibold text-blue-300 hover:text-blue-200">
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {query.isLoading && (
          <>
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </>
        )}
        {!query.isLoading && activities.length === 0 && <p className="py-6 text-center text-sm text-slate-600">No recent activity.</p>}
        {activities.map((activity) => (
          <Link key={activity.id} href="/dashboard/activity" className="block rounded-lg border border-white/10 bg-white/[0.025] p-3 hover:bg-white/[0.04]">
            <div className="flex items-center justify-between gap-3">
              <ActivityTypeBadge action={activity.action} />
              <span className="shrink-0 text-xs text-slate-500">{formatDate(activity.created_at)}</span>
            </div>
            <p className="mt-2 truncate text-sm font-semibold text-slate-100">
              {activity.meta?.title || activity.meta?.reportTitle || activity.entityId || activity.entityType}
            </p>
            <p className="mt-1 truncate text-xs text-slate-500">
              {activity.actor?.name || activity.actor?.email || 'System'}
            </p>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
