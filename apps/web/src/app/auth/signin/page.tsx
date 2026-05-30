import { headers } from 'next/headers'
import { getServerSessionFromHeaders } from '@pulse-r24/auth'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign in | PULSE-R24'
}

async function fetchCsrfToken() {
  const url = new URL('/api/auth/csrf', process.env.NEXTAUTH_URL || 'http://localhost:3000')
  const res = await fetch(url.toString(), { cache: 'no-store' })
  const data = await res.json()
  return data.csrfToken as string | undefined
}

export default async function SignInPage({ searchParams }: { searchParams?: { error?: string } }) {
  const requestHeaders = new Headers(await headers())
  const session = await getServerSessionFromHeaders(requestHeaders)
  if (session) {
    return (
      <div className="min-h-screen bg-[#081226] flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 glass shadow-xl">
          <h1 className="text-3xl font-semibold mb-4">Already signed in</h1>
          <p className="text-slate-400">You are already authenticated as {session.user.email}.</p>
        </div>
      </div>
    )
  }

  const csrfToken = await fetchCsrfToken()
  const errorMessage = searchParams?.error ? 'Sign in failed. Please check your credentials and try again.' : undefined

  return (
    <div className="min-h-screen bg-[#081226] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 glass shadow-xl">
        <h1 className="text-3xl font-semibold mb-4">Sign in to PULSE-R24</h1>
        <p className="text-slate-400 mb-6">Secure access to analytics, reports, and intelligence workflows.</p>

        {errorMessage ? <div className="mb-4 rounded-xl bg-rose-900/70 p-4 text-rose-200">{errorMessage}</div> : null}

        <form action="/api/auth/callback/credentials" method="post" className="space-y-4">
          <input type="hidden" name="csrfToken" value={csrfToken ?? ''} />
          <input type="hidden" name="callbackUrl" value="/dashboard" />

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Sign in with email
          </button>
        </form>
      </div>
    </div>
  )
}
