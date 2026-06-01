import { CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { BreakdownBars } from '@/components/analytics/chartPrimitives'
import type { AnalyticsBreakdownItem } from '@/components/analytics/types'

export function ReviewOutcomeChart({ data }: { data: AnalyticsBreakdownItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Review Approvals vs Rejections</CardTitle>
      </CardHeader>
      <CardContent><BreakdownBars data={data} /></CardContent>
    </Card>
  )
}
