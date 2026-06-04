'use client'

import dynamic from 'next/dynamic'
import type { PublicReportSummary } from '@modules/reports/types'
import { IndiaMapLoading } from '@/components/public/IndiaMapLoading'

const ClientIndiaProtomapsMap = dynamic<{ reports: PublicReportSummary[] }>(
  () => import('@/components/public/IndiaProtomapsMap').then((module) => module.IndiaProtomapsMap),
  {
    ssr: false,
    loading: () => <IndiaMapLoading />,
  },
)

export function IndiaMapSection({
  reports,
  compact = false,
}: {
  reports: PublicReportSummary[]
  compact?: boolean
}) {
  return (
    <section className="relative w-full overflow-hidden rounded-2xl border border-slate-900/10 bg-[#07101b] shadow-2xl shadow-slate-950/20">
      <div className={compact ? 'h-[420px] w-full md:h-[520px]' : 'h-[380px] w-full md:h-[500px]'}>
        <ClientIndiaProtomapsMap reports={reports} />
      </div>
    </section>
  )
}
