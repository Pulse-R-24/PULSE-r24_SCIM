import { cn } from '@/lib/utils'

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('glass-card relative overflow-hidden p-5 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-rose-500/40 before:via-cyan-300/20 before:to-transparent', className)}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-sm font-semibold text-slate-200', className)}>{children}</h3>
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('text-slate-300', className)}>{children}</div>
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-shimmer rounded-lg bg-slate-800/50', className)} />
  )
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: React.ReactNode
  title: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-slate-600">{icon}</div>}
      <p className="text-sm font-medium text-slate-400">{title}</p>
      {description && <p className="mt-1 text-xs text-slate-600">{description}</p>}
    </div>
  )
}
