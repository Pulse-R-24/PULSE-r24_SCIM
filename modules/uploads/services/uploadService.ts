import { createSignedUploadUrl } from '@pulse-r24/storage'
import { auditService } from '@pulse-r24/audit'
import { uploadSignedUrlSchema, uploadCompleteSchema } from '../validators/uploadValidator'
import * as repository from '../repositories/uploadRepository'
import type { UploadSignedUrlRequest, UploadCompleteRequest } from '../types'

export async function generateUploadUrl(input: UploadSignedUrlRequest) {
  const parsed = uploadSignedUrlSchema.parse(input)
  return createSignedUploadUrl(parsed.bucket, parsed.path, parsed.expiresIn ?? 60)
}

export async function registerUpload(input: UploadCompleteRequest, actorId?: string) {
  const parsed = uploadCompleteSchema.parse(input)
  const existing = await repository.findMediaByPath(parsed.bucket, parsed.path)
  if (existing) {
    throw new Error('Upload metadata already exists for this path')
  }

  const entry = await repository.createMediaEntry({
    ...parsed,
    uploadedById: actorId
  })

  await auditService.log({
    actorId,
    action: 'MEDIA_UPLOADED',
    entity: 'MEDIA',
    entityId: entry.id,
    meta: {
      bucket: entry.bucket,
      path: entry.path,
      mime_type: entry.mime_type,
      size: entry.size
    }
  })

  return entry
}
