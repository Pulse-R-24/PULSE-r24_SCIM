import Link from 'next/link'
import { Archive, ClipboardList, FilePlus2, Search, UserCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

const ACTIONS = [
  { label: 'Create New Report', href: '/dashboard/reports/new', icon: FilePlus2, tone: 'text-emerald-300' },
  { label: 'Open Review Queue', href: '/dashboard/review-queue', icon: ClipboardList, tone: 'text-blue-300' },
  { label: 'Open Assigned Reviews', href: '/dashboard/assigned-reviews', icon: UserCheck, tone: 'text-cyan-300' },
  { label: 'Open Evidence Library', href: '/dashboard/evidence', icon: Archive, tone: 'text-amber-300' },
  { label: 'Open Global Search', href: '/dashboard/search', icon: Search, tone: 'text-violet-300' },
] as const

export function QuickActionsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {ACTIONS.map(({ label, href, icon: Icon, tone }) => (
          <Link key={href} href={href} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.025] px-3 py-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.05]">
            <Icon className={`h-4 w-4 ${tone}`} />
            {label}
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
