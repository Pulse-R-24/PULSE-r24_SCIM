import { headers } from 'next/headers'
import { getServerSessionFromHeaders } from '@pulse-r24/auth'
import type { Metadata } from 'next'
import Link from 'next/link'
import { SignInForm } from '@/components/auth/SignInForm'
import { formatRole, getDisplayName } from '@/components/account/accountUtils'
import { SignOutButton } from '@/components/auth/SignOutButton'

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
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-rose-300/80">Secure Intelligence Console</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Already signed in</h1>
          <p className="mt-4 text-slate-400">You are already signed in as {session.user.email}.</p>
          <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-sm font-semibold text-white">{getDisplayName(session)}</p>
            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-rose-300">{formatRole(session.user.roles[0])}</p>
          </div>
          <div className="mt-6 grid gap-3">
            <Link href="/dashboard" className="rounded-2xl bg-rose-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-rose-600">
              Go to Dashboard
            </Link>
            <Link href="/" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm font-semibold text-slate-200 transition hover:bg-white/[0.06]">
              Visit Public Site
            </Link>
            <SignOutButton label="Sign out / Switch Account" className="rounded-2xl px-4 py-3 text-center text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>
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
