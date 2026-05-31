import Link from 'next/link'
import { UserCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import type { DashboardAssignedReviewPreview } from '@/components/dashboard/types'
import { formatDate } from '@/lib/utils'

export function AssignedReviewsWidget({ reviews }: { reviews: DashboardAssignedReviewPreview[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-cyan-400" />
          My Assigned Reviews
        </CardTitle>
        <Link href="/dashboard/assigned-reviews" className="text-xs font-semibold text-blue-300 hover:text-blue-200">Open</Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {reviews.length === 0 && <EmptyState title="No assigned reviews" description="Nothing is waiting on your desk." />}
        {reviews.map((review) => (
          <Link key={review.assignmentId} href="/dashboard/assigned-reviews" className="block rounded-lg border border-white/10 bg-white/[0.025] p-3 hover:bg-white/[0.04]">
            <div className="flex items-start justify-between gap-3">
              <p className="line-clamp-2 text-sm font-semibold text-slate-100">{review.title}</p>
              <StatusBadge status={review.status} />
            </div>
            <p className="mt-2 text-xs text-slate-500">Assigned {formatDate(review.assigned_at)}</p>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
