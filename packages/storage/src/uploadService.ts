import { supabaseAdmin } from './client'
import type { UploadMetadata, UploadSignedUrl } from './types'
import { fileTypeFromBuffer } from 'file-type'

const allowedMimeMap: Record<string, string[]> = {
  'image': ['image/png', 'image/jpeg', 'image/webp'],
  'application': ['application/pdf']
}

export async function validateMimeAndMagic(buffer: Buffer, expectedMime: string) {
  const fileType = await fileTypeFromBuffer(buffer)
  if (!fileType) {
    throw new Error('Uploaded file type could not be detected')
  }
  if (fileType.mime !== expectedMime) {
    throw new Error(`MIME mismatch: expected ${expectedMime}, got ${fileType.mime}`)
  }
  const allowed = Object.values(allowedMimeMap).flat()
  if (!allowed.includes(fileType.mime)) {
    throw new Error(`Unsupported MIME type: ${fileType.mime}`)
  }
  return fileType.mime
}

export async function createSignedUploadUrl(bucket: string, path: string, expiresIn = 60) {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUploadUrl(path, expiresIn)

  if (error || !data) {
    throw new Error(error?.message || 'Unable to create signed upload URL')
  }

  return data as UploadSignedUrl
}

export async function persistUploadMetadata(metadata: UploadMetadata) {
  const { data, error } = await supabaseAdmin.storage.from(metadata.bucket).upload(metadata.path, metadata.fileBuffer, {
    contentType: metadata.mimeType,
    cacheControl: '3600',
    upsert: false
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
