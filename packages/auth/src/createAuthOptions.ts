/**
 * Template for Auth.js v5 options used across the monorepo.
 * Import and call `getAuthOptions({ adapter, authSecret, providers })` from your Next.js auth route.
 */

import type { AuthConfig } from '@auth/core'
import type { JWT } from '@auth/core/jwt'
import type { Session } from '@auth/core/types'
import type { Provider } from '@auth/core/providers'

export type AuthOptionsConfig = {
  adapter?: any
  authSecret?: string
  providers?: Provider[]
  pages?: Partial<{ signIn: string; error: string }>
}

export function getAuthOptions({ adapter, authSecret, providers = [], pages }: AuthOptionsConfig): AuthConfig {
  const options: AuthConfig = {
    adapter,
    providers,
    secret: authSecret,
    session: {
      strategy: 'jwt'
    },
    callbacks: {
      async jwt({ token, user }: { token: JWT; user?: any }) {
        if (user && (user as any).roles) {
          token.roles = (user as any).roles
        }
        return token
      },
      async session({ session, token }: { session: Session; token: JWT }) {
        ;(session as any).user = {
          ...(session as any).user,
          roles: (token as any).roles || []
        }
        return session
      }
    },
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
      ...pages
    }
  }

  return options
}
