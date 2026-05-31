import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionFromRequest, requirePermission } from '@pulse-r24/auth'
import { createReport, updateReport, listReports, getReport, deleteReport } from '@modules/reports/services/reportService'

export async function POST(req: NextRequest) {
  const session = await getServerSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
  requirePermission(session, 'can_create_reports')

  const body = await req.json()
  if (body.status === 'PUBLISHED') {
    requirePermission(session, 'can_publish_reports')
  }

  const report = await createReport(body, session.user.id)
  return NextResponse.json(report)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
  requirePermission(session, 'can_edit_reports')

  const body = await req.json()
  if (body.status === 'PUBLISHED') {
    requirePermission(session, 'can_publish_reports')
  }

  const report = await updateReport(body.reportId, body, session.user.id)
  return NextResponse.json(report)
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (id) {
    const report = await getReport(id)
    if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(report)
  }

  const status = url.searchParams.get('status') || undefined
  const assignedToMe = url.searchParams.get('assignedToMe') === 'true'
  const skip = url.searchParams.get('skip') ? Number(url.searchParams.get('skip')) : undefined
  const take = url.searchParams.get('take') ? Number(url.searchParams.get('take')) : undefined

  let assignedReviewerId: string | undefined
  if (assignedToMe) {
    const session = await getServerSessionFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    requirePermission(session, 'can_review_reports')
    assignedReviewerId = session.user.id
  }

  const reports = await listReports({ status, skip, take, assignedReviewerId })
  return NextResponse.json(reports)
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  requirePermission(session, 'can_delete_reports')

  const body = await req.json()
  const { reportId } = body
  if (!reportId) return NextResponse.json({ error: 'reportId required' }, { status: 400 })

  const deleted = await deleteReport(reportId, session.user.id)
  return NextResponse.json(deleted)
}
