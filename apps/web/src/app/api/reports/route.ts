import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionFromRequest, requirePermission } from '@pulse-r24/auth'
import { createReport, updateReport } from '@modules/reports/services/reportService'

export async function POST(req: NextRequest) {
  const session = await getServerSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await req.json()
  if (body.status === 'PUBLISHED') {
    requirePermission(session, 'can_publish')
  }

  const report = await createReport(body, session.user.id)
  return NextResponse.json(report)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await req.json()
  if (body.status === 'PUBLISHED') {
    requirePermission(session, 'can_publish')
  }

  const report = await updateReport(body.reportId, body, session.user.id)
  return NextResponse.json(report)
}
