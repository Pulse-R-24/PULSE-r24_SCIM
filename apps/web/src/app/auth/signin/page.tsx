import { headers } from 'next/headers'
import { getServerSessionFromHeaders } from '@pulse-r24/auth'
import type { Metadata } from 'next'
import { SignInForm } from '@/components/auth/SignInForm'

export const metadata: Metadata = {
  title: 'Sign in | PULSE-R24'
}

export default async function SignInPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
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

  const resolvedSearchParams = await searchParams
  const errorMessage = resolvedSearchParams?.error
    ? 'Sign in failed. Please check your credentials and try again.'
    : undefined

  return (
    <div className="min-h-screen bg-[#081226] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 glass shadow-xl">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-rose-300/80">Secure Intelligence Console</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Sign in to PULSE-R24</h1>
        </div>
        <p className="text-slate-400 mb-6">Secure access to analytics, reports, and intelligence workflows.</p>

        <SignInForm errorMessage={errorMessage} />
      </div>
    </div>
  )
}
