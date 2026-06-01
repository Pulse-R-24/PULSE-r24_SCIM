import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface AnalyticsMetricCardProps {
  label: string
  value: string | number
  icon: ReactNode
  caption?: string
  tone?: 'blue' | 'cyan' | 'emerald' | 'amber' | 'violet'
}

const tones = {
  blue: 'border-blue-500/20 text-blue-300 from-blue-500/15',
  cyan: 'border-cyan-500/20 text-cyan-300 from-cyan-500/15',
  emerald: 'border-emerald-500/20 text-emerald-300 from-emerald-500/15',
  amber: 'border-amber-500/20 text-amber-300 from-amber-500/15',
  violet: 'border-violet-500/20 text-violet-300 from-violet-500/15',
}

export function AnalyticsMetricCard({ label, value, icon, caption, tone = 'blue' }: AnalyticsMetricCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-100">{typeof value === 'number' ? value.toLocaleString() : value}</p>
          {caption && <p className="mt-1 text-xs text-slate-500">{caption}</p>}
        </div>
        <div className={cn('rounded-xl border bg-gradient-to-br to-transparent p-2.5', tones[tone])}>{icon}</div>
      </CardContent>
    </Card>
  )
}
