import { CalendarDays, FileText } from 'lucide-react'
import { formatLongPublicDate, getIssueNumber } from '@/components/public/publicUtils'

export function PublicIssueHeader({ date = new Date() }: { date?: string | Date }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
      <span className="inline-flex items-center gap-2">
        <CalendarDays className="h-3.5 w-3.5 text-rose-800" />
        {formatLongPublicDate(date)}
      </span>
      <span className="h-1 w-1 rounded-full bg-rose-800" />
      <span className="inline-flex items-center gap-2">
        <FileText className="h-3.5 w-3.5 text-rose-800" />
        {getIssueNumber(date)}
      </span>
    </div>
  )
}
