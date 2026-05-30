import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionFromRequest, requirePermission } from '@pulse-r24/auth'
import { publishReport } from '@modules/workflow/services/workflowService'

export async function POST(req: NextRequest) {
  const session = await getServerSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  requirePermission(session, 'can_publish_reports')

  const body = await req.json()
  const result = await publishReport(body.reportId, session.user.id)
  return NextResponse.json(result)
}
