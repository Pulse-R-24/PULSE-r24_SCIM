import Link from 'next/link'
import { Search, ShieldCheck } from 'lucide-react'

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-900/10 bg-[#fbfaf7]/95 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3 rounded-2xl p-1 transition hover:bg-rose-900/[0.03]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-900/10 bg-white shadow-sm">
            <ShieldCheck className="h-5 w-5 text-rose-800" />
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-700">Rashtriya Raksha University</p>
            <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400">Puducherry Intelligence Desk</p>
          </div>
        </Link>

        <Link href="/" className="text-center">
          <h1 className="font-editorial text-3xl font-black tracking-tight text-rose-900 sm:text-4xl">
            PULSE-R<span className="align-super text-base">24</span>
          </h1>
          <p className="hidden text-[9px] font-black uppercase tracking-[0.34em] text-slate-400 sm:block">Daily Corporate Intelligence Bulletin</p>
        </Link>

        <nav className="flex items-center justify-end gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600 sm:gap-5">
          <Link href="/news" className="hover:text-rose-800">News</Link>
          <Link href="/latest" className="hidden hover:text-rose-800 sm:inline">Latest</Link>
          <Link href="/public-search" className="hidden items-center gap-1.5 hover:text-rose-800 md:inline-flex">
            <Search className="h-3.5 w-3.5" /> Search
          </Link>
          <Link href="/auth/signin" className="rounded-full border border-rose-900/10 bg-white px-3 py-1.5 text-rose-900 shadow-sm hover:bg-rose-50">
            Staff Login
          </Link>
        </nav>
      </div>
    </header>
  )
}
