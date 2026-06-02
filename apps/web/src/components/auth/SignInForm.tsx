'use client'

import { useEffect, useState } from 'react'

type SignInFormProps = {
  errorMessage?: string
}

export function SignInForm({ errorMessage }: SignInFormProps) {
  const [csrfToken, setCsrfToken] = useState('')
  const [csrfError, setCsrfError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadCsrfToken() {
      try {
        const response = await fetch('/api/auth/csrf', {
          cache: 'no-store',
          credentials: 'same-origin'
        })

        if (!response.ok) {
          throw new Error('CSRF request failed')
        }

        const data = (await response.json()) as { csrfToken?: string }
        if (active) {
          setCsrfToken(data.csrfToken ?? '')
          setCsrfError(data.csrfToken ? null : 'Unable to prepare the secure sign-in form.')
        }
      } catch {
        if (active) {
          setCsrfError('Unable to prepare the secure sign-in form. Please refresh and try again.')
        }
      }
    }

    void loadCsrfToken()

    return () => {
      active = false
    }
  }, [])

  return (
    <>
      {errorMessage ? <div className="mb-4 rounded-xl bg-rose-900/70 p-4 text-rose-200">{errorMessage}</div> : null}
      {csrfError ? <div className="mb-4 rounded-xl bg-amber-900/60 p-4 text-amber-100">{csrfError}</div> : null}

      <form action="/api/auth/callback/credentials" method="post" className="space-y-4">
        <input suppressHydrationWarning type="hidden" name="csrfToken" value={csrfToken} />
        <input suppressHydrationWarning type="hidden" name="callbackUrl" value="/dashboard" />

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300">
            Email
          </label>
          <input suppressHydrationWarning
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-rose-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300">
            Password
          </label>
          <input suppressHydrationWarning
            id="password"
            name="password"
            type="password"
            required
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-rose-500"
          />
        </div>

        <button
          type="submit"
          disabled={!csrfToken}
          className="w-full rounded-2xl bg-rose-700 px-4 py-3 text-base font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          Sign in with email
        </button>
      </form>
    </>
  )
}
