import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-900/10 bg-[#f8f5ef]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-rose-900/10 bg-white shadow-sm">
            <ShieldCheck className="h-5 w-5 text-rose-800" />
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-700">Rashtriya Raksha University</p>
            <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400">Puducherry Campus</p>
          </div>
        </Link>

        <Link href="/" className="text-center">
          <h1 className="text-2xl font-black tracking-tight text-rose-800 sm:text-3xl">
            PULSE-R<span className="align-super text-base">24</span>
          </h1>
          <p className="hidden text-[9px] font-bold uppercase tracking-[0.28em] text-slate-400 sm:block">Intelligence Bulletin</p>
        </Link>

        <nav className="flex items-center justify-end gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600 sm:gap-5">
          <Link href="/news" className="hover:text-rose-800">News</Link>
          <Link href="/latest" className="hidden hover:text-rose-800 sm:inline">Latest</Link>
          <Link href="/public-search" className="hidden hover:text-rose-800 md:inline">Search</Link>
          <Link href="/auth/signin" className="rounded-full border border-rose-900/10 bg-rose-50 px-3 py-1.5 text-rose-900 hover:bg-rose-100">
            Staff Login
          </Link>
        </nav>
      </div>
    </header>
  )
}
