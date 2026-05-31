import { ExternalLink, FileSearch } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { EvidenceTypeBadge } from '@/components/evidence/EvidenceTypeBadge'
import { formatBytes, getEvidenceType, type EvidenceRecord } from '@/components/evidence/types'
import { formatDate } from '@/lib/utils'

export function EvidencePreviewPanel({ evidence }: { evidence?: EvidenceRecord }) {
  if (!evidence) {
    return (
      <Card className="lg:sticky lg:top-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-blue-400" />
            Evidence Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-10 text-center text-sm text-slate-600">Select evidence to inspect metadata and preview options.</p>
        </CardContent>
      </Card>
    )
  }

  const type = getEvidenceType(evidence)
  const isImage = type === 'IMAGE' && evidence.url

  return (
    <Card className="lg:sticky lg:top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-blue-400" />
          Evidence Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <EvidenceTypeBadge evidence={evidence} />
          <p className="text-base font-semibold text-slate-100">{evidence.title}</p>
          {evidence.description && <p className="text-sm leading-6 text-slate-400">{evidence.description}</p>}
        </div>

        {isImage ? (
          <img src={evidence.url || ''} alt={evidence.title} className="w-full rounded-lg border border-white/10 object-cover" />
        ) : (
          <div className="flex min-h-40 items-center justify-center rounded-lg border border-white/10 bg-slate-950/50">
            <FileSearch className="w-8 h-8 text-slate-700" />
          </div>
        )}

        {evidence.url && (
          <a href={evidence.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200">
            <ExternalLink className="w-4 h-4" />
            Open source
          </a>
        )}

        <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
          <div>
            <p className="uppercase tracking-[0.16em] text-slate-600">Created</p>
            <p className="mt-1 text-slate-400">{formatDate(evidence.created_at)}</p>
          </div>
          <div>
            <p className="uppercase tracking-[0.16em] text-slate-600">Size</p>
            <p className="mt-1 text-slate-400">{formatBytes(evidence.media?.size)}</p>
          </div>
          <div>
            <p className="uppercase tracking-[0.16em] text-slate-600">Uploaded By</p>
            <p className="mt-1 text-slate-400">{evidence.created_by?.name || evidence.created_by?.email || 'Unknown'}</p>
          </div>
          <div>
            <p className="uppercase tracking-[0.16em] text-slate-600">Report</p>
            <p className="mt-1 text-slate-400">{evidence.report?.title || 'Unlinked'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
