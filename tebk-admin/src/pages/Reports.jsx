import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { fetchReportData } from '@/services/adminReportService'
import { formatCurrency } from '@/lib/utils'

function SkeletonBar() {
  return (
    <div className="flex-1 flex flex-col items-center gap-2 animate-pulse">
      <div className="h-3 w-12 bg-slate-100 rounded" />
      <div className="w-full bg-slate-100 rounded-t-xl" style={{ height: '60%' }} />
      <div className="h-3 w-8 bg-slate-100 rounded" />
    </div>
  )
}

export function Reports() {
  const { data: raw, isLoading } = useQuery({
    queryKey: ['admin-report-data'],
    queryFn:  fetchReportData,
    staleTime: 10 * 60 * 1000,
  })

  const { orders = [], profiles = [], products = [] } = raw?.data || {}

  const stats = useMemo(() => {
    const totalRevenue  = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total), 0)
    const totalOrders   = orders.length
    const clientCount   = profiles.filter(p => p.role === 'clinic_owner' || p.role === 'doctor').length
    const avgOrder      = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
    return { totalRevenue, totalOrders, clientCount, avgOrder }
  }, [orders, profiles])

  const monthlyChart = useMemo(() => {
    const map = {}
    orders.filter(o => o.status !== 'cancelled').forEach(o => {
      const d     = new Date(o.created_at)
      const key   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label = d.toLocaleString('en', { month: 'short', year: '2-digit' })
      if (!map[key]) map[key] = { label, revenue: 0, orders: 0 }
      map[key].revenue += Number(o.total)
      map[key].orders  += 1
    })
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([, v]) => v)
  }, [orders])

  const topProducts = useMemo(() => {
    const map = {}
    orders.forEach(o => {
      (o.order_items || []).forEach(item => {
        const key = item.name
        if (!map[key]) map[key] = { name: key, revenue: 0, orders: 0 }
        map[key].revenue += Number(item.price) * item.quantity
        map[key].orders  += item.quantity
      })
    })
    const sorted = Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5)
    const maxRev = sorted[0]?.revenue || 1
    return sorted.map(p => ({ ...p, pct: Math.round((p.revenue / maxRev) * 100) }))
  }, [orders])

  const maxRev = Math.max(...monthlyChart.map(m => m.revenue), 1)

  return (
    <div className="space-y-6">
      <h1 className="section-title">Reports</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Revenue"  value={isLoading ? '…' : formatCurrency(stats.totalRevenue)} icon={DollarSign} />
        <StatCard title="Total Orders"   value={isLoading ? '…' : stats.totalOrders.toString()}       icon={ShoppingBag} />
        <StatCard title="Active Clients" value={isLoading ? '…' : stats.clientCount.toString()}       icon={Users} />
        <StatCard title="Avg. Order"     value={isLoading ? '…' : formatCurrency(stats.avgOrder)}     icon={TrendingUp} />
      </div>

      {/* Revenue bar chart */}
      <div className="card">
        <h2 className="text-sm font-semibold text-ink mb-5">Monthly Revenue</h2>
        <div className="flex items-end gap-4 h-44">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonBar key={i} />)
            : monthlyChart.length === 0
              ? <p className="text-sm text-muted m-auto">No data yet</p>
              : monthlyChart.map(({ label, revenue }) => (
                <div key={label} className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-xs font-semibold text-muted">{formatCurrency(revenue)}</p>
                  <div
                    className="w-full rounded-t-xl transition-all duration-500"
                    style={{ height: `${(revenue / maxRev) * 100}%`, background: 'linear-gradient(180deg, #6366f1, #4f46e5)' }}
                  />
                  <p className="text-xs font-medium text-muted">{label}</p>
                </div>
              ))
          }
        </div>
      </div>

      {/* Top products */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-ink">Top Products by Revenue</h2>
        </div>
        {isLoading ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
                <div className="w-6 h-6 rounded-full bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-1.5 bg-slate-100 rounded-full" />
                </div>
                <div className="w-20 h-4 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : topProducts.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">No order data yet</p>
        ) : (
          <div className="divide-y divide-border">
            {topProducts.map((p, i) => (
              <div key={p.name} className="px-5 py-4 flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink mb-1 truncate">{p.name}</p>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${p.pct}%`, background: 'linear-gradient(90deg, #6366f1, #818cf8)' }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-ink">{formatCurrency(p.revenue)}</p>
                  <p className="text-xs text-muted">{p.orders} units sold</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
