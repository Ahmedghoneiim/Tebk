import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { fetchOrders } from '@/services/orderService'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/EmptyState'
import { TableRowSkeleton } from '@/components/shared/LoadingSkeleton'
import { formatCurrency, formatDate } from '@/utils/format'
import { MOCK_ORDERS } from '@/utils/mockData'

const STATUS_BADGE = {
  pending:    'warning',
  processing: 'default',
  shipped:    'secondary',
  delivered:  'success',
  cancelled:  'danger',
}

export function OrderHistoryPage() {
  const { user } = useAuthStore()
  const { data, isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn:  () => fetchOrders(user.id),
    enabled:  !!user?.id,
  })

  const orders = data?.data || MOCK_ORDERS

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">My Orders</h1>
        <p className="text-muted text-sm mt-1">{orders.length} orders</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                {['Order #', 'Date', 'Items', 'Total', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
                : orders.length === 0
                  ? (
                    <tr><td colSpan={6}><EmptyState icon={Package} title="No orders yet" description="Your order history will appear here." /></td></tr>
                  )
                  : orders.map(order => (
                    <tr key={order.id} className="hover:bg-clinical transition-colors">
                      <td className="px-4 py-3 font-mono font-medium">#{order.id.slice(0, 8).toUpperCase()}</td>
                      <td className="px-4 py-3 text-muted">{formatDate(order.created_at)}</td>
                      <td className="px-4 py-3 text-muted">{order.order_items?.length || 0}</td>
                      <td className="px-4 py-3 font-semibold text-primary">{formatCurrency(order.total)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={STATUS_BADGE[order.status] || 'default'} className="capitalize">{order.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/orders/${order.id}`} className="text-secondary text-xs hover:underline">Details</Link>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
