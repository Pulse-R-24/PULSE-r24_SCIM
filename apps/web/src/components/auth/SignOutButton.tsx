'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export function SignOutButton({
  label = 'Sign out',
  className,
  callbackUrl = '/auth/signin',
  children
}: {
  label?: string
  className?: string
  callbackUrl?: string
  children?: ReactNode
}) {
  const [csrfToken, setCsrfToken] = useState('')

  useEffect(() => {
    let active = true

    async function loadCsrfToken() {
      try {
        const response = await fetch('/api/auth/csrf', {
          cache: 'no-store',
          credentials: 'same-origin'
        })
        const data = (await response.json()) as { csrfToken?: string }
        if (active) setCsrfToken(data.csrfToken ?? '')
      } catch {
        if (active) setCsrfToken('')
      }
    }

    void loadCsrfToken()
    return () => {
      active = false
    }
  }, [])

  return (
    <form action="/api/auth/signout" method="post">
      <input suppressHydrationWarning type="hidden" name="csrfToken" value={csrfToken} />
      <input suppressHydrationWarning type="hidden" name="callbackUrl" value={callbackUrl} />
      <button type="submit" disabled={!csrfToken} className={className}>
        {children ?? label}
      </button>
    </form>
  )
}
