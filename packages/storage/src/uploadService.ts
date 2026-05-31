import { getSupabaseAdmin } from './client'
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
  const supabaseAdmin = getSupabaseAdmin()
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUploadUrl(path, { upsert: false })

  if (error || !data) {
    throw new Error(error?.message || 'Unable to create signed upload URL')
  }

  return data as UploadSignedUrl
}

export async function persistUploadMetadata(metadata: UploadMetadata) {
  const supabaseAdmin = getSupabaseAdmin()
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

export async function downloadFileAsBuffer(bucket: string, path: string) {
  const supabaseAdmin = getSupabaseAdmin()
  const { data, error } = await supabaseAdmin.storage.from(bucket).download(path)
  if (error || !data) {
    throw new Error(error?.message || 'Unable to download file from storage')
  }

  // data can be a Blob/ReadableStream/Node buffer depending on runtime
  // Try common conversions to Buffer
  if (typeof (data as any).arrayBuffer === 'function') {
    const ab = await (data as any).arrayBuffer()
    return Buffer.from(ab)
  }

  // Node: data may be a stream with a `stream()` or `getReader` interface
  if (typeof (data as any).stream === 'function') {
    const stream = (data as any).stream()
    const chunks: Buffer[] = []
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
    return Buffer.concat(chunks)
  }

  // Fallback: if it's already a Buffer
  if (Buffer.isBuffer(data)) {
    return data as Buffer
  }

  // Last resort: try to coerce to string and Buffer
  return Buffer.from(String(data))
}
