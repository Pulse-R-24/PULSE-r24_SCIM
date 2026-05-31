import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionFromRequest, requirePermission } from '@pulse-r24/auth'
import { listEvidence } from '@modules/evidence'

export async function GET(req: NextRequest) {
  const session = await getServerSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  requirePermission(session, 'can_view_evidence')

  const url = new URL(req.url)
  const search = url.searchParams.get('search') || undefined
  const reportId = url.searchParams.get('reportId') || undefined

  const evidence = await listEvidence({ search, reportId })
  return NextResponse.json(evidence)
}
