import Link from 'next/link'
import { ExternalLink, MessageSquare, UserRound } from 'lucide-react'
import { ActivityTypeBadge } from '@/components/activity/ActivityTypeBadge'
import { getActivityHref, type ActivityRecord } from '@/components/activity/types'
import { formatDate } from '@/lib/utils'

function getActivityTitle(activity: ActivityRecord) {
  return activity.meta?.title || activity.meta?.reportTitle || activity.entityId || activity.entityType
}

export function ActivityEventCard({ activity }: { activity: ActivityRecord }) {
  const actor = activity.actor?.name || activity.actor?.email || 'System'
  const href = getActivityHref(activity)

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <ActivityTypeBadge action={activity.action} />
          <p className="mt-2 text-sm font-semibold text-slate-100">{getActivityTitle(activity)}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <UserRound className="w-3.5 h-3.5" />
            <span>{actor}</span>
          </div>
        </div>
        <time className="shrink-0 text-xs text-slate-500">{formatDate(activity.created_at)}</time>
      </div>

      {activity.meta?.comment && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-white/5 bg-slate-950/40 p-3 text-xs leading-6 text-slate-400">
          <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-500" />
          {activity.meta.comment}
        </div>
      )}

      <Link href={href} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-300 hover:text-blue-200">
        <ExternalLink className="w-3 h-3" />
        Open related item
      </Link>
    </div>
  )
}
