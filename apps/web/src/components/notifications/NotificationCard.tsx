import Link from 'next/link'
import { Check, ExternalLink, UserRound } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NotificationTypeBadge } from '@/components/notifications/NotificationTypeBadge'
import { getNotificationHref, type NotificationRecord } from '@/components/notifications/types'
import { markNotificationRead } from '@/components/notifications/notificationSchema'
import { cn, formatDate } from '@/lib/utils'

interface NotificationCardProps {
  notification: NotificationRecord
  compact?: boolean
}

export function NotificationCard({ notification, compact = false }: NotificationCardProps) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: () => markNotificationRead(notification.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
  const actor = notification.meta?.actorName || notification.meta?.actorEmail || notification.meta?.actorId
  const href = getNotificationHref(notification)

  return (
    <div className={cn('rounded-lg border p-4 transition-colors', notification.read ? 'border-white/10 bg-white/[0.02]' : 'border-blue-500/30 bg-blue-500/[0.06]')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <NotificationTypeBadge type={notification.type} />
            {!notification.read && <span className="h-2 w-2 rounded-full bg-blue-400" />}
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-100">{notification.title}</p>
          <p className={cn('mt-1 text-sm leading-6 text-slate-400', compact && 'line-clamp-2')}>{notification.body}</p>
        </div>
        {!notification.read && (
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
            className="rounded-md p-2 text-slate-500 hover:bg-emerald-500/10 hover:text-emerald-300 disabled:opacity-60"
            title="Mark as read"
          >
            <Check className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-3 min-w-0">
          <span>{formatDate(notification.created_at)}</span>
          {actor && (
            <span className="inline-flex min-w-0 items-center gap-1">
              <UserRound className="w-3 h-3 shrink-0" />
              <span className="truncate">{actor}</span>
            </span>
          )}
        </div>
        <Link href={href} className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200">
          <ExternalLink className="w-3 h-3" />
          Open
        </Link>
      </div>

      {!compact && notification.meta?.comment && (
        <div className="mt-3 rounded-lg border border-white/5 bg-slate-950/40 p-3 text-xs leading-6 text-slate-400">
          {notification.meta.comment}
        </div>
      )}
    </div>
  )
}
