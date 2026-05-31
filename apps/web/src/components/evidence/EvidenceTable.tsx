import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { EvidenceTypeBadge } from '@/components/evidence/EvidenceTypeBadge'
import type { EvidenceRecord } from '@/components/evidence/types'
import { formatBytes } from '@/components/evidence/types'
import { cn, formatDate } from '@/lib/utils'

interface EvidenceTableProps {
  evidence: EvidenceRecord[]
  selectedId?: string
  onSelect: (evidence: EvidenceRecord) => void
}

export function EvidenceTable({ evidence, selectedId, onSelect }: EvidenceTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-white/[0.03]">
          <tr className="text-left text-slate-400">
            <th className="px-4 py-3 font-semibold">Evidence</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Report</th>
            <th className="px-4 py-3 font-semibold">Uploaded By</th>
            <th className="px-4 py-3 font-semibold">Created</th>
            <th className="px-4 py-3 font-semibold">Source</th>
          </tr>
        </thead>
        <tbody>
          {evidence.map((item) => (
            <tr
              key={item.id}
              onClick={() => onSelect(item)}
              className={cn('cursor-pointer border-t border-white/5 align-top hover:bg-white/[0.035]', selectedId === item.id && 'bg-blue-500/[0.06]')}
            >
              <td className="px-4 py-4">
                <p className="font-semibold text-slate-100">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">{item.description || item.media?.path || 'No description'}</p>
                <p className="mt-1 text-xs text-slate-600">{formatBytes(item.media?.size)}</p>
              </td>
              <td className="px-4 py-4"><EvidenceTypeBadge evidence={item} /></td>
              <td className="px-4 py-4 text-xs text-slate-400">
                {item.report ? (
                  <Link href={`/dashboard/reports/${item.report.id}/edit`} className="text-blue-300 hover:text-blue-200">
                    {item.report.title}
                  </Link>
                ) : 'Unlinked'}
              </td>
              <td className="px-4 py-4 text-xs text-slate-400">{item.created_by?.name || item.created_by?.email || 'Unknown'}</td>
              <td className="px-4 py-4 text-xs text-slate-400">{formatDate(item.created_at)}</td>
              <td className="px-4 py-4">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-300" onClick={(event) => event.stopPropagation()}>
                    <ExternalLink className="w-3 h-3" />
                    Open
                  </a>
                ) : (
                  <span className="text-xs text-slate-600">{item.media?.mime_type || 'None'}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
