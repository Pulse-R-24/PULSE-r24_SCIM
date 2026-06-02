import prisma from '@pulse-r24/database/src/client'

function createSlug(title: string) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
  return `${base}-${Date.now()}`
}

export async function createReportRecord(data: {
  title: string
  body_markdown: string
  authorId: string
  status: string
}) {
  return prisma.report.create({
    data: {
      title: data.title,
      slug: createSlug(data.title),
      body_markdown: data.body_markdown,
      author: { connect: { id: data.authorId } },
      created_by: { connect: { id: data.authorId } },
      status: {
        connect: { key: data.status }
      }
    }
  })
}

export async function createReportRevision(reportId: string, body_markdown: string, createdById?: string) {
  return prisma.reportRevision.create({
    data: {
      reportId,
      body_markdown,
      createdById
    }
  })
}

export async function upsertReportCategories(reportId: string, categoryIds: string[], userId?: string) {
  // First clear old connections
  await prisma.reportCategory.deleteMany({
    where: { reportId }
  })
  
  // Connect categories, and ensure categories exist or link them
  const tasks = categoryIds.map((categoryId) =>
    prisma.reportCategory.create({
      data: { reportId, categoryId }
    })
  )
  return Promise.all(tasks)
}

export async function connectReportTags(reportId: string, tagNames: string[], userId?: string) {
  // First clear old tag connections
  await prisma.reportTag.deleteMany({
    where: { reportId }
  })

  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name, createdById: userId }
      })
    )
  )

  return Promise.all(
    tags.map((tag) =>
      prisma.reportTag.create({
        data: { reportId, tagId: tag.id }
      })
    )
  )
}

export async function updateReportRecord(reportId: string, data: Partial<{ title: string; body_markdown: string; status: string; updatedById: string }>) {
  const updatePayload: any = {}
  if (data.title) updatePayload.title = data.title
  if (data.body_markdown) updatePayload.body_markdown = data.body_markdown
  if (data.status) {
    updatePayload.status = { connect: { key: data.status } }
  }
  if (data.updatedById) {
    updatePayload.updated_by = { connect: { id: data.updatedById } }
  }

  return prisma.report.update({
    where: { id: reportId },
    data: updatePayload
  })
}

export async function findReportById(reportId: string) {
  return prisma.report.findFirst({
    where: { id: reportId, deleted_at: null },
    include: {
      revisions: { orderBy: { created_at: 'desc' } },
      status: true,
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      evidence: { where: { deleted_at: null }, include: { media: true } },
      author: true,
      locked_by: true
    }
  })
}

export async function findDraftsByAuthor(authorId: string) {
  return prisma.report.findMany({
    where: { authorId, status: { key: 'DRAFT' }, deleted_at: null },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      evidence: { where: { deleted_at: null } },
      author: true
    }
  })
}

export async function listReports(opts?: { skip?: number; take?: number; status?: string; assignedReviewerId?: string }) {
  const where: any = { deleted_at: null }
  if (opts?.status) where.status = { key: opts.status }
  if (opts?.assignedReviewerId) {
    where.assignments = {
      some: {
        reviewerId: opts.assignedReviewerId,
        completed_at: null
      }
    }
  }

  return prisma.report.findMany({
    where,
    skip: opts?.skip,
    take: opts?.take,
    orderBy: { updated_at: 'desc' },
    include: {
      revisions: true,
      status: true,
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      evidence: { where: { deleted_at: null } },
      author: true,
      assignments: {
        include: {
          reviewer: true
        },
        orderBy: { assigned_at: 'desc' }
      }
    }
  })
}

export async function deleteReport(reportId: string) {
  return prisma.report.update({
    where: { id: reportId },
    data: { deleted_at: new Date() }
  })
}

export async function acquireReportLock(reportId: string, userId: string) {
  return prisma.report.update({
    where: { id: reportId },
    data: {
      lockedById: userId,
      locked_at: new Date()
    }
  })
}

export async function releaseReportLock(reportId: string) {
  return prisma.report.update({
    where: { id: reportId },
    data: {
      lockedById: null,
      locked_at: null
    }
  })
}

export async function listCategories() {
  return prisma.category.findMany({
    where: { deleted_at: null },
    orderBy: { name: 'asc' }
  })
}

export async function listTags() {
  return prisma.tag.findMany({
    where: { deleted_at: null },
    orderBy: { name: 'asc' }
  })
}

const publicReportInclude = {
  status: true,
  author: { select: { name: true } },
  categories: { include: { category: true } },
  tags: { include: { tag: true } },
  history: {
    where: { action: 'PUBLISH' },
    orderBy: { created_at: 'desc' as const },
    take: 1,
    select: { created_at: true }
  }
}

export async function listPublishedReportsForPublic(opts?: {
  q?: string
  categoryId?: string
  tagName?: string
  skip?: number
  take?: number
}) {
  const where: any = {
    deleted_at: null,
    status: { key: 'PUBLISHED' }
  }

  if (opts?.q) {
    where.OR = [
      { title: { contains: opts.q } },
      { body_markdown: { contains: opts.q } }
    ]
  }

  if (opts?.categoryId) {
    where.categories = { some: { categoryId: opts.categoryId } }
  }

  if (opts?.tagName) {
    where.tags = { some: { tag: { name: opts.tagName } } }
  }

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      skip: opts?.skip,
      take: opts?.take,
      orderBy: { updated_at: 'desc' },
      include: publicReportInclude
    }),
    prisma.report.count({ where })
  ])

  return { reports, total }
}

export async function findPublishedReportBySlug(slug: string) {
  return prisma.report.findFirst({
    where: {
      slug,
      deleted_at: null,
      status: { key: 'PUBLISHED' }
    },
    include: publicReportInclude
  })
}

export async function listPublicReportCategories() {
  return prisma.category.findMany({
    where: {
      deleted_at: null,
      reports: {
        some: {
          report: {
            deleted_at: null,
            status: { key: 'PUBLISHED' }
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  })
}

