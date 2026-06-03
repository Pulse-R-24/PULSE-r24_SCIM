import type { PublicReportCategory } from '@modules/reports/types'
import { PublicCategoryPills } from '@/components/public/PublicCategoryPills'
import { PublicSearchInput } from '@/components/public/PublicSearchInput'

export function PublicFilters({
  categories,
  activeCategory,
  query,
}: {
  categories: PublicReportCategory[]
  activeCategory?: string
  query?: string
}) {
  return (
    <section className="bg-transparent">
      <div className="flex flex-col gap-5">
        <PublicSearchInput defaultValue={query} />
        <PublicCategoryPills categories={categories} activeSlug={activeCategory} />
      </div>
    </section>
  )
}
