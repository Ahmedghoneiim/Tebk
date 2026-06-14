import { cn } from '@/lib/utils'

export function StatCard({ title, value, subtitle, icon: Icon, trend, className }) {
  const isPositive = trend > 0
  const isNegative = trend < 0

  return (
    <div className={cn('card flex items-start justify-between', className)}>
      <div>
        <p className="text-sm text-muted font-medium">{title}</p>
        <p className="text-2xl font-display font-bold text-primary dark:text-white mt-1">{value}</p>
        {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        {trend !== undefined && (
          <p className={cn('text-xs font-medium mt-2', isPositive ? 'text-success' : isNegative ? 'text-danger' : 'text-muted')}>
            {isPositive ? '↑' : isNegative ? '↓' : '—'} {Math.abs(trend)}% vs last month
          </p>
        )}
      </div>
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-clinical dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-secondary" />
        </div>
      )}
    </div>
  )
}
