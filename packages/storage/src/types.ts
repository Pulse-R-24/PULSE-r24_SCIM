export interface UploadSignedUrl {
  signedUrl: string
  token: string
  path: string
}

export interface UploadMetadata {
  bucket: string
  path: string
  mimeType: string
  fileBuffer: Buffer
  metadata: Record<string, unknown>
}
