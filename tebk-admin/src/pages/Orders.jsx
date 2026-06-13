import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Filter, ChevronDown, Eye, Trash2, X } from 'lucide-react'
import { fetchAllOrders, updateOrderStatus, deleteOrder } from '@/services/adminOrderService'
import { formatCurrency, formatDate } from '@/lib/utils'

const STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_STYLES = {
  pending:    'badge-warning',
  processing: 'badge-info',
  shipped:    'badge-default',
  delivered:  'badge-success',
  cancelled:  'badge-danger',
}

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <td key={i} className="px-5 py-3.5">
          <div className="h-4 bg-slate-100 rounded" style={{ width: i === 2 ? '70%' : '50%' }} />
        </td>
      ))}
    </tr>
  )
}

function OrderDetailPanel({ order, onClose, onStatusChange, isUpdating }) {
  if (!order) return null

  const customer = order.profiles?.clinic_name || order.profiles?.full_name || order.shipping_name || '—'

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-ink">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h2>
            <p className="text-xs text-muted mt-0.5">{formatDate(order.created_at)}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Status</p>
            <div className="relative inline-block">
              <select
                value={order.status}
                disabled={isUpdating}
                onChange={e => onStatusChange(order.id, e.target.value)}
                className={`text-xs font-semibold rounded-full px-3 py-1.5 border-0 cursor-pointer appearance-none pr-7 ${STATUS_STYLES[order.status] || 'badge-default'}`}
              >
                {STATUSES.filter(s => s !== 'all').map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
            </div>
          </div>

          {/* Customer */}
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Customer</p>
            <div className="bg-slate-50 rounded-xl p-4 space-y-1.5 text-sm">
              <p className="font-semibold text-ink">{customer}</p>
              {order.profiles?.email || order.shipping_email
                ? <p className="text-muted">{order.profiles?.email || order.shipping_email}</p>
                : null}
              {order.shipping_phone && <p className="text-muted">{order.shipping_phone}</p>}
              {order.shipping_address && (
                <p className="text-muted">{order.shipping_address}{order.shipping_city ? `, ${order.shipping_city}` : ''}</p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
              Items ({order.order_items?.length ?? 0})
            </p>
            <div className="space-y-2">
              {(order.order_items || []).map((item, idx) => (
                <div key={item.id || idx} className="flex items-center justify-between py-2.5 px-4 bg-slate-50 rounded-xl text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink truncate">{item.name}</p>
                    <p className="text-xs text-muted">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-ink ml-4 shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
              {(!order.order_items || order.order_items.length === 0) && (
                <p className="text-sm text-muted text-center py-4">No items found.</p>
              )}
            </div>
          </div>

          {/* Payment Summary */}
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Payment</p>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted">
                <span>Method</span>
                <span className="font-medium text-ink">
                  {order.payment_method === 'cash' ? 'Cash on Delivery' : order.payment_method === 'bank' ? 'Bank Transfer' : order.payment_method || '—'}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-ink border-t border-border pt-2 mt-2">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Notes</p>
              <p className="text-sm text-ink bg-slate-50 rounded-xl p-4">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export function Orders() {
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const [search,        setSearch]  = useState(searchParams.get('q') || '')
  const [statusFilter,  setStatus]  = useState('all')
  const [selectedOrder, setSelected] = useState(null)

  const { data: raw, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn:  fetchAllOrders,
  })
  const orders = raw?.data || []

  const { mutate: changeStatus, variables: pendingUpdate } = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: (_, { orderId, status }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      if (selectedOrder?.id === orderId) {
        setSelected(prev => prev ? { ...prev, status } : null)
      }
    },
  })

  const { mutate: removeOrder } = useMutation({
    mutationFn: (orderId) => deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      setSelected(null)
    },
  })

  const handleDelete = (orderId, e) => {
    e.stopPropagation()
    if (window.confirm('Delete this order? This cannot be undone.')) {
      removeOrder(orderId)
    }
  }

  const filtered = orders.filter(o => {
    const customer = o.profiles?.clinic_name || o.profiles?.full_name || o.shipping_name || ''
    const matchSearch = customer.toLowerCase().includes(search.toLowerCase()) ||
                        o.id.toString().toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-5">
      <h1 className="section-title">Orders</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders or customers…"
            className="input-base pl-10 text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <select
            value={statusFilter}
            onChange={e => setStatus(e.target.value)}
            className="input-base pl-10 pr-8 text-sm appearance-none cursor-pointer"
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-muted font-semibold uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left">Order ID</th>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-center">Items</th>
                <th className="px-5 py-3 text-left">Payment</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} />)
                : filtered.length === 0
                  ? <tr><td colSpan={8} className="px-5 py-10 text-center text-muted text-sm">No orders found.</td></tr>
                  : filtered.map(o => {
                    const customer  = o.profiles?.clinic_name || o.profiles?.full_name || o.shipping_name || '—'
                    const email     = o.profiles?.email || ''
                    const itemCount = o.order_items?.length ?? 0
                    const isUpdating = pendingUpdate?.orderId === o.id
                    return (
                      <tr key={o.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelected(o)}>
                        <td className="px-5 py-3.5 font-mono text-xs text-muted">
                          #{o.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-ink">{customer}</p>
                          {email && <p className="text-xs text-muted">{email}</p>}
                        </td>
                        <td className="px-5 py-3.5 text-center text-muted">{itemCount}</td>
                        <td className="px-5 py-3.5 text-muted">
                          {o.payment_method === 'cash' ? 'Cash on Delivery' : o.payment_method === 'bank' ? 'Bank Transfer' : o.payment_method || '—'}
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold text-ink">
                          {formatCurrency(o.total)}
                        </td>
                        <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                          <div className="relative inline-block">
                            <select
                              value={o.status}
                              disabled={isUpdating}
                              onChange={e => changeStatus({ orderId: o.id, status: e.target.value })}
                              className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer appearance-none pr-6 ${STATUS_STYLES[o.status] || 'badge-default'}`}
                            >
                              {STATUSES.filter(s => s !== 'all').map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-muted text-xs">{formatDate(o.created_at)}</td>
                        <td className="px-5 py-3.5 text-center" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelected(o)}
                              className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-muted hover:text-primary transition-colors"
                              title="View details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={e => handleDelete(o.id, e)}
                              className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-muted hover:text-danger transition-colors"
                              title="Delete order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
              }
            </tbody>
          </table>
        </div>
      </div>

      <OrderDetailPanel
        order={selectedOrder}
        onClose={() => setSelected(null)}
        onStatusChange={(orderId, status) => changeStatus({ orderId, status })}
        isUpdating={!!pendingUpdate}
      />
    </div>
  )
}
