import Link from 'next/link'
import { Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui/Card'
import { ActivityTypeBadge } from '@/components/activity/ActivityTypeBadge'
import type { DashboardActivityPreview } from '@/components/dashboard/types'
import { formatDate } from '@/lib/utils'

export function RecentActivityWidget({ activity }: { activity: DashboardActivityPreview[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-400" />
          Recent Activity
        </CardTitle>
        <Link href="/dashboard/activity" className="text-xs font-semibold text-blue-300 hover:text-blue-200">View all</Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {activity.length === 0 && <EmptyState title="No recent activity" description="Operational events will appear here." />}
        {activity.map((item) => (
          <Link key={item.id} href={item.href} className="block rounded-lg border border-white/10 bg-white/[0.025] p-3 hover:bg-white/[0.04]">
            <div className="flex items-center justify-between gap-3">
              <ActivityTypeBadge action={item.action} />
              <span className="shrink-0 text-xs text-slate-500">{formatDate(item.created_at)}</span>
            </div>
            <p className="mt-2 truncate text-sm font-semibold text-slate-100">{item.title}</p>
            <p className="mt-1 truncate text-xs text-slate-500">{item.actor || 'System'} • {item.entityType}</p>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
