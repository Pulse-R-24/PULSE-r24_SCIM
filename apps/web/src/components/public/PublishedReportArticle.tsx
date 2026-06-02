import type { PublicReportDetail } from '@modules/reports/types'
import { PublicArticleHeader } from '@/components/public/PublicArticleHeader'
import { PublicMarkdownRenderer } from '@/components/public/PublicMarkdownRenderer'
import { PublicTagList } from '@/components/public/PublicTagList'

export function PublishedReportArticle({ report }: { report: PublicReportDetail }) {
  return (
    <article>
      <PublicArticleHeader report={report} />
      <div className="mx-auto max-w-4xl border-x border-slate-900/5 bg-white/55 px-4 py-10 sm:px-6 lg:px-10">
        <PublicMarkdownRenderer markdown={report.body_markdown} />
        <PublicTagList tags={report.tags} />
      </div>
    </article>
  )
}
