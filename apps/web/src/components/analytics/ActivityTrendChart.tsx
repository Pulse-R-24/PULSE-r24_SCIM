import { Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { TrendBars } from '@/components/analytics/chartPrimitives'
import type { AnalyticsPoint } from '@/components/analytics/types'

export function ActivityTrendChart({ data }: { data: AnalyticsPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Activity className="h-4 w-4 text-cyan-400" />Activity Count Over Time</CardTitle>
      </CardHeader>
      <CardContent><TrendBars data={data} /></CardContent>
    </Card>
  )
}
