import { formatLongPublicDate, getIssueNumber } from '@/components/public/publicUtils'

export function PublicIssueHeader({ date = new Date() }: { date?: string | Date }) {
  return (
    <div className="flex flex-col gap-2 text-[11px] font-mono text-slate-400">
      <span>{formatLongPublicDate(date)}</span>
      <span className="text-[10px]">{getIssueNumber(date)}</span>
    </div>
  )
}
