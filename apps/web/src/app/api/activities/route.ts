import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionFromRequest } from '@pulse-r24/auth'
import { getActivityFeed } from '@modules/activities'

export async function GET(req: NextRequest) {
  const session = await getServerSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const url = new URL(req.url)
  const skip = url.searchParams.get('skip') ? Number(url.searchParams.get('skip')) : 0
  const take = url.searchParams.get('take') ? Number(url.searchParams.get('take')) : 20

  const feed = await getActivityFeed({ skip, take })
  return NextResponse.json(feed)
}
