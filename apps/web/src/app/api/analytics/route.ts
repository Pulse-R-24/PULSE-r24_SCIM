import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSessionFromRequest, requirePermission } from '@pulse-r24/auth'
import { getAnalytics } from '@modules/analytics'

const analyticsQuerySchema = z.object({
  dateFrom: z.string().trim().optional(),
  dateTo: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  status: z.string().trim().optional(),
  actorId: z.string().trim().optional(),
})

export async function GET(req: NextRequest) {
  const session = await getServerSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  requirePermission(session, 'can_view_reports')

  const url = new URL(req.url)
  const parsed = analyticsQuerySchema.safeParse({
    dateFrom: url.searchParams.get('dateFrom') || undefined,
    dateTo: url.searchParams.get('dateTo') || undefined,
    categoryId: url.searchParams.get('categoryId') || undefined,
    status: url.searchParams.get('status') || undefined,
    actorId: url.searchParams.get('actorId') || undefined,
  })

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid analytics filters' }, { status: 400 })
  }

  const analytics = await getAnalytics(parsed.data)
  return NextResponse.json(analytics)
}
