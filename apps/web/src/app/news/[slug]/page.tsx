import { notFound } from 'next/navigation'
import { PublishedReportArticle } from '@/components/public/PublishedReportArticle'
import { PublicLayout } from '@/components/public/PublicLayout'
import { PublicRelatedReports } from '@/components/public/PublicRelatedReports'
import { getPublicReportBySlug, getRelatedPublicReports } from '@modules/reports/services/reportService'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const report = await getPublicReportBySlug(slug)
  if (!report) return { title: 'Report not found | PULSE-R24' }
  return {
    title: `${report.title} | PULSE-R24`,
    description: report.excerpt
  }
}

export default async function PublicReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const report = await getPublicReportBySlug(slug)
  if (!report) notFound()

  const related = await getRelatedPublicReports(report)

  return (
    <PublicLayout>
      <PublishedReportArticle report={report} />
      <PublicRelatedReports reports={related} />
    </PublicLayout>
  )
}
