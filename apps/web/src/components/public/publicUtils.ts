import type { PublicReportSummary } from '@modules/reports/types'

export function formatPublicDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(typeof date === 'string' ? new Date(date) : date)
}

export function formatLongPublicDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(typeof date === 'string' ? new Date(date) : date)
}

export function getIssueNumber(date: string | Date = new Date()) {
  const baseDate = new Date('2025-12-01T00:00:00.000Z')
  const current = typeof date === 'string' ? new Date(date) : date
  const diff = Math.max(0, Math.floor((current.getTime() - baseDate.getTime()) / 86_400_000))
  return `ISSP_RRUPY/Issue No.${diff + 1}/2025-26`
}

export function getReportHref(report: Pick<PublicReportSummary, 'slug'>) {
  return `/news/${report.slug}`
}
