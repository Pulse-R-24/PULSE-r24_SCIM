import { FileSearch } from 'lucide-react'
import { EmptyState } from '@/components/ui/Card'

export function EmptySearchState() {
  return (
    <EmptyState
      icon={<FileSearch className="w-5 h-5" />}
      title="No matching results"
      description="Try a broader keyword, fewer filters, or another result type."
    />
  )
}
