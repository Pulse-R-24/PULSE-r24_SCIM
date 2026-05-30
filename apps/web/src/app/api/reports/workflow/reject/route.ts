import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionFromRequest, requirePermission } from '@pulse-r24/auth'
import { rejectReport } from '@modules/workflow/services/workflowService'

export async function POST(req: NextRequest) {
  const session = await getServerSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  requirePermission(session, 'can_review_reports')

  const body = await req.json()
  await rejectReport(body, session.user.id)
  return NextResponse.json({ ok: true })
}
