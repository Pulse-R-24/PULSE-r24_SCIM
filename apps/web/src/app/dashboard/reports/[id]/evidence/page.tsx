import { ReportEvidenceClient } from '@/components/evidence/ReportEvidenceClient'

export default async function ReportEvidencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ReportEvidenceClient reportId={id} />
}
