import { NextRequest } from 'next/server'
import { Auth } from '@auth/core'
import { getAuthOptions } from '@pulse-r24/auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@pulse-r24/database/src/client'

const authOptions = getAuthOptions({ adapter: PrismaAdapter(prisma), authSecret: process.env.AUTH_SECRET })

export async function POST(req: NextRequest) {
  const handler = async (request: Request) => Auth(request, authOptions)
  // Convert NextRequest to standard Request for @auth/core
  const body = await req.text()
  const request = new Request(req.url, {
    method: req.method,
    headers: Object.fromEntries(req.headers as any),
    body
  })
  const res = await handler(request)
  const text = await res.text()
  return new Response(text, { status: res.status, headers: res.headers })
}
