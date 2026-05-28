import { getToken } from '@auth/core'
import { AuthSession } from './types'

function normalizeSession(token: Record<string, any> | null): AuthSession | null {
  if (!token || !token.sub || !token.email) return null

  return {
    user: {
      id: token.sub,
      email: token.email,
      name: token.name,
      roles: Array.isArray(token.roles) ? token.roles : []
    },
    expires: token.exp ? new Date(token.exp * 1000).toISOString() : undefined
  }
}

export async function getServerSessionFromRequest(request: Request) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || '',
    raw: false
  })
  return normalizeSession(token)
}

export async function getServerSessionFromHeaders(headers: HeadersInit) {
  const url = new URL('http://localhost')
  const request = new Request(url.toString(), {
    headers,
    method: 'GET'
  })
  return getServerSessionFromRequest(request)
}
