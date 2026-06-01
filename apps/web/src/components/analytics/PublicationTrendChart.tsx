import { RadioTower } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { TrendBars } from '@/components/analytics/chartPrimitives'
import type { AnalyticsPoint } from '@/components/analytics/types'

export function PublicationTrendChart({ data }: { data: AnalyticsPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><RadioTower className="h-4 w-4 text-violet-400" />Publication Count Over Time</CardTitle>
      </CardHeader>
      <CardContent><TrendBars data={data} /></CardContent>
    </Card>
  )
}
