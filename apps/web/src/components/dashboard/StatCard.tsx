import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: number
  icon: ReactNode
  tone: 'blue' | 'cyan' | 'emerald' | 'amber' | 'violet' | 'slate'
  description?: string
}

const toneClasses: Record<StatCardProps['tone'], string> = {
  blue: 'from-blue-500/20 text-blue-300 border-blue-500/20',
  cyan: 'from-cyan-500/20 text-cyan-300 border-cyan-500/20',
  emerald: 'from-emerald-500/20 text-emerald-300 border-emerald-500/20',
  amber: 'from-amber-500/20 text-amber-300 border-amber-500/20',
  violet: 'from-violet-500/20 text-violet-300 border-violet-500/20',
  slate: 'from-slate-500/20 text-slate-300 border-slate-500/20',
}

export function StatCard({ label, value, icon, tone, description }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className={cn('absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent', toneClasses[tone])} />
      <CardContent className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-100">{value.toLocaleString()}</p>
          {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
        </div>
        <div className={cn('rounded-xl border bg-gradient-to-br to-transparent p-2.5', toneClasses[tone])}>
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}
