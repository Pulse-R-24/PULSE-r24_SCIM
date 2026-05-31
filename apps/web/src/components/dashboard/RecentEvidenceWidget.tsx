import Link from 'next/link'
import { Archive, Link2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { DashboardEvidencePreview } from '@/components/dashboard/types'
import { formatDate } from '@/lib/utils'

interface RecentEvidenceWidgetProps {
  recentEvidence: DashboardEvidencePreview[]
  activeReportEvidence: DashboardEvidencePreview[]
}

export function RecentEvidenceWidget({ recentEvidence, activeReportEvidence }: RecentEvidenceWidgetProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Archive className="h-4 w-4 text-amber-400" />
          Evidence Watch
        </CardTitle>
        <Link href="/dashboard/evidence" className="text-xs font-semibold text-blue-300 hover:text-blue-200">Library</Link>
      </CardHeader>
      <CardContent className="space-y-5">
        <section className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Recently Added</p>
          {recentEvidence.length === 0 && <EmptyState title="No evidence yet" description="Evidence records will appear here after upload or URL capture." />}
          {recentEvidence.map((item) => (
            <EvidenceRow key={item.id} item={item} />
          ))}
        </section>

        <section className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Linked to Active Reports</p>
          {activeReportEvidence.length === 0 && <p className="text-sm text-slate-600">No active report evidence links.</p>}
          {activeReportEvidence.map((item) => (
            <EvidenceRow key={`active-${item.id}`} item={item} />
          ))}
        </section>
      </CardContent>
    </Card>
  )
}

function EvidenceRow({ item }: { item: DashboardEvidencePreview }) {
  return (
    <Link href={item.href} className="block rounded-lg border border-white/10 bg-white/[0.025] p-3 hover:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-100">{item.title}</p>
          <p className="mt-1 truncate text-xs text-slate-500">
            <Link2 className="mr-1 inline h-3 w-3" />
            {item.reportTitle}
          </p>
        </div>
        <Badge variant="subtle">{item.type}</Badge>
      </div>
      <p className="mt-2 text-xs text-slate-500">{formatDate(item.created_at)}{item.createdBy ? ` by ${item.createdBy}` : ''}</p>
    </Link>
  )
}
