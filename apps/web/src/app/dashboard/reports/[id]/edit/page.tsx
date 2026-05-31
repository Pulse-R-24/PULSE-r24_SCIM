import { ReportEditorClient } from '@/components/report-editor/ReportEditorClient'

export default async function EditReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ReportEditorClient reportId={id} />
}
