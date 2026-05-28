import prisma from '@pulse-r24/database/src/client'
import type { UploadCompleteRequest } from '../types'

export async function createMediaEntry(data: UploadCompleteRequest & { uploadedById?: string }) {
  return prisma.media.create({
    data: {
      bucket: data.bucket,
      path: data.path,
      mime_type: data.mimeType,
      size: data.size,
      uploadedById: data.uploadedById
    }
  })
}

export async function findMediaByPath(bucket: string, path: string) {
  return prisma.media.findFirst({ where: { bucket, path } })
}
