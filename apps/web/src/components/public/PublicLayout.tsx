import type { ReactNode } from 'react'
import { PublicFooter } from '@/components/public/PublicFooter'
import { PublicNavbar } from '@/components/public/PublicNavbar'

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="public-paper min-h-screen font-sans text-slate-950">
      <PublicNavbar />
      <main className="pt-20 md:pt-24">{children}</main>
      <PublicFooter />
    </div>
  )
}
