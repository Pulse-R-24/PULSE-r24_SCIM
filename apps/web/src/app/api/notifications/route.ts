import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionFromRequest } from '@pulse-r24/auth'
import { getUserNotifications, markNotificationAsRead, markAllAsRead } from '@modules/notifications'

export async function GET(req: NextRequest) {
  const session = await getServerSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const notifications = await getUserNotifications(session.user.id)
  return NextResponse.json(notifications)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await req.json()
  if (body.all) {
    await markAllAsRead(session.user.id)
  } else if (body.id) {
    await markNotificationAsRead(body.id)
  } else {
    return NextResponse.json({ error: 'id or all:true required' }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
