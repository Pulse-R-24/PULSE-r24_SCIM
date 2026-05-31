import Link from 'next/link'
import { ExternalLink, UserRound } from 'lucide-react'
import { ReviewStatusBadge } from '@/components/assigned/ReviewStatusBadge'
import { SearchTypeBadge } from '@/components/search/SearchTypeBadge'
import type { SearchResultItem } from '@/components/search/types'
import { formatDate } from '@/lib/utils'

export function SearchResultCard({ result }: { result: SearchResultItem }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <SearchTypeBadge type={result.type} />
            {result.status && <ReviewStatusBadge status={result.status} />}
            {result.subtype && <span className="rounded-full border border-slate-700/70 px-2.5 py-1 text-xs font-semibold text-slate-400">{result.subtype.replace(/_/g, ' ')}</span>}
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-100">{result.title}</p>
          {result.summary && <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-400">{result.summary}</p>}
        </div>
        <Link href={result.href} className="shrink-0 rounded-md p-2 text-slate-500 hover:bg-blue-500/10 hover:text-blue-300" title="Open result">
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        {result.user && (
          <span className="inline-flex items-center gap-1">
            <UserRound className="w-3.5 h-3.5" />
            {result.user}
          </span>
        )}
        {result.updated_at && <span>Updated {formatDate(result.updated_at)}</span>}
        {!result.updated_at && result.created_at && <span>{formatDate(result.created_at)}</span>}
      </div>
    </div>
  )
}
