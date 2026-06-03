import Link from 'next/link'
import { Globe, Mail } from 'lucide-react'

export function PublicFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#070B24] px-4 pb-10 pt-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-12">
        <section className="lg:col-span-5">
          <h2 className="font-editorial text-4xl font-black tracking-tight text-rose-700">
            PULSE-R<span className="align-super text-2xl">24</span>
          </h2>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">
            Puducherry Campus Intelligence Initiative
          </p>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/55">
            A forward-looking security intelligence bulletin delivering situational awareness on emerging risks impacting business continuity
            and organizational resilience across India&apos;s Tier-1 cities.
          </p>
          <div className="mt-8 max-w-sm">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.22em] text-white/30">Subscribe to Intel Briefs</p>
            <div className="flex">
              <input
                suppressHydrationWarning
                type="email"
                placeholder="your@email.com"
                className="min-w-0 flex-1 rounded-l-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-rose-700/60 focus:bg-white/10"
              />
              <button type="button" className="rounded-r-md bg-[#8b0000] px-6 py-3 text-[11px] font-black uppercase tracking-widest text-white hover:bg-[#600000]">
                Join
              </button>
            </div>
          </div>
        </section>

        <section className="lg:col-span-4">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/35">Initiative</p>
          <div className="mt-6 space-y-6 text-sm text-white/65">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[10px] font-black text-rose-400">RRU</div>
              <div>
                <p className="font-semibold text-white/80">Post Graduate Diploma in Security and Corporate Intelligence Management</p>
                <p className="mt-1 text-[11px] text-white/30">Batch of 2025-2026</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-rose-500">Rashtriya Raksha University, Puducherry Campus</p>
              </div>
            </div>
            <div className="flex gap-4 border-t border-white/5 pt-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[10px] font-black text-rose-400">SCIM</div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Technical Execution</p>
                <p className="mt-2 font-semibold text-white/80">Post Graduate Diploma in Cyber Security and Digital Forensics</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-rose-500">Rashtriya Raksha University, Puducherry Campus</p>
              </div>
            </div>
          </div>
        </section>

        <section className="lg:col-span-3">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/35">Governance</p>
          <div className="mt-6 flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[10px] font-black text-white/60">ISSP</div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Guided By</p>
              <p className="text-sm font-bold text-white/80">ISSP</p>
              <p className="text-[11px] leading-5 text-white/40">International Society for Security Professionals</p>
            </div>
          </div>
          <div className="mt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/35">Connect</p>
          <div className="mt-5 space-y-3 text-sm">
            <Link href="/news" className="flex items-center gap-2 text-white/55 hover:text-rose-400">
              <Globe className="h-4 w-4" /> Published intelligence
            </Link>
            <a href="mailto:editorial@pulser24.in" className="flex items-center gap-2 text-white/55 hover:text-rose-400">
              <Mail className="h-4 w-4" /> editorial@pulser24.in
            </a>
            <Link href="/auth/signin" className="flex items-center gap-2 text-white/55 hover:text-rose-400">
              Staff Portal
            </Link>
          </div>
            <div className="mt-6 flex gap-3">
              <a href="https://rru.ac.in" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/30 transition hover:bg-[#8b0000] hover:text-white"><Globe className="h-4 w-4" /></a>
              <a href="https://www.linkedin.com/company/rashtriya-raksha-university-puducherry-campus/posts/?feedView=all" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-[10px] font-black text-white/30 transition hover:bg-[#8b0000] hover:text-white">in</a>
              <a href="https://www.instagram.com/rru.puducherrycampus/" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-[10px] font-black text-white/30 transition hover:bg-[#8b0000] hover:text-white">ig</a>
            </div>
          </div>
        </section>
      </div>
      <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-[10px] uppercase tracking-[0.18em] text-white/25 sm:flex-row sm:items-center sm:justify-between">
        <p>(c) {new Date().getFullYear()} PULSE-R24 Intelligence Network.</p>
        <p>An institutional intelligence product. Public reports are drawn only from published editorial workflow records.</p>
        </div>
      </div>
    </footer>
  )
}
