import { BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { DashboardStatusCount } from '@/components/dashboard/types'

export function ReportsStatusWidget({ statuses }: { statuses: DashboardStatusCount[] }) {
  const max = Math.max(...statuses.map((item) => item.count), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-400" />
          Reports by Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {statuses.map((item) => (
          <div key={item.key} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">{item.label}</span>
              <span className="font-mono text-slate-500">{item.count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-900/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400"
                style={{ width: `${Math.max((item.count / max) * 100, item.count > 0 ? 8 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
