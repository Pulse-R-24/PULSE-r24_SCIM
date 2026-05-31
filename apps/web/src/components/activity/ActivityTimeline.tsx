import { ActivityEventCard } from '@/components/activity/ActivityEventCard'
import type { ActivityRecord } from '@/components/activity/types'

function dateKey(date: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
}

export function ActivityTimeline({ activities }: { activities: ActivityRecord[] }) {
  const groups = activities.reduce<Record<string, ActivityRecord[]>>((acc, item) => {
    const key = dateKey(item.created_at)
    acc[key] = acc[key] ? [...acc[key], item] : [item]
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([date, records]) => (
        <section key={date} className="space-y-3">
          <div className="sticky top-0 z-10 bg-[#070d1a]/80 py-1 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{date}</p>
          </div>
          <div className="relative space-y-3">
            {records.map((activity) => (
              <ActivityEventCard key={activity.id} activity={activity} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
