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
    <section className="rounded-3xl border border-slate-900/10 bg-white/75 p-4 shadow-sm backdrop-blur sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <PublicSearchInput defaultValue={query} />
        <PublicCategoryPills categories={categories} activeSlug={activeCategory} />
      </div>
    </section>
  )
}
