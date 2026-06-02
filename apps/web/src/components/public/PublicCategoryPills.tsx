import Link from 'next/link'
import type { PublicReportCategory } from '@modules/reports/types'

export function PublicCategoryPills({
  categories,
  activeSlug,
}: {
  categories: PublicReportCategory[]
  activeSlug?: string
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <Link
        href="/news"
        className={`whitespace-nowrap rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition ${
          !activeSlug ? 'bg-rose-900 text-white shadow-md' : 'border border-slate-900/10 bg-white text-slate-500 hover:border-rose-900/20 hover:text-rose-800'
        }`}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/category/${category.slug}`}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition ${
            activeSlug === category.slug ? 'bg-rose-900 text-white shadow-md' : 'border border-slate-900/10 bg-white text-slate-500 hover:border-rose-900/20 hover:text-rose-800'
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  )
}
