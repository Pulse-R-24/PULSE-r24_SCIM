import { Tags } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { BreakdownBars } from '@/components/analytics/chartPrimitives'
import type { AnalyticsBreakdownItem } from '@/components/analytics/types'

export function CategoryBreakdownChart({ categories, authors }: { categories: AnalyticsBreakdownItem[]; authors: AnalyticsBreakdownItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Tags className="h-4 w-4 text-amber-400" />Category and Author Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-2">
        <section>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Reports by Category</p>
          <BreakdownBars data={categories} />
        </section>
        <section>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Reports by Author</p>
          <BreakdownBars data={authors} />
        </section>
      </CardContent>
    </Card>
  )
}
