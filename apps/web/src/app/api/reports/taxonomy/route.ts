import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionFromRequest, requirePermission } from '@pulse-r24/auth'
import { listReportTaxonomy } from '@modules/reports/services/reportService'

export async function GET(req: NextRequest) {
  const session = await getServerSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  requirePermission(session, 'can_create_reports')

  const taxonomy = await listReportTaxonomy()
  return NextResponse.json(taxonomy)
}
