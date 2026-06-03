import { PublicFilters } from '@/components/public/PublicFilters'
import { PublicLayout } from '@/components/public/PublicLayout'
import { PublishedReportGrid } from '@/components/public/PublishedReportGrid'
import { listPublicReports } from '@modules/reports/services/reportService'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return { title: `Category ${slug} | PULSE-R24` }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const result = await listPublicReports({ categorySlug: slug, take: 18 })
  const category = result.categories.find((item) => item.slug === slug)

  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <div>
          <div className="public-rule-label">
            <span className="h-px w-10 bg-[#8b0000]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#8b0000]" />
            <span>Domain Archive</span>
          </div>
          <h1 className="font-editorial mt-5 text-5xl font-black tracking-tight text-slate-950">{category?.name ?? 'Category'}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Published reports classified under this public intelligence domain.</p>
        </div>
        <PublicFilters categories={result.categories} activeCategory={slug} />
        <PublishedReportGrid reports={result.reports} />
      </section>
    </PublicLayout>
  )
}
