import { BarChart2, TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { StatCard } from '@/components/shared/StatCard'
import { formatCurrency } from '@/utils/format'

const TOP_PRODUCTS = [
  { name: 'Surgical Gloves (L)',    revenue: 48200, orders: 124 },
  { name: 'N95 Respirator Masks',   revenue: 35600, orders: 89 },
  { name: 'IV Cannula 20G',         revenue: 29100, orders: 73 },
  { name: 'Disposable Syringes 5ml',revenue: 22400, orders: 61 },
  { name: 'Bandage Roll 5cm',       revenue: 14800, orders: 47 },
]

const MONTHLY = [
  { month: 'Jan', revenue: 24000 },
  { month: 'Feb', revenue: 31000 },
  { month: 'Mar', revenue: 28000 },
  { month: 'Apr', revenue: 39000 },
  { month: 'May', revenue: 43000 },
]

const MAX_REV = Math.max(...MONTHLY.map(m => m.revenue))

export function AdminReports() {
  usePageTitle('Reports — Admin')

  const totalRevenue = MONTHLY.reduce((s, m) => s + m.revenue, 0)

  return (
    <div className="space-y-6">
      <h1 className="section-title">Reports</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Revenue"  value={formatCurrency(totalRevenue)} icon={DollarSign} trend={12} />
        <StatCard title="Total Orders"   value={394}                          icon={ShoppingBag} trend={8} />
        <StatCard title="Active Clients" value={87}                           icon={Users} trend={5} />
        <StatCard title="Avg. Order"     value={formatCurrency(totalRevenue / 394)} icon={TrendingUp} />
      </div>

      {/* Revenue bar chart (CSS-based) */}
      <div className="card">
        <h2 className="font-semibold text-primary mb-5">Monthly Revenue</h2>
        <div className="flex items-end gap-4 h-40">
          {MONTHLY.map(({ month, revenue }) => (
            <div key={month} className="flex-1 flex flex-col items-center gap-2">
              <p className="text-xs font-semibold text-primary">{formatCurrency(revenue, 0)}</p>
              <div
                className="w-full rounded-t-lg transition-all duration-500"
                style={{
                  height: `${(revenue / MAX_REV) * 100}%`,
                  background: 'linear-gradient(180deg, #C1E3C4, #1bb3a7)',
                }}
              />
              <p className="text-xs text-muted font-medium">{month}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top products */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-secondary" />
          <h2 className="font-semibold text-primary">Top Products by Revenue</h2>
        </div>
        <div className="divide-y divide-border">
          {TOP_PRODUCTS.map((p, i) => (
            <div key={p.name} className="flex items-center gap-4 px-6 py-4">
              <span className="w-6 h-6 rounded-full bg-clinical flex items-center justify-center text-xs font-bold text-secondary shrink-0">
                {i + 1}
              </span>
              <p className="flex-1 text-sm font-medium text-ink">{p.name}</p>
              <p className="text-xs text-muted">{p.orders} orders</p>
              <p className="text-sm font-semibold text-primary w-24 text-right">{formatCurrency(p.revenue)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
