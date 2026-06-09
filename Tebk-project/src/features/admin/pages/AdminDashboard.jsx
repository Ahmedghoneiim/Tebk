import { useQuery } from '@tanstack/react-query'
import { ShoppingBag, Users, Package, TrendingUp } from 'lucide-react'
import { fetchAllOrders } from '@/services/orderService'
import { StatCard } from '@/components/shared/StatCard'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/utils/format'
import { MOCK_ORDERS } from '@/utils/mockData'

const STATUS_BADGE = { pending: 'warning', processing: 'default', shipped: 'secondary', delivered: 'success', cancelled: 'danger' }

export function AdminDashboard() {
  const { data } = useQuery({ queryKey: ['admin-orders'], queryFn: fetchAllOrders })
  const orders = data?.data || MOCK_ORDERS

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="text-muted text-sm mt-1">Platform overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Orders"   value={orders.length}              icon={ShoppingBag} trend={15} />
        <StatCard title="Total Revenue"  value={formatCurrency(totalRevenue)} icon={TrendingUp} trend={22} />
        <StatCard title="Products"       value="16"                          icon={Package}     />
        <StatCard title="Active Clients" value="142"                         icon={Users}       trend={8}  />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-primary">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                {['Order #', 'Client', 'Date', 'Total', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-clinical transition-colors">
                  <td className="px-4 py-3 font-mono">#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-4 py-3 text-muted">{order.shipping_name || '—'}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3 font-semibold text-primary">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3"><Badge variant={STATUS_BADGE[order.status] || 'default'} className="capitalize">{order.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
