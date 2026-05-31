import { Bell } from 'lucide-react'
import { EmptyState } from '@/components/ui/Card'
import { NotificationCard } from '@/components/notifications/NotificationCard'
import type { NotificationRecord } from '@/components/notifications/types'

export function NotificationList({ notifications }: { notifications: NotificationRecord[] }) {
  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={<Bell className="w-5 h-5" />}
        title="No notifications found"
        description="Adjust your filters or check back after workflow activity."
      />
    )
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  )
}
