import type { PublicReportDetail } from '@modules/reports/types'
import { PublicArticleHeader } from '@/components/public/PublicArticleHeader'
import { PublicMarkdownRenderer } from '@/components/public/PublicMarkdownRenderer'
import { PublicTagList } from '@/components/public/PublicTagList'

export function PublishedReportArticle({ report }: { report: PublicReportDetail }) {
  return (
    <article>
      <PublicArticleHeader report={report} />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <PublicMarkdownRenderer markdown={report.body_markdown} />
        <PublicTagList tags={report.tags} />
      </div>
    </article>
  )
}
