import Link from 'next/link'
import { Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui/Card'
import { NotificationTypeBadge } from '@/components/notifications/NotificationTypeBadge'
import type { DashboardNotificationPreview } from '@/components/dashboard/types'
import { cn, formatDate } from '@/lib/utils'

export function RecentNotificationsWidget({ notifications }: { notifications: DashboardNotificationPreview[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber-400" />
          Recent Notifications
        </CardTitle>
        <Link href="/dashboard/notifications" className="text-xs font-semibold text-blue-300 hover:text-blue-200">View all</Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.length === 0 && <EmptyState title="No notifications" description="Workflow alerts will appear here." />}
        {notifications.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              'block rounded-lg border p-3 hover:bg-white/[0.04]',
              item.read ? 'border-white/10 bg-white/[0.025]' : 'border-blue-500/30 bg-blue-500/[0.06]'
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <NotificationTypeBadge type={item.type} />
              <span className="shrink-0 text-xs text-slate-500">{formatDate(item.created_at)}</span>
            </div>
            <p className="mt-2 line-clamp-1 text-sm font-semibold text-slate-100">{item.title}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{item.body}</p>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
