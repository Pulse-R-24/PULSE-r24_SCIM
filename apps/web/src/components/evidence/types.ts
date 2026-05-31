export type EvidenceTypeFilter = 'ALL' | 'FILE' | 'IMAGE' | 'PDF' | 'VIDEO' | 'URL' | 'DOCUMENT'
export type EvidenceType = Exclude<EvidenceTypeFilter, 'ALL'>

export interface EvidenceRecord {
  id: string
  reportId: string
  title: string
  description?: string | null
  url?: string | null
  mediaId?: string | null
  created_at: string
  media?: {
    id: string
    bucket: string
    path: string
    mime_type: string
    size: number
    uploadedById?: string | null
    created_at: string
  } | null
  report?: {
    id: string
    title: string
    status?: { key: string; label?: string | null } | null
    author?: { name?: string | null; email: string } | null
  } | null
  created_by?: { name?: string | null; email: string } | null
}

export function getEvidenceType(evidence: EvidenceRecord): EvidenceType {
  const mime = evidence.media?.mime_type?.toLowerCase()
  if (evidence.url && !evidence.media) return 'URL'
  if (!mime) return 'DOCUMENT'
  if (mime.startsWith('image/')) return 'IMAGE'
  if (mime === 'application/pdf') return 'PDF'
  if (mime.startsWith('video/')) return 'VIDEO'
  if (mime.includes('document') || mime.includes('text') || mime.includes('word')) return 'DOCUMENT'
  return 'FILE'
}

export function formatBytes(bytes?: number) {
  if (!bytes) return 'Unknown size'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
