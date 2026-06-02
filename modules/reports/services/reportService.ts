import { reportCreateSchema, reportUpdateSchema } from '../validators/reportValidator'
import * as repo from '../repositories/reportRepository'
import { createWorkflowHistory } from '@modules/workflow/repositories/workflowRepository'
import { logActivity } from '@modules/activities'
import { auditService } from '@pulse-r24/audit'
import type { ReportInput, ReportUpdateInput } from '../types'
import type {
  PublicReportCategory,
  PublicReportDetail,
  PublicReportListInput,
  PublicReportListResult,
  PublicReportSummary
} from '../types'

export async function createReport(input: ReportInput, authorId: string) {
  const parsed = reportCreateSchema.parse(input)

  const report = await repo.createReportRecord({
    title: parsed.title,
    body_markdown: parsed.body_markdown,
    authorId,
    status: parsed.status
  })

  await repo.upsertReportCategories(report.id, parsed.categoryIds, authorId)
  await repo.connectReportTags(report.id, parsed.tagNames, authorId)
  await repo.createReportRevision(report.id, parsed.body_markdown, authorId)
  await createWorkflowHistory(report.id, 'DRAFT_CREATED', authorId, {
    nextStatus: parsed.status
  })

  await auditService.log({
    actorId: authorId,
    action: 'report_create',
    entity: 'REPORT',
    entityId: report.id,
    meta: { title: report.title, status: parsed.status }
  })

  await logActivity(authorId, 'report_created', 'REPORT', report.id, {
    title: report.title,
    status: parsed.status
  })

  return report
}

export async function updateReport(reportId: string, input: ReportUpdateInput, actorId: string) {
  const parsed = reportUpdateSchema.parse(input)

  const existing = await repo.findReportById(reportId)
  if (!existing) {
    throw new Error('Report not found')
  }

  // Edit conflict/lock check
  if (existing.lockedById && existing.lockedById !== actorId) {
    throw new Error(`Conflict: Report is locked by ${existing.locked_by?.name || existing.lockedById}`)
  }

  const updated = await repo.updateReportRecord(reportId, {
    title: parsed.title,
    body_markdown: parsed.body_markdown,
    status: parsed.status,
    updatedById: actorId
  })

  if (parsed.categoryIds) {
    await repo.upsertReportCategories(reportId, parsed.categoryIds, actorId)
  }

  if (parsed.tagNames) {
    await repo.connectReportTags(reportId, parsed.tagNames, actorId)
  }

  if (parsed.body_markdown) {
    await repo.createReportRevision(reportId, parsed.body_markdown, actorId)
  }

  await auditService.log({
    actorId,
    action: 'report_edit',
    entity: 'REPORT',
    entityId: reportId,
    meta: {
      changes: parsed,
      previousStatus: existing.status?.key,
      newStatus: parsed.status ?? existing.status?.key
    }
  })

  await logActivity(actorId, 'report_updated', 'REPORT', reportId, {
    title: parsed.title ?? existing.title,
    previousStatus: existing.status?.key,
    status: parsed.status ?? existing.status?.key
  })

  return updated
}

export async function acquireLock(reportId: string, actorId: string) {
  const existing = await repo.findReportById(reportId)
  if (!existing) throw new Error('Report not found')
  
  if (existing.lockedById && existing.lockedById !== actorId) {
    // If lock is older than 5 minutes, we can allow breaking it. Otherwise throw error.
    const lockAgeMs = Date.now() - new Date(existing.locked_at!).getTime()
    if (lockAgeMs < 5 * 60 * 1000) {
      throw new Error(`Report is currently locked by ${existing.locked_by?.name || 'another editor'}`)
    }
  }

  return repo.acquireReportLock(reportId, actorId)
}

export async function releaseLock(reportId: string, actorId: string) {
  const existing = await repo.findReportById(reportId)
  if (!existing) throw new Error('Report not found')
  
  if (existing.lockedById && existing.lockedById !== actorId) {
    throw new Error('You do not own the lock on this report')
  }

  return repo.releaseReportLock(reportId)
}

export async function getReport(reportId: string) {
  return repo.findReportById(reportId)
}

export async function listDrafts(authorId: string) {
  return repo.findDraftsByAuthor(authorId)
}

export async function listReports(opts?: { skip?: number; take?: number; status?: string; assignedReviewerId?: string }) {
  return repo.listReports(opts)
}

