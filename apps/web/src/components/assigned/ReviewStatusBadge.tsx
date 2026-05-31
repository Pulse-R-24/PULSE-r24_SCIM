import { StatusBadge } from '@/components/ui/Badge'

export function ReviewStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status} />
}
