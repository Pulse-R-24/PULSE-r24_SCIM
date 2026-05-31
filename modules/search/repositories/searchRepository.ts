import prisma from '@pulse-r24/database/src/client'
import type { GlobalSearchInput, GlobalSearchResult, SearchResultItem } from '../types'

function dateRange(input: GlobalSearchInput) {
  if (!input.dateFrom && !input.dateTo) return undefined
  return {
    ...(input.dateFrom ? { gte: new Date(input.dateFrom) } : {}),
    ...(input.dateTo ? { lte: new Date(input.dateTo) } : {})
  }
}

function parseMeta(meta?: string | null) {
  if (!meta) return null
  try {
    return JSON.parse(meta) as Record<string, unknown>
  } catch {
    return null
  }
}

function evidenceTypeWhere(type?: string) {
  if (!type || type === 'ALL') return {}
  if (type === 'URL') return { url: { not: null }, mediaId: null }
  if (type === 'IMAGE') return { media: { mime_type: { startsWith: 'image/' } } }
  if (type === 'PDF') return { media: { mime_type: 'application/pdf' } }
  if (type === 'VIDEO') return { media: { mime_type: { startsWith: 'video/' } } }
  if (type === 'FILE') return { mediaId: { not: null } }
  return {
    OR: [
      { media: { mime_type: { contains: 'text' } } },
      { media: { mime_type: { contains: 'document' } } },
      { mediaId: null, url: null }
    ]
  }
}

export async function globalSearch(input: GlobalSearchInput): Promise<GlobalSearchResult> {
  const q = input.q?.trim()
  const createdRange = dateRange(input)
  const evidenceReportFilters = {
    ...(input.status ? { status: { key: input.status } } : {}),
    ...(input.categoryId ? { categories: { some: { categoryId: input.categoryId } } } : {}),
    ...(input.tagName ? { tags: { some: { tag: { name: input.tagName } } } } : {})
  }
  const actorMatches = input.actor?.trim()
    ? await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: input.actor.trim() } },
            { email: { contains: input.actor.trim() } }
          ]
        },
        select: { id: true }
      })
    : []
  const actorIds = actorMatches.map((actor) => actor.id)

  const includeReports = !input.resultType || input.resultType === 'ALL' || input.resultType === 'REPORT'
  const includeEvidence = !input.resultType || input.resultType === 'ALL' || input.resultType === 'EVIDENCE'
  const includeWorkflow = !input.resultType || input.resultType === 'ALL' || input.resultType === 'WORKFLOW'
  const includeActivity = !input.resultType || input.resultType === 'ALL' || input.resultType === 'ACTIVITY'

  const [reports, evidence, workflow, activity] = await Promise.all([
    includeReports
      ? prisma.report.findMany({
          where: {
            deleted_at: null,
            ...(q ? { OR: [{ title: { contains: q } }, { body_markdown: { contains: q } }] } : {}),
            ...(input.status ? { status: { key: input.status } } : {}),
            ...(input.categoryId ? { categories: { some: { categoryId: input.categoryId } } } : {}),
            ...(input.tagName ? { tags: { some: { tag: { name: input.tagName } } } } : {}),
            ...(actorIds.length ? { authorId: { in: actorIds } } : {}),
            ...(createdRange ? { created_at: createdRange } : {})
          },
          take: 20,
          orderBy: { updated_at: 'desc' },
          include: {
            status: true,
            author: true,
            categories: { include: { category: true } },
            tags: { include: { tag: true } }
          }
        })
      : [],
    includeEvidence
      ? prisma.evidence.findMany({
          where: {
            deleted_at: null,
            ...evidenceTypeWhere(input.evidenceType),
            ...(q
              ? {
                  OR: [
                    { title: { contains: q } },
                    { description: { contains: q } },
                    { url: { contains: q } },
                    { report: { title: { contains: q } } }
                  ]
                }
              : {}),
            ...(Object.keys(evidenceReportFilters).length ? { report: evidenceReportFilters } : {}),
            ...(actorIds.length ? { createdById: { in: actorIds } } : {}),
            ...(createdRange ? { created_at: createdRange } : {})
          },
          take: 20,
          orderBy: { created_at: 'desc' },
          include: {
            media: true,
            created_by: true,
            report: { include: { status: true } }
          }
        })
      : [],
    includeWorkflow
      ? prisma.workflowHistory.findMany({
          where: {
            ...(q ? { OR: [{ action: { contains: q } }, { report: { title: { contains: q } } }, { meta: { contains: q } }] } : {}),
            ...(input.status ? { report: { status: { key: input.status } } } : {}),
            ...(actorIds.length ? { actorId: { in: actorIds } } : {}),
            ...(createdRange ? { created_at: createdRange } : {})
          },
          take: 20,
          orderBy: { created_at: 'desc' },
          include: {
            actor: true,
            report: { include: { status: true } }
          }
        })
      : [],
    includeActivity
      ? prisma.activityFeed.findMany({
          where: {
            ...(q ? { OR: [{ action: { contains: q } }, { entityType: { contains: q } }, { meta: { contains: q } }] } : {}),
            ...(actorIds.length ? { actorId: { in: actorIds } } : {}),
            ...(createdRange ? { created_at: createdRange } : {})
          },
          take: 20,
          orderBy: { created_at: 'desc' },
          include: { actor: true }
        })
      : []
  ])

  return {
    reports: reports.map((report): SearchResultItem => ({
      id: report.id,
      type: 'REPORT',
      title: report.title,
      summary: report.body_markdown.slice(0, 180),
      status: report.status.key,
      subtype: [...report.categories.map((item) => item.category.name), ...report.tags.map((item) => item.tag.name)].slice(0, 4).join(', '),
      user: report.author?.name || report.author?.email || null,
      href: `/dashboard/reports/${report.id}/edit`,
      created_at: report.created_at.toISOString(),
      updated_at: report.updated_at.toISOString()
    })),
    evidence: evidence.map((item): SearchResultItem => ({
      id: item.id,
      type: 'EVIDENCE',
      title: item.title,
      summary: item.description || item.url || item.media?.path || null,
      status: item.report.status.key,
      subtype: item.media?.mime_type || (item.url ? 'URL' : 'DOCUMENT'),
      user: item.created_by?.name || item.created_by?.email || null,
      href: `/dashboard/reports/${item.reportId}/evidence`,
      created_at: item.created_at.toISOString(),
      updated_at: item.updated_at.toISOString()
    })),
    workflow: workflow.map((item): SearchResultItem => {
      const meta = parseMeta(item.meta)
      return {
        id: item.id,
        type: 'WORKFLOW',
        title: item.report.title,
        summary: typeof meta?.comment === 'string' ? meta.comment : item.action.replace(/_/g, ' '),
        status: item.report.status.key,
        subtype: item.action,
        user: item.actor?.name || item.actor?.email || null,
        href: '/dashboard/workflow-history',
        created_at: item.created_at.toISOString()
      }
    }),
    activity: activity.map((item): SearchResultItem => {
      const meta = parseMeta(item.meta)
      return {
        id: item.id,
        type: 'ACTIVITY',
        title: String(meta?.title || meta?.reportTitle || item.entityId || item.entityType),
        summary: typeof meta?.comment === 'string' ? meta.comment : item.action.replace(/_/g, ' '),
        subtype: item.action,
        user: item.actor?.name || item.actor?.email || null,
        href: item.entityType === 'REPORT' && item.entityId ? `/dashboard/reports/${item.entityId}/edit` : '/dashboard/activity',
        created_at: item.created_at.toISOString()
      }
    })
  }
}
