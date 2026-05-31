import {
  Archive,
  Bell,
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  RadioTower,
  Send,
  ShieldCheck,
  UserCheck
} from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import type { DashboardStatCounts } from '@/components/dashboard/types'

export function DashboardStatsGrid({ stats }: { stats: DashboardStatCounts }) {
  const cards = [
    { label: 'Total Reports', value: stats.totalReports, icon: <FileText className="h-4 w-4" />, tone: 'blue' as const },
    { label: 'Draft Reports', value: stats.draftReports, icon: <Clock3 className="h-4 w-4" />, tone: 'slate' as const },
    { label: 'Under Review', value: stats.reportsUnderReview, icon: <Send className="h-4 w-4" />, tone: 'cyan' as const },
    { label: 'Approved', value: stats.approvedReports, icon: <CheckCircle2 className="h-4 w-4" />, tone: 'emerald' as const },
    { label: 'Published', value: stats.publishedReports, icon: <RadioTower className="h-4 w-4" />, tone: 'violet' as const },
    { label: 'Archived', value: stats.archivedReports, icon: <Archive className="h-4 w-4" />, tone: 'slate' as const },
    { label: 'Assigned Reviews', value: stats.pendingAssignedReviews, icon: <UserCheck className="h-4 w-4" />, tone: 'amber' as const, description: 'Pending for you' },
    { label: 'Evidence Items', value: stats.totalEvidenceItems, icon: <Database className="h-4 w-4" />, tone: 'blue' as const },
    { label: 'Unread Alerts', value: stats.unreadNotifications, icon: <Bell className="h-4 w-4" />, tone: 'amber' as const },
    { label: 'Recent Activity', value: stats.recentActivityCount, icon: <ShieldCheck className="h-4 w-4" />, tone: 'emerald' as const, description: 'Last 7 days' },
  ]

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </section>
  )
}
