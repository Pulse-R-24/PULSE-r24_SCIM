import Link from 'next/link'
import { Globe, Mail } from 'lucide-react'

export function PublicFooter() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#050819] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr_0.85fr_0.75fr]">
        <section>
          <h2 className="font-editorial text-4xl font-black tracking-tight text-rose-700">
            PULSE-R<span className="align-super text-2xl">24</span>
          </h2>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">
            Puducherry Campus Intelligence Initiative
          </p>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/55">
            A security intelligence bulletin delivering situational awareness on emerging risks impacting business continuity,
            public safety, and organizational resilience.
          </p>
        </section>

        <section>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/35">Initiative</p>
          <div className="mt-5 space-y-4 text-sm text-white/60">
            <p>Post Graduate Diploma in Security and Corporate Intelligence Management</p>
            <p className="text-rose-500">Rashtriya Raksha University, Puducherry Campus</p>
          </div>
        </section>

        <section>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/35">Governance</p>
          <div className="mt-5 space-y-4 text-sm text-white/60">
            <p>Published through the protected editorial workflow.</p>
            <p className="text-rose-500">Drafts, evidence, reviews, and audit records remain private.</p>
          </div>
        </section>

        <section>
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
        </section>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.18em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
        <p>(c) {new Date().getFullYear()} PULSE-R24 Intelligence Network.</p>
        <p>Public reports are drawn only from published editorial workflow records.</p>
      </div>
    </footer>
  )
}
