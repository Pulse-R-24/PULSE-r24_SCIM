import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { EvidenceTypeBadge } from '@/components/evidence/EvidenceTypeBadge'
import type { EvidenceRecord } from '@/components/evidence/types'
import { formatBytes } from '@/components/evidence/types'
import { formatDate } from '@/lib/utils'

export function EvidenceCard({ evidence, onSelect }: { evidence: EvidenceRecord; onSelect: (evidence: EvidenceRecord) => void }) {
  return (
    <div
      onClick={() => onSelect(evidence)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onSelect(evidence)
      }}
      className="w-full cursor-pointer rounded-lg border border-white/10 bg-white/[0.025] p-4 text-left transition-colors hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <EvidenceTypeBadge evidence={evidence} />
          <p className="mt-2 text-sm font-semibold text-slate-100">{evidence.title}</p>
          <p className="mt-1 text-xs text-slate-500">{formatDate(evidence.created_at)} · {formatBytes(evidence.media?.size)}</p>
        </div>
        {evidence.url && <ExternalLink className="w-4 h-4 text-slate-600" />}
      </div>
      {evidence.report && (
        <Link href={`/dashboard/reports/${evidence.report.id}/edit`} className="mt-3 block text-xs text-blue-300 hover:text-blue-200" onClick={(event) => event.stopPropagation()}>
          {evidence.report.title}
        </Link>
      )}
    </div>
  )
}
