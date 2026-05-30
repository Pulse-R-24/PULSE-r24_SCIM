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

export async function upsertReportCategories(reportId: string, categoryIds: string[]) {
  const tasks = categoryIds.map((categoryId) =>
    prisma.reportCategory.upsert({
      where: { reportId_categoryId: { reportId, categoryId } },
      update: {},
      create: { reportId, categoryId }
    })
  )
  return Promise.all(tasks)
}

export async function connectReportTags(reportId: string, tagNames: string[]) {
  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name }
      })
    )
  )

  return Promise.all(
    tags.map((tag) =>
      prisma.reportTag.upsert({
        where: { reportId_tagId: { reportId, tagId: tag.id } },
        update: {},
        create: { reportId, tagId: tag.id }
      })
    )
  )
}

export async function updateReportRecord(reportId: string, data: Partial<{ title: string; body_markdown: string; status: string }>) {
  const updatePayload: any = {}
  if (data.title) updatePayload.title = data.title
  if (data.body_markdown) updatePayload.body_markdown = data.body_markdown
  if (data.status) {
    updatePayload.workflowState = { connect: { key: data.status } }
  }

  return prisma.report.update({
    where: { id: reportId },
    data: updatePayload
  })
}

export async function findReportById(reportId: string) {
  return prisma.report.findUnique({
    where: { id: reportId },
    include: {
      revisions: true,
      categories: { include: { category: true } },
      tags: { include: { tag: true } }
    }
  })
}

export async function findDraftsByAuthor(authorId: string) {
  return prisma.report.findMany({
    where: { authorId, workflowState: { key: 'DRAFT' } },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } }
    }
  })
}

export async function listReports(opts?: { skip?: number; take?: number; status?: string }) {
  const where: any = {}
  if (opts?.status) where.workflowState = { key: opts.status }

  return prisma.report.findMany({
    where,
    skip: opts?.skip,
    take: opts?.take,
    orderBy: { updated_at: 'desc' },
    include: {
      revisions: true,
      categories: { include: { category: true } },
      tags: { include: { tag: true } }
    }
  })
}

export async function deleteReport(reportId: string) {
  return prisma.report.delete({ where: { id: reportId } })
}
