export interface UploadSignedUrlRequest {
  bucket: string
  path: string
  mimeType: string
  expiresIn?: number
}

export interface UploadCompleteRequest {
  bucket: string
  path: string
  mimeType: string
  size: number
}
