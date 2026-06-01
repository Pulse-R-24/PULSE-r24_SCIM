import { GitBranch } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { BreakdownBars } from '@/components/analytics/chartPrimitives'
import type { AnalyticsBreakdownItem } from '@/components/analytics/types'

export function WorkflowStatusChart({ data }: { data: AnalyticsBreakdownItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><GitBranch className="h-4 w-4 text-cyan-400" />Reports by Workflow Status</CardTitle>
      </CardHeader>
      <CardContent><BreakdownBars data={data} /></CardContent>
    </Card>
  )
}
