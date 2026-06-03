import Image from 'next/image'
import Link from 'next/link'
import type { AuthSession } from '@pulse-r24/auth'
import { Globe, Mail } from 'lucide-react'
import { getDisplayName } from '@/components/account/accountUtils'

export function PublicFooter({ session }: { session: AuthSession | null }) {
  return (
    <footer className="border-t border-white/5 bg-[#070B24] px-4 pb-8 pt-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12">
          <section className="lg:col-span-4">
            <h2 className="font-editorial text-4xl font-black tracking-tight text-[#8b0000]">
              PULSE-R<span className="align-super text-2xl">24</span>
            </h2>
            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.28em] text-white/40">
              Puducherry Campus Intelligence Initiative
            </p>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/60">
              A forward-looking security intelligence bulletin delivering situational awareness on emerging risks impacting business
              continuity and organizational resilience across India&apos;s Tier-1 cities.
            </p>

            <div className="mt-8 max-w-sm">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-white/35">
                Subscribe to Intel Briefs
              </p>
              <div className="flex">
                <input
                  suppressHydrationWarning
                  type="email"
                  placeholder="your@email.com"
                  className="min-w-0 flex-1 border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#8b0000]"
                />
                <button
                  type="button"
                  className="bg-[#8b0000] px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-[#600000]"
                >
                  Join
                </button>
              </div>
            </div>
          </section>

          <section className="lg:col-span-5">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/35">Initiative</p>
            <div className="mt-5 space-y-4">
              <InitiativeCard
                image="/logos/pgdscim-logo.png"
                title="PG Diploma in Security and Corporate Intelligence Management"
                subtitle="Batch of 2025-2026"
                body="Rashtriya Raksha University, Puducherry Campus"
              />
              <InitiativeCard
                image="/logos/cyber-logo.png"
                title="PG Diploma in Cyber Security and Digital Forensics"
                subtitle="Batch of 2025-2026"
                body="Rashtriya Raksha University, Puducherry Campus"
              />
            </div>
          </section>

          <section className="lg:col-span-3">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/35">Governance</p>
            <div className="mt-5 border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-white p-2">
                  <Image src="/logos/issp-logo.png" alt="ISSP" width={64} height={64} className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/30">Guided By</p>
                  <p className="mt-1 text-lg font-black text-white">ISSP</p>
                  <p className="mt-1 text-[11px] leading-5 text-white/45">International Society for Security Professionals</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/35">Connect</p>
              <div className="mt-4 space-y-3 text-sm">
                <a href="mailto:editorial@pulser24.in" className="flex items-center gap-2 text-white/55 hover:text-white">
                  <Mail className="h-4 w-4 text-[#8b0000]" /> Contact Editorial
                </a>
                <Link
                  href={session ? '/dashboard' : '/auth/signin'}
                  aria-label={session ? `Open dashboard for ${getDisplayName(session)}` : 'Footer staff access'}
                  className="flex items-center gap-2 text-white/55 hover:text-white"
                >
                  <Globe className="h-4 w-4 text-[#8b0000]" /> {session ? 'Admin Portal' : 'Admin Portal / Staff Login'}
                </Link>
              </div>
              <div className="mt-6 flex gap-3">
                <a
                  href="https://rru.ac.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/5 text-white/35 transition hover:border-[#8b0000] hover:bg-[#8b0000] hover:text-white"
                >
                  <Globe className="h-4 w-4" />
                </a>
                <a
                  href="https://www.linkedin.com/company/rashtriya-raksha-university-puducherry-campus/posts/?feedView=all"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/5 text-[10px] font-black text-white/35 transition hover:border-[#8b0000] hover:bg-[#8b0000] hover:text-white"
                >
                  in
                </a>
                <a
                  href="https://www.instagram.com/rru.puducherrycampus/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/5 text-[10px] font-black text-white/35 transition hover:border-[#8b0000] hover:bg-[#8b0000] hover:text-white"
                >
                  ig
                </a>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-[10px] uppercase tracking-[0.18em] text-white/30 md:flex-row md:items-center md:justify-between">
          <p>(c) {new Date().getFullYear()} PULSE-R24 Intelligence Network.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/public-search" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/news" className="hover:text-white">
              Terms
            </Link>
            <Link href="/auth/signin" className="hover:text-white">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function InitiativeCard({
  image,
  title,
  subtitle,
  body,
}: {
  image: string
  title: string
  subtitle: string
  body: string
}) {
  return (
    <div className="flex gap-4 border border-white/10 bg-white/[0.04] p-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-white p-2">
        <Image src={image} alt="" width={64} height={64} className="h-full w-full object-contain" />
      </div>
      <div>
        <p className="text-sm font-bold leading-5 text-white/85">{title}</p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{subtitle}</p>
        <p className="mt-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#b71c1c]">{body}</p>
      </div>
    </div>
  )
}
