import { z } from 'zod'

export const reportCreateSchema = z.object({
  title: z.string().min(5).max(250),
  body_markdown: z.string().min(10),
  categoryIds: z.array(z.string().uuid()).default([]),
  tagNames: z.array(z.string().min(1)).default([]),
  status: z.enum(['DRAFT', 'UNDER_REVIEW', 'PUBLISHED']).default('DRAFT')
})

export const reportUpdateSchema = z.object({
  title: z.string().min(5).max(250).optional(),
  body_markdown: z.string().min(10).optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  tagNames: z.array(z.string().min(1)).optional(),
  status: z.enum(['DRAFT', 'UNDER_REVIEW', 'PUBLISHED']).optional()
})

export const reportPublishSchema = z.object({
  reportId: z.string().uuid(),
  status: z.literal('PUBLISHED')
})