export async function listReportTaxonomy() {
  const [categories, tags] = await Promise.all([
    repo.listCategories(),
    repo.listTags()
  ])

  return { categories, tags }
}

export function createPublicSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function stripMarkdown(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function createExcerpt(markdown: string) {
  const plain = stripMarkdown(markdown)
  if (plain.length <= 220) return plain
  return `${plain.slice(0, 220).trim()}...`
}

function createReadTime(markdown: string) {
  const words = stripMarkdown(markdown).split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

function toPublicCategory(name?: string): PublicReportCategory | null {
  if (!name) return null
  return { name, slug: createPublicSlug(name) }
}

function getPublishedDate(report: { history?: { created_at: Date }[]; updated_at: Date; created_at: Date }) {
  return (report.history?.[0]?.created_at ?? report.updated_at ?? report.created_at).toISOString()
}

function mapPublicSummary(report: any): PublicReportSummary {
  const categoryName = report.categories?.[0]?.category?.name

  return {
    title: report.title,
    slug: report.slug,
    excerpt: createExcerpt(report.body_markdown),
    published_at: getPublishedDate(report),
    category: toPublicCategory(categoryName),
    tags: report.tags?.map((item: any) => item.tag.name).filter(Boolean) ?? [],
    byline: report.author?.name || 'PULSE-R24 Editorial Desk',
    readTime: createReadTime(report.body_markdown)
  }
}

function mapPublicDetail(report: any): PublicReportDetail {
  return {
    ...mapPublicSummary(report),
    body_markdown: report.body_markdown
  }
}

export async function listPublicCategories(): Promise<PublicReportCategory[]> {
  const categories = await repo.listPublicReportCategories()
  return categories.map((category) => ({ name: category.name, slug: createPublicSlug(category.name) }))
}

export async function listPublicReports(input: PublicReportListInput = {}): Promise<PublicReportListResult> {
  const take = Math.min(Math.max(input.take ?? 9, 1), 24)
  const skip = Math.max(input.skip ?? 0, 0)
  const publicCategoryRows = await repo.listPublicReportCategories()
  const categories = publicCategoryRows.map((item) => ({ name: item.name, slug: createPublicSlug(item.name) }))
  const category = input.categorySlug
    ? publicCategoryRows.find((item) => createPublicSlug(item.name) === input.categorySlug)
    : undefined

  if (input.categorySlug && !category) {
    return { reports: [], total: 0, categories }
  }

  const publicQuery: {
    q?: string
    categoryId?: string
    tagName?: string
    skip?: number
    take?: number
  } = { skip, take }
  const q = input.q?.trim()
  const tagName = input.tag?.trim()
  if (q) publicQuery.q = q
  if (category) publicQuery.categoryId = category.id
  if (tagName) publicQuery.tagName = tagName

  const { reports, total } = await repo.listPublishedReportsForPublic(publicQuery)

  return {
    reports: reports.map(mapPublicSummary),
    total,
    categories
  }
}

export async function getPublicReportBySlug(slug: string): Promise<PublicReportDetail | null> {
  const report = await repo.findPublishedReportBySlug(slug)
  return report ? mapPublicDetail(report) : null
}

export async function getRelatedPublicReports(report: PublicReportDetail, take = 3) {
  const primaryTag = report.tags[0]
  if (!primaryTag) return []

  const result = await listPublicReports({
    tag: primaryTag,
    take: take + 1
  })
  return result.reports.filter((item) => item.slug !== report.slug).slice(0, take)
}

export async function publishReport(reportId: string, actorId: string) {
  const existing = await repo.findReportById(reportId)
  if (!existing) throw new Error('Report not found')

  const updated = await repo.updateReportRecord(reportId, { status: 'PUBLISHED', updatedById: actorId })

  await auditService.log({
    actorId,
    action: 'report_publish',
    entity: 'REPORT',
    entityId: reportId,
    meta: { previousStatus: existing.status?.key, newStatus: 'PUBLISHED' }
  })

  return updated
}

export async function deleteReport(reportId: string, actorId: string) {
  const existing = await repo.findReportById(reportId)
  if (!existing) throw new Error('Report not found')

  const deleted = await repo.deleteReport(reportId)

  await auditService.log({
    actorId,
    action: 'report_delete',
    entity: 'REPORT',
    entityId: reportId,
    meta: { title: existing.title }
  })

  return deleted
}
