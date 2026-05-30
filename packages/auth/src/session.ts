import { getToken } from '@auth/core/jwt'
import type { JWT } from '@auth/core/jwt'
import { AuthSession } from './types'

function normalizeSession(token: JWT | null): AuthSession | null {
  if (!token || !token.sub || !token.email) return null

  return {
    user: {
      id: token.sub,
      email: token.email,
      name: token.name ?? undefined,
      roles: Array.isArray(token.roles) ? token.roles : []
    },
    expires: token.exp ? new Date(token.exp * 1000).toISOString() : undefined
  }
}

export async function getServerSessionFromRequest(request: Request) {
  const token = await getToken({
    req: request,
    salt: 'authjs.session-token',
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
