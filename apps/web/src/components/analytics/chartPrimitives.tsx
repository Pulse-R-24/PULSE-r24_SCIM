import { EmptyState } from '@/components/ui/Card'
import type { AnalyticsBreakdownItem, AnalyticsPoint } from '@/components/analytics/types'

export function TrendBars({ data }: { data: AnalyticsPoint[] }) {
  if (data.length === 0) return <EmptyState title="No data available" description="Adjust filters or wait for more workflow activity." />
  const max = Math.max(...data.map((item) => item.count), 1)

  return (
    <div className="flex h-52 items-end gap-2 overflow-x-auto pb-2">
      {data.map((item) => (
        <div key={item.label} className="flex min-w-10 flex-1 flex-col items-center gap-2">
          <div className="flex h-40 w-full items-end rounded-t-lg bg-slate-950/60">
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 via-cyan-500 to-emerald-300"
              style={{ height: `${Math.max((item.count / max) * 100, item.count > 0 ? 8 : 0)}%` }}
              title={`${item.label}: ${item.count}`}
            />
          </div>
          <span className="w-16 truncate text-center text-[10px] text-slate-500">{item.label.slice(5)}</span>
        </div>
      ))}
    </div>
  )
}

export function BreakdownBars({ data }: { data: AnalyticsBreakdownItem[] }) {
  const visible = data.filter((item) => item.count > 0)
  if (visible.length === 0) return <EmptyState title="No data available" description="This breakdown has no matching records." />
  const max = Math.max(...visible.map((item) => item.count), 1)

  return (
    <div className="space-y-3">
      {visible.map((item) => (
        <div key={item.id || item.label} className="space-y-1.5">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="truncate font-semibold text-slate-300">{item.label}</span>
            <span className="font-mono text-slate-500">{item.count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-950/80">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" style={{ width: `${Math.max((item.count / max) * 100, 8)}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}
