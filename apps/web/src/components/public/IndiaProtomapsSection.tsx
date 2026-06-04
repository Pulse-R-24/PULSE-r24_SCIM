import type { PublicReportSummary } from '@modules/reports/types'
import { IndiaProtomapsMap } from '@/components/public/IndiaProtomapsMap'

export function IndiaProtomapsSection({ reports, compact = false }: { reports: PublicReportSummary[]; compact?: boolean }) {
  return (
    <section className="relative w-full overflow-hidden rounded-2xl bg-[#07101b] text-white">
      <div className={compact ? 'h-[380px] md:h-[500px]' : 'h-[360px] md:h-[480px]'}>
        <IndiaProtomapsMap reports={reports} />
      </div>
    </section>
  )
}
