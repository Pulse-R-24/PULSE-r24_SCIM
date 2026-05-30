import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionFromRequest, requirePermission } from '@pulse-r24/auth'
import { submitForReview } from '@modules/workflow/services/workflowService'

export async function POST(req: NextRequest) {
  const session = await getServerSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  requirePermission(session, 'can_submit_reports')

  const body = await req.json()
  await submitForReview(body, session.user.id)
  return NextResponse.json({ ok: true })
}
