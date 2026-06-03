import Link from 'next/link'
import { Menu, Search, ShieldCheck } from 'lucide-react'

export function PublicNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-900/5 bg-white/88 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 md:gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm md:h-14 md:w-14">
            <ShieldCheck className="h-5 w-5 text-[#8b0000]" />
          </div>
          <div className="hidden text-left lg:block">
            <p className="text-[10px] font-black uppercase leading-tight tracking-[0.22em] text-slate-800">Rashtriya Raksha University</p>
            <p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-slate-400">Puducherry Campus</p>
          </div>
        </Link>

        <Link href="/" className="flex min-w-0 flex-1 flex-col items-center px-1 text-center">
          <h1 className="font-editorial text-2xl font-black leading-none tracking-tight text-[#8b0000] sm:text-3xl md:text-4xl">
            PULSE-R<span className="align-super text-base">24</span>
          </h1>
          <p className="hidden text-[8px] font-black uppercase tracking-[0.34em] text-slate-400 sm:block">Daily Corporate Intelligence Bulletin</p>
        </Link>

        <nav className="flex items-center justify-end gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600 md:gap-5">
          <Link href="/" className="hidden hover:text-[#8b0000] xl:inline">Home</Link>
          <Link href="/#about" className="hidden hover:text-[#8b0000] xl:inline">About</Link>
          <Link href="/news" className="hidden hover:text-[#8b0000] md:inline">News</Link>
          <Link href="/latest" className="hidden hover:text-[#8b0000] lg:inline">Latest</Link>
          <Link href="/public-search" className="hidden items-center gap-1.5 hover:text-[#8b0000] md:inline-flex">
            <Search className="h-3.5 w-3.5" /> Search
          </Link>
          <Link href="/auth/signin" className="rounded-full border border-[#8b0000]/10 bg-[#8b0000]/5 px-3 py-1.5 text-[#600000] shadow-sm hover:bg-[#8b0000]/10">
            Staff Login
          </Link>
          <div className="hidden h-14 w-16 items-center justify-center border-l border-slate-100 pl-3 md:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-[#8b0000] shadow-sm">
              ISSP
            </div>
          </div>
          <Menu className="h-5 w-5 text-slate-400 md:hidden" aria-hidden="true" />
        </nav>
      </div>
    </header>
  )
}
