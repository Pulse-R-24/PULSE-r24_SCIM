'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ClipboardList, UserCheck, GitBranch,
  Bell, Activity, LogOut, Zap,
  FilePlus2,
  Archive,
  Search,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SignOutButton } from '@/components/auth/SignOutButton'

const NAV_ITEMS = [
  { label: 'Dashboard',        href: '/dashboard',                      icon: LayoutDashboard },
  { label: 'Review Queue',     href: '/dashboard/review-queue',         icon: ClipboardList },
  { label: 'Assigned to Me',  href: '/dashboard/assigned-reviews',     icon: UserCheck },
  { label: 'Workflow History', href: '/dashboard/workflow-history',     icon: GitBranch },
  { label: 'Notifications',    href: '/dashboard/notifications',        icon: Bell },
  { label: 'Activity Feed',    href: '/dashboard/activity',             icon: Activity },
  { label: 'Search',           href: '/dashboard/search',               icon: Search },
  { label: 'Analytics',        href: '/dashboard/analytics',            icon: BarChart3 },
  { label: 'Evidence Library',  href: '/dashboard/evidence',             icon: Archive },
] as const

const SECONDARY_ITEMS = [
  { label: 'New Report',       href: '/dashboard/reports/new',         icon: FilePlus2 },
] as const

export function Sidebar() {
  const pathname = usePathname()
  const isActive = (href: string) => (href === '/dashboard' ? pathname === href : pathname === href || pathname.startsWith(href + '/'))

  return (
    <aside className="w-16 flex-shrink-0 flex flex-col h-screen sticky top-0 sm:w-64
                      bg-gradient-to-b from-[#060d1f] via-[#080f22] to-[#070c1a]
                      border-r border-[rgba(99,130,210,0.10)]">
      {/* Logo */}
      <div className="px-3 py-5 sm:px-5 border-b border-rose-500/10">
        <div className="flex items-center justify-center gap-2.5 sm:justify-start">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-700 to-red-950
                          flex items-center justify-center animate-pulse-glow">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-editorial text-lg font-black text-white tracking-wide">PULSE</span>
            <span className="font-editorial text-lg font-black text-rose-400">-R24</span>
          </div>
        </div>
        <p className="hidden text-[10px] text-slate-600 mt-0.5 pl-9 sm:block">Private Editorial Control</p>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5 sm:px-3">
        <p className="hidden text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 pb-2 sm:block">
          Editorial
        </p>
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link key={href} href={href}
              className={cn('nav-link', active && 'active')}
              aria-label={label}
              title={label}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          )
        })}

        <div className="pt-4 pb-2">
          <p className="hidden text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 pb-2 sm:block">
            Reports
          </p>
          {SECONDARY_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = isActive(href)
            return (
              <Link key={href} href={href}
                className={cn('nav-link', active && 'active')}
                aria-label={label}
                title={label}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[rgba(99,130,210,0.10)]">
        <SignOutButton
          label="Sign out"
          className="nav-link w-full border-0 bg-transparent text-red-400/70 hover:bg-red-500/5 hover:text-red-400"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign out</span>
        </SignOutButton>
      </div>
    </aside>
  )
}
