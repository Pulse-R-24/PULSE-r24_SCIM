import { cn, getStatusInfo } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'subtle'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium',
      variant === 'outline' && 'border border-slate-600 text-slate-300 bg-transparent',
      variant === 'subtle'  && 'bg-white/5 text-slate-400',
      variant === 'default' && 'bg-slate-700/60 text-slate-300',
      className
    )}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const info = getStatusInfo(status)
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
      info.css
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', info.dot)} />
      {info.label}
    </span>
  )
}
