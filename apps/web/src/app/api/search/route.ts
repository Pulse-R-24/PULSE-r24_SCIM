import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSessionFromRequest, requirePermission } from '@pulse-r24/auth'
import { globalSearch } from '@modules/search'

const searchQuerySchema = z.object({
  q: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  tagName: z.string().trim().optional(),
  status: z.string().trim().optional(),
  evidenceType: z.enum(['FILE', 'IMAGE', 'PDF', 'VIDEO', 'URL', 'DOCUMENT']).optional(),
  actor: z.string().trim().optional(),
  dateFrom: z.string().trim().optional(),
  dateTo: z.string().trim().optional(),
  resultType: z.enum(['ALL', 'REPORT', 'EVIDENCE', 'WORKFLOW', 'ACTIVITY']).default('ALL')
})

export async function GET(req: NextRequest) {
  const session = await getServerSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  requirePermission(session, 'can_view_reports')

  const url = new URL(req.url)
  const parsed = searchQuerySchema.safeParse({
    q: url.searchParams.get('q') || undefined,
    categoryId: url.searchParams.get('categoryId') || undefined,
    tagName: url.searchParams.get('tagName') || undefined,
    status: url.searchParams.get('status') || undefined,
    evidenceType: url.searchParams.get('evidenceType') || undefined,
    actor: url.searchParams.get('actor') || undefined,
    dateFrom: url.searchParams.get('dateFrom') || undefined,
    dateTo: url.searchParams.get('dateTo') || undefined,
    resultType: url.searchParams.get('resultType') || 'ALL'
  })
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid search filters' }, { status: 400 })
  }

  const results = await globalSearch(parsed.data)

  return NextResponse.json(results)
}
