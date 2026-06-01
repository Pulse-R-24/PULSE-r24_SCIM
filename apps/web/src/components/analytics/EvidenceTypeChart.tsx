import { Archive } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { BreakdownBars, TrendBars } from '@/components/analytics/chartPrimitives'
import type { AnalyticsBreakdownItem, AnalyticsPoint } from '@/components/analytics/types'

export function EvidenceTypeChart({ typeData, trendData }: { typeData: AnalyticsBreakdownItem[]; trendData: AnalyticsPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Archive className="h-4 w-4 text-amber-400" />Evidence Analytics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-2">
        <section>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Evidence by Type</p>
          <BreakdownBars data={typeData} />
        </section>
        <section>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Evidence Added Over Time</p>
          <TrendBars data={trendData} />
        </section>
      </CardContent>
    </Card>
  )
}
