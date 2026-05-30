import CredentialsProvider from '@auth/core/providers/credentials'
import { compare } from 'bcryptjs'
import { findUserByEmail } from './repositories/userRepository'
import { RoleName } from './types'

export function getAuthProviders() {
  return [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: Partial<Record<'email' | 'password', unknown>>, request: Request) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

          const email = typeof credentials.email === 'string' ? credentials.email.toLowerCase() : undefined
          const password = typeof credentials.password === 'string' ? credentials.password : undefined

          if (!email || !password) {
            return null
          }

          const user = await findUserByEmail(email)
        if (!user || !user.hashed_password) {
          return null
        }

          const isValid = await compare(password, user.hashed_password)
        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          roles: user.roles?.map((userRole: { role: { name: string } }) => userRole.role.name as RoleName) ?? []
        }
      }
    })
  ]
}
