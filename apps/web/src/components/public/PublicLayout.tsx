import type { ReactNode } from 'react'
import { PublicFooter } from '@/components/public/PublicFooter'
import { PublicNavbar } from '@/components/public/PublicNavbar'

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f5ef] font-sans text-slate-950">
      <PublicNavbar />
      <main>{children}</main>
      <PublicFooter />
    </div>
  )
}
