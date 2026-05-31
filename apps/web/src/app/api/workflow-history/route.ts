import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionFromRequest, requirePermission } from '@pulse-r24/auth'
import { listWorkflowHistory } from '@modules/workflow'

export async function GET(req: NextRequest) {
  const session = await getServerSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  requirePermission(session, 'can_review_reports')

  const url = new URL(req.url)
  const reportId = url.searchParams.get('reportId') || undefined
  const status = url.searchParams.get('status') || undefined
  const action = url.searchParams.get('action') || undefined
  const search = url.searchParams.get('search') || undefined
  const skip = url.searchParams.get('skip') ? Number(url.searchParams.get('skip')) : undefined
  const take = url.searchParams.get('take') ? Number(url.searchParams.get('take')) : undefined

  const history = await listWorkflowHistory({ reportId, status, action, search, skip, take })
  return NextResponse.json(history)
}
