import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Package } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { fetchOrderById } from '@/services/orderService'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatDate } from '@/utils/format'
import { MOCK_ORDERS } from '@/utils/mockData'

const STATUS_BADGE = {
  pending:    'warning',
  processing: 'default',
  shipped:    'secondary',
  delivered:  'success',
  cancelled:  'danger',
}

export function OrderDetailPage() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn:  () => fetchOrderById(id, user.id),
    enabled:  !!user?.id,
  })

  const order = data?.data || MOCK_ORDERS.find(o => o.id === id)

  if (!isLoading && data?.data && user?.id && data.data.user_id !== user.id) {
    navigate('/orders', { replace: true })
    return null
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-muted">Order not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/orders')}>Back to Orders</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/orders')} className="text-muted hover:text-ink transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="section-title">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
          <p className="text-muted text-sm">{formatDate(order.created_at)}</p>
        </div>
        <Badge variant={STATUS_BADGE[order.status] || 'default'} className="capitalize ml-auto">{order.status}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-primary">Order Items</h2>
          </div>
          <div className="divide-y divide-border">
            {order.order_items?.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-10 h-10 rounded-xl bg-clinical flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                  <p className="text-xs text-muted">× {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-primary">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h2 className="font-semibold text-primary mb-3">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span><span>{formatCurrency(order.total - 50)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Shipping</span><span className="text-success">Free</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-border">
                <span>Total</span><span className="text-primary">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold text-primary mb-3">Shipping To</h2>
            <div className="text-sm text-muted space-y-1">
              <p className="text-ink font-medium">{order.shipping_name}</p>
              <p>{order.shipping_address}</p>
              <p>{order.shipping_city}</p>
              <p>{order.shipping_phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
