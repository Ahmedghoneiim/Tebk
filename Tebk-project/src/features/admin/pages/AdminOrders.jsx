import { useQuery } from '@tanstack/react-query'
import { fetchAllOrders } from '@/services/orderService'
import { Badge } from '@/components/ui/badge'
import { TableRowSkeleton } from '@/components/shared/LoadingSkeleton'
import { formatCurrency, formatDate } from '@/utils/format'
import { MOCK_ORDERS } from '@/utils/mockData'

const STATUS_BADGE = { pending: 'warning', processing: 'default', shipped: 'secondary', delivered: 'success', cancelled: 'danger' }

export function AdminOrders() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-orders'], queryFn: fetchAllOrders })
  const orders = data?.data || MOCK_ORDERS

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">All Orders</h1>
        <p className="text-muted text-sm mt-1">{orders.length} orders total</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                {['Order #', 'Client', 'Items', 'Date', 'Total', 'Status', 'Payment'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
                : orders.map(order => (
                  <tr key={order.id} className="hover:bg-clinical transition-colors">
                    <td className="px-4 py-3 font-mono">#{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-4 py-3 text-muted">{order.shipping_name || '—'}</td>
                    <td className="px-4 py-3 text-muted">{order.order_items?.length || 0}</td>
                    <td className="px-4 py-3 text-muted">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-3"><Badge variant={STATUS_BADGE[order.status] || 'default'} className="capitalize">{order.status}</Badge></td>
                    <td className="px-4 py-3 text-muted capitalize">{order.payment_method?.replace('_', ' ') || 'COD'}</td>
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
