'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/components/ui/Card'
import { MarkAllReadButton } from '@/components/notifications/MarkAllReadButton'
import { NotificationFilters } from '@/components/notifications/NotificationFilters'
import { NotificationList } from '@/components/notifications/NotificationList'
import { fetchNotifications } from '@/components/notifications/notificationSchema'
import type { NotificationReadFilter, NotificationTypeFilter } from '@/components/notifications/types'

export function NotificationsClient() {
  const [search, setSearch] = useState('')
  const [readFilter, setReadFilter] = useState<NotificationReadFilter>('ALL')
  const [typeFilter, setTypeFilter] = useState<NotificationTypeFilter>('ALL')

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  })

  const notifications = useMemo(() => query.data ?? [], [query.data])
  const unreadCount = notifications.filter((item) => !item.read).length
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return notifications.filter((item) => {
      const readMatch = readFilter === 'ALL' || !item.read
      const typeMatch = typeFilter === 'ALL' || item.type === typeFilter
      const searchMatch = !needle || item.title.toLowerCase().includes(needle) || item.body.toLowerCase().includes(needle)
      return readMatch && typeMatch && searchMatch
    })
  }, [notifications, readFilter, search, typeFilter])

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-100">Notifications</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-1">Editorial Signal Inbox</p>
        </div>

        <div className="flex items-start gap-3 flex-wrap">
          <NotificationFilters
            search={search}
            readFilter={readFilter}
            typeFilter={typeFilter}
            onSearchChange={setSearch}
            onReadFilterChange={setReadFilter}
            onTypeFilterChange={setTypeFilter}
          />
          <MarkAllReadButton disabled={unreadCount === 0} />
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" />
            In-app Notifications
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
          {!query.isLoading && !query.isError && <NotificationList notifications={filtered} />}
        </CardContent>
      </Card>
    </div>
  )
}
