import { FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { TrendBars } from '@/components/analytics/chartPrimitives'
import type { AnalyticsPoint } from '@/components/analytics/types'

export function ReportsTrendChart({ data }: { data: AnalyticsPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4 text-blue-400" />Reports Created Over Time</CardTitle>
      </CardHeader>
      <CardContent><TrendBars data={data} /></CardContent>
    </Card>
  )
}
