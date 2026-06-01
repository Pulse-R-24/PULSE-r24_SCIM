import { NextRequest } from 'next/server'
import { authHandler } from '@pulse-r24/auth'

export async function GET(req: NextRequest) {
  return authHandler(req)
}

export async function POST(req: NextRequest) {
  return authHandler(req)
}
