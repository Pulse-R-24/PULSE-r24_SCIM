import { z } from 'zod'

export const uploadSignedUrlSchema = z.object({
  bucket: z.string().min(1),
  path: z.string().min(1),
  mimeType: z.string().min(1),
  expiresIn: z.number().int().positive().max(300).optional()
})

export const uploadCompleteSchema = z.object({
  bucket: z.string().min(1),
  path: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().int().positive()
})
