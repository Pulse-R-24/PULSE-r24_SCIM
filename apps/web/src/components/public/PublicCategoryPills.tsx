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
    <div className="flex gap-2 overflow-x-auto border-t border-slate-200 pt-4">
      <Link
        href="/news"
        className={`whitespace-nowrap border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] transition ${
          !activeSlug ? 'border-[#8b0000] bg-[#8b0000] text-white' : 'border-slate-200 bg-white text-slate-500 hover:border-[#8b0000]/40 hover:text-[#8b0000]'
        }`}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/category/${category.slug}`}
          className={`whitespace-nowrap border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] transition ${
            activeSlug === category.slug ? 'border-[#8b0000] bg-[#8b0000] text-white' : 'border-slate-200 bg-white text-slate-500 hover:border-[#8b0000]/40 hover:text-[#8b0000]'
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  )
}
