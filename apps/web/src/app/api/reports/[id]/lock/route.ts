import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionFromRequest, requirePermission } from '@pulse-r24/auth'
import { acquireLock, releaseLock } from '@modules/reports/services/reportService'

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  requirePermission(session, 'can_edit_reports')

  const { id } = await context.params
  try {
    const report = await acquireLock(id, session.user.id)
    return NextResponse.json({ ok: true, lockedById: report.lockedById, locked_at: report.locked_at })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 409 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  requirePermission(session, 'can_edit_reports')

  const { id } = await context.params
  try {
    await releaseLock(id, session.user.id)
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
