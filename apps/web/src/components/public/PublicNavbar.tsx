import Link from 'next/link'
import Image from 'next/image'
import type { AuthSession } from '@pulse-r24/auth'
import { PublicAccountMenu } from '@/components/public/PublicAccountMenu'

export function PublicNavbar({ session }: { session: AuthSession | null }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/96 shadow-[0_1px_0_rgba(15,23,42,0.06)] backdrop-blur-md">
      <div className="mx-auto grid h-24 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image src="/logos/rru-logo.png" alt="Rashtriya Raksha University" width={56} height={56} className="h-10 w-10 object-contain sm:h-12 sm:w-12 lg:h-14 lg:w-14" />
          <div className="hidden text-left lg:block">
            <p className="text-[10px] font-black uppercase leading-tight tracking-[0.18em] text-slate-800">Rashtriya Raksha University</p>
            <p className="mt-1 text-[8px] uppercase tracking-[0.22em] text-slate-400">Puducherry Campus</p>
          </div>
        </Link>

        <Link href="/" className="flex min-w-0 flex-col items-center px-2 text-center">
          <h1 className="font-editorial text-2xl font-black leading-none tracking-tight text-[#8b0000] sm:text-3xl md:text-[2.35rem]">
            PULSE-R<span className="align-super text-base">24</span>
          </h1>
          <p className="mt-1 hidden text-[8px] font-black uppercase tracking-[0.34em] text-slate-400 sm:block">The Daily Corporate Intelligence Bulletin</p>
        </Link>

        <nav className="flex items-center justify-end gap-3 text-[10px] font-semibold text-slate-600 md:gap-5">
          <Link href="/#about" className="hidden hover:text-[#8b0000] lg:inline">About Us</Link>
          <PublicAccountMenu session={session} />
          <div className="hidden h-20 items-center justify-center border-l border-slate-100 pl-5 md:flex">
            <div className="flex h-20 w-24 items-center justify-center bg-white">
              <Image src="/logos/issp-logo.png" alt="ISSP" width={88} height={88} className="h-20 w-20 object-contain" />
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
