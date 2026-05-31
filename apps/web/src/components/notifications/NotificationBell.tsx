'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown'
import { fetchNotifications } from '@/components/notifications/notificationSchema'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 60_000,
  })
  const notifications = query.data ?? []
  const unreadCount = notifications.filter((item) => !item.read).length

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-lg border border-white/10 bg-white/[0.03] p-2 text-slate-400 transition-colors hover:text-slate-100"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      {open && <NotificationDropdown notifications={notifications} />}
    </div>
  )
}
