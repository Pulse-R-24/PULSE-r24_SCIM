import Link from 'next/link'
import type { AuthSession } from '@pulse-r24/auth'
import { formatRole, getDisplayName, getInitials, getPrimaryRole } from '@/components/account/accountUtils'
import { SignOutButton } from '@/components/auth/SignOutButton'

export function PublicAccountMenu({ session }: { session: AuthSession | null }) {
  if (!session) {
    return (
      <Link href="/auth/signin" className="rounded-full border border-[#8b0000]/10 bg-[#8b0000]/5 px-3 py-1.5 text-[#600000] shadow-sm hover:bg-[#8b0000]/10">
        Staff Login
      </Link>
    )
  }

  const displayName = getDisplayName(session)
  const role = getPrimaryRole(session)

  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-[#8b0000]/10 bg-white px-2 py-1.5 text-left shadow-sm transition hover:border-[#8b0000]/30 [&::-webkit-details-marker]:hidden">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8b0000] text-[10px] font-black text-white">{getInitials(session)}</span>
        <span className="hidden min-w-0 sm:block">
          <span className="block max-w-28 truncate text-[10px] font-black uppercase tracking-[0.12em] text-slate-700">{displayName}</span>
          <span className="block max-w-28 truncate text-[9px] font-black uppercase tracking-[0.14em] text-[#8b0000]">{formatRole(role)}</span>
        </span>
      </summary>
      <div className="absolute right-0 top-full z-50 mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-3 text-sm normal-case tracking-normal text-slate-700 shadow-2xl">
        <div className="border-b border-slate-100 px-2 pb-3">
          <p className="truncate font-bold text-slate-950">{displayName}</p>
          <p className="truncate text-xs text-slate-500">{session.user.email}</p>
          <span className="mt-2 inline-flex rounded-full bg-[#8b0000]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#8b0000]">
            {formatRole(role)}
          </span>
        </div>
        <nav className="mt-2 space-y-1">
          <Link href="/dashboard" className="block rounded-xl px-3 py-2 hover:bg-slate-50">Dashboard</Link>
          <Link href="/" className="block rounded-xl px-3 py-2 hover:bg-slate-50">Public Site</Link>
          <Link href="/dashboard/profile" className="block rounded-xl px-3 py-2 hover:bg-slate-50">Profile</Link>
          <SignOutButton label="Sign out / Switch Account" className="block w-full rounded-xl px-3 py-2 text-left text-[#8b0000] hover:bg-[#8b0000]/5 disabled:cursor-not-allowed disabled:opacity-50" />
        </nav>
      </div>
    </details>
  )
}
