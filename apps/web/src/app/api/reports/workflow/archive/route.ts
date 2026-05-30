import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionFromRequest, requirePermission } from '@pulse-r24/auth'
import { archiveReport } from '@modules/workflow/services/workflowService'

export async function POST(req: NextRequest) {
  const session = await getServerSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  requirePermission(session, 'can_archive_reports')

  const body = await req.json()
  const result = await archiveReport(body.reportId, session.user.id)
  return NextResponse.json(result)
}
