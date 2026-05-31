import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionFromRequest, requirePermission } from '@pulse-r24/auth'
import { attachEvidence, attachExistingEvidence, getReportEvidence, removeEvidence } from '@modules/evidence'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  requirePermission(session, 'can_view_evidence')

  const { id } = await context.params
  const evidenceList = await getReportEvidence(id)
  return NextResponse.json(evidenceList)
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  requirePermission(session, 'can_edit_reports')

  const { id } = await context.params
  const body = await req.json()

  if (body.evidenceId) {
    const evidence = await attachExistingEvidence({
      reportId: id,
      evidenceId: body.evidenceId,
      userId: session.user.id
    })
    return NextResponse.json(evidence)
  }

  const evidence = await attachEvidence({
    reportId: id,
    title: body.title,
    description: body.description,
    url: body.url,
    mediaId: body.mediaId,
    userId: session.user.id
  })

  return NextResponse.json(evidence)
}

export async function DELETE(
  req: NextRequest
) {
  const session = await getServerSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  requirePermission(session, 'can_delete_evidence')

  const url = new URL(req.url)
  const evidenceId = url.searchParams.get('evidenceId')
  if (!evidenceId) {
    return NextResponse.json({ error: 'evidenceId query parameter required' }, { status: 400 })
  }

  const deleted = await removeEvidence(evidenceId, session.user.id)
  return NextResponse.json(deleted)
}
