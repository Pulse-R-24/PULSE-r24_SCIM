import { File, FileImage, FileText, FileVideo, Link2, ScrollText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EvidenceRecord, EvidenceTypeFilter } from '@/components/evidence/types'
import { getEvidenceType } from '@/components/evidence/types'

type ConcreteEvidenceType = Exclude<EvidenceTypeFilter, 'ALL'>

const TYPE_CONFIG: Record<ConcreteEvidenceType, { label: string; className: string; icon: React.ReactNode }> = {
  FILE: { label: 'File', className: 'bg-slate-500/15 text-slate-300 border-slate-500/30', icon: <File className="w-3 h-3" /> },
  IMAGE: { label: 'Image', className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: <FileImage className="w-3 h-3" /> },
  PDF: { label: 'PDF', className: 'bg-red-500/15 text-red-300 border-red-500/30', icon: <FileText className="w-3 h-3" /> },
  VIDEO: { label: 'Video', className: 'bg-violet-500/15 text-violet-300 border-violet-500/30', icon: <FileVideo className="w-3 h-3" /> },
  URL: { label: 'URL', className: 'bg-blue-500/15 text-blue-300 border-blue-500/30', icon: <Link2 className="w-3 h-3" /> },
  DOCUMENT: { label: 'Document', className: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30', icon: <ScrollText className="w-3 h-3" /> },
}

export function EvidenceTypeBadge({ evidence, type, className }: { evidence?: EvidenceRecord; type?: EvidenceTypeFilter; className?: string }) {
  let resolvedType: ConcreteEvidenceType = 'FILE'
  if (type && type !== 'ALL') {
    resolvedType = type
  } else if (evidence) {
    resolvedType = getEvidenceType(evidence)
  }
  const config = TYPE_CONFIG[resolvedType]

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold', config.className, className)}>
      {config.icon}
      {config.label}
    </span>
  )
}
