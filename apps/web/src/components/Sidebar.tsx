'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ClipboardList, UserCheck, GitBranch,
  Bell, Activity, FileText, Shield, LogOut, Zap,
  FilePlus2,
  Archive,
  Search,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
  { label: 'Status Dashboard', href: '/dashboard/status',              icon: Shield },
  { label: 'My Reports',       href: '/dashboard/reports',             icon: FileText },
] as const

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-screen sticky top-0
                      bg-gradient-to-b from-[#060d1f] via-[#080f22] to-[#070c1a]
                      border-r border-[rgba(99,130,210,0.10)]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[rgba(99,130,210,0.10)]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600
                          flex items-center justify-center animate-pulse-glow">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-white tracking-wide">PULSE</span>
            <span className="text-sm font-bold text-blue-400">-R24</span>
          </div>
        </div>
        <p className="text-[10px] text-slate-600 mt-0.5 pl-9">Intelligence Platform</p>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 pb-2">
          Editorial
        </p>
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className={cn('nav-link', active && 'active')}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </Link>
          )
        })}

        <div className="pt-4 pb-2">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 pb-2">
            Reports
          </p>
          {SECONDARY_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link key={href} href={href}
                className={cn('nav-link', active && 'active')}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[rgba(99,130,210,0.10)]">
        <Link href="/api/auth/signout"
          className="nav-link text-red-400/70 hover:text-red-400 hover:bg-red-500/5">
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </Link>
      </div>
    </aside>
  )
}
