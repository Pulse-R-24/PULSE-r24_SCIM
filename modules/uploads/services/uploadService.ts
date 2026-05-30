import { createSignedUploadUrl, downloadFileAsBuffer, validateMimeAndMagic } from '@pulse-r24/storage'
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

  // Download the uploaded object to validate MIME and size
  const buffer = await downloadFileAsBuffer(parsed.bucket, parsed.path)

  // Validate magic bytes / MIME
  await validateMimeAndMagic(buffer, parsed.mimeType)

  // Validate size matches the uploaded file
  if (buffer.length !== parsed.size) {
    throw new Error(`File size mismatch: expected ${parsed.size}, got ${buffer.length}`)
  }

  const entry = await repository.createMediaEntry({
    ...parsed,
    uploadedById: actorId
  })

  await auditService.log({
    actorId,
    action: 'upload',
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
