import Link from 'next/link'
import { NotificationCard } from '@/components/notifications/NotificationCard'
import { MarkAllReadButton } from '@/components/notifications/MarkAllReadButton'
import type { NotificationRecord } from '@/components/notifications/types'

export function NotificationDropdown({ notifications }: { notifications: NotificationRecord[] }) {
  const recent = notifications.slice(0, 5)
  const unreadCount = notifications.filter((item) => !item.read).length

  return (
    <div className="absolute right-0 top-12 z-50 w-[360px] rounded-lg border border-white/10 bg-[#071022] p-3 shadow-2xl shadow-black/50">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">Notifications</p>
          <p className="text-xs text-slate-500">{unreadCount} unread</p>
        </div>
        <MarkAllReadButton disabled={unreadCount === 0} />
      </div>

      <div className="max-h-[420px] space-y-2 overflow-y-auto">
        {recent.length === 0 && <p className="py-8 text-center text-sm text-slate-600">No notifications yet.</p>}
        {recent.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} compact />
        ))}
      </div>

      <Link href="/dashboard/notifications" className="mt-3 block rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-center text-sm font-semibold text-blue-300 hover:bg-blue-500/15">
        View all notifications
      </Link>
    </div>
  )
}
