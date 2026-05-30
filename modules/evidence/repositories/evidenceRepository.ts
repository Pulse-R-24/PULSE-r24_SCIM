import prisma from '@pulse-r24/database/src/client'

export async function createEvidenceRecord(data: {
  reportId: string
  title: string
  description?: string
  url?: string
  mediaId?: string
  userId?: string
}) {
  return prisma.evidence.create({
    data: {
      reportId: data.reportId,
      title: data.title,
      description: data.description,
      url: data.url,
      mediaId: data.mediaId,
      createdById: data.userId
    }
  })
}

export async function findEvidenceByReport(reportId: string) {
  return prisma.evidence.findMany({
    where: { reportId, deleted_at: null },
    include: {
      media: true,
      created_by: true
    },
    orderBy: { created_at: 'desc' }
  })
}

export async function deleteEvidenceRecord(id: string) {
  return prisma.evidence.update({
    where: { id },
    data: { deleted_at: new Date() }
  })
}
