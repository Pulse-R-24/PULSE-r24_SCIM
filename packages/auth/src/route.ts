import { Auth } from '@auth/core'
import type { Provider } from '@auth/core/providers'
import { getAuthOptions } from './createAuthOptions'
import { getPrismaAdapter } from './prismaAdapterImpl'

export async function authHandler(request: Request, providers: Provider[] = []) {
  return Auth(request, getAuthOptions({
    adapter: getPrismaAdapter(),
    authSecret: process.env.AUTH_SECRET,
    providers
  }))
}
