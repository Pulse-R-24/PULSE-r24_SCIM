import Link from 'next/link'

export function PublicTagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null

  return (
    <div className="mt-12 border-t border-slate-900/10 pt-6">
      <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Tags</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link key={tag} href={`/public-search?q=${encodeURIComponent(tag)}`} className="rounded bg-slate-100 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-slate-500 hover:bg-rose-100 hover:text-rose-800">
            #{tag}
          </Link>
        ))}
      </div>
    </div>
  )
}
