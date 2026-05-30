import { z } from 'zod'

export const submitForReviewSchema = z.object({
  reportId: z.string().uuid(),
  reviewerIds: z.array(z.string().uuid()).optional()
})

export const reviewActionSchema = z.object({
  reportId: z.string().uuid(),
  comment: z.string().min(1).optional()
})
