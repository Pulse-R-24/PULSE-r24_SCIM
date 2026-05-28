import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionFromRequest, requirePermission } from '@pulse-r24/auth'
import { generateUploadUrl, registerUpload } from '@modules/uploads/services/uploadService'

export async function POST(req: NextRequest) {
  const session = await getServerSessionFromRequest(req)
  requirePermission(session, 'can_upload_media')

  const body = await req.json()
  const uploadUrl = await generateUploadUrl(body)

  return NextResponse.json(uploadUrl)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSessionFromRequest(req)
  requirePermission(session, 'can_upload_media')

  const body = await req.json()
  const upload = await registerUpload(body, session?.user?.id)

  return NextResponse.json(upload)
}
