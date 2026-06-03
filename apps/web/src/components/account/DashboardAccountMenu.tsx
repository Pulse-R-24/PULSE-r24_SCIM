import Link from 'next/link'
import type { AuthSession } from '@pulse-r24/auth'
import { formatRole, getDisplayName, getInitials, getPrimaryRole } from '@/components/account/accountUtils'
import { SignOutButton } from '@/components/auth/SignOutButton'

export function DashboardAccountMenu({ session }: { session: AuthSession }) {
  const displayName = getDisplayName(session)
  const role = getPrimaryRole(session)

  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-left transition hover:border-rose-500/30 hover:bg-white/[0.07] [&::-webkit-details-marker]:hidden">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-700 to-red-950 text-xs font-black text-white shadow-lg shadow-rose-950/30">
          {getInitials(session)}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block max-w-44 truncate text-xs font-bold text-slate-100">{displayName}</span>
          <span className="block max-w-44 truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-300">{formatRole(role)}</span>
        </span>
      </summary>
      <div className="absolute right-0 top-full z-50 mt-3 w-72 rounded-2xl border border-white/10 bg-slate-950 p-3 text-sm text-slate-300 shadow-2xl shadow-black/40">
        <div className="border-b border-white/10 px-2 pb-3">
          <p className="truncate font-bold text-white">{displayName}</p>
          <p className="truncate text-xs text-slate-500">{session.user.email}</p>
          <span className="mt-2 inline-flex rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-rose-200">
            {formatRole(role)}
          </span>
        </div>
        <nav className="mt-2 space-y-1">
          <Link href="/dashboard/profile" className="block rounded-xl px-3 py-2 hover:bg-white/5 hover:text-white">View Profile</Link>
          <Link href="/" className="block rounded-xl px-3 py-2 hover:bg-white/5 hover:text-white">Visit Public Site</Link>
          <SignOutButton label="Sign out" className="block w-full rounded-xl px-3 py-2 text-left text-rose-300 hover:bg-rose-500/10 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-50" />
        </nav>
      </div>
    </details>
  )
}
