import { Database } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { DashboardEvidenceTypeCount } from '@/components/dashboard/types'

export function EvidenceSummaryWidget({ evidenceByType }: { evidenceByType: DashboardEvidenceTypeCount[] }) {
  const total = evidenceByType.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-4 w-4 text-amber-400" />
          Evidence by Type
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {evidenceByType.map((item) => {
          const width = total > 0 ? Math.max((item.count / total) * 100, item.count > 0 ? 8 : 0) : 0
          return (
            <div key={item.type} className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">{item.type}</span>
                <span className="font-mono text-slate-500">{item.count}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-900/80">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-cyan-400" style={{ width: `${width}%` }} />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
