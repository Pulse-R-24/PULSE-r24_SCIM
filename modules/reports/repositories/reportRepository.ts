import prisma from '@pulse-r24/database/src/client'

export async function createReportRecord(data: {
  title: string
  body_markdown: string
  authorId: string
  status: string
}) {
  return prisma.report.create({
    data: {
      title: data.title,
      body_markdown: data.body_markdown,
      authorId: data.authorId,
      createdById: data.authorId,
      workflowState: {
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
    updatePayload.workflowState = { connect: { key: data.status } }
  }
  if (data.updatedById) {
    updatePayload.updatedById = data.updatedById
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
    where: { authorId, workflowState: { key: 'DRAFT' }, deleted_at: null },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      evidence: { where: { deleted_at: null } },
      author: true
    }
  })
}

export async function listReports(opts?: { skip?: number; take?: number; status?: string }) {
  const where: any = { deleted_at: null }
  if (opts?.status) where.workflowState = { key: opts.status }

  return prisma.report.findMany({
    where,
    skip: opts?.skip,
    take: opts?.take,
    orderBy: { updated_at: 'desc' },
    include: {
      revisions: true,
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      evidence: { where: { deleted_at: null } },
      author: true
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

