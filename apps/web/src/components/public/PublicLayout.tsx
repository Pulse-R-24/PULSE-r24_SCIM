import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { getServerSessionFromHeaders } from '@pulse-r24/auth'
import { PublicFooter } from '@/components/public/PublicFooter'
import { PublicNavbar } from '@/components/public/PublicNavbar'

export async function PublicLayout({ children }: { children: ReactNode }) {
  const session = await getServerSessionFromHeaders(new Headers(await headers()))

  return (
    <div className="public-paper min-h-screen font-sans text-slate-950">
      <PublicNavbar session={session} />
      <main className="pt-20 md:pt-24">{children}</main>
      <PublicFooter session={session} />
    </div>
  )
}
