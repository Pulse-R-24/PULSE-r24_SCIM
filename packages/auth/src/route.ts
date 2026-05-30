import { Auth } from '@auth/core'
import { getAuthOptions } from './createAuthOptions'
import { getAuthProviders } from './providers'
import { getPrismaAdapter } from './prismaAdapterImpl'

export async function authHandler(request: Request) {
  return Auth(request, getAuthOptions({
    adapter: getPrismaAdapter(),
    authSecret: process.env.AUTH_SECRET,
    providers: getAuthProviders()
  }))
}
