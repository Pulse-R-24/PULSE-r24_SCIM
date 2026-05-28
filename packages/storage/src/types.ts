export interface UploadSignedUrl {
  signedURL: string
  expiresAt: string
}

export interface UploadMetadata {
  bucket: string
  path: string
  mimeType: string
  fileBuffer: Buffer
  metadata: Record<string, unknown>
}
