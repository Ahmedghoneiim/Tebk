import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StatCard({ title, value, icon: Icon, trend, className }) {
  return (
    <div className={cn('card flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">{title}</p>
        <p className="text-2xl font-bold text-ink">{value}</p>
        {trend !== undefined && (
          <p className={cn('flex items-center gap-1 text-xs font-medium mt-1', trend >= 0 ? 'text-success' : 'text-danger')}>
            {trend >= 0
              ? <TrendingUp className="w-3 h-3" />
              : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}% vs last month
          </p>
        )}
      </div>
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      )}
    </div>
  )
}
