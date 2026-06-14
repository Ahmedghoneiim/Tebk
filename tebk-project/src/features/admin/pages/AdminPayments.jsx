import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CreditCard, TrendingUp, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { StatCard } from '@/components/shared/StatCard'
import { fetchAllOrders } from '@/services/orderService'
import { formatCurrency, formatDate } from '@/utils/format'
import { getOrderTotal, getPaymentMethodLabel } from '@/utils/payments'

const STATUS = {
  completed: { label: 'Completed', cls: 'bg-emerald-50 text-emerald-700', icon: CheckCircle },
  pending:   { label: 'Pending',   cls: 'bg-amber-50 text-amber-700',     icon: Clock },
  failed:    { label: 'Failed',    cls: 'bg-rose-50 text-rose-700',       icon: XCircle },
}

export function AdminPayments() {
  usePageTitle('Payments - Admin')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: fetchAllOrders,
  })

  




  const payments = useMemo(() => (data?.data || []).map(order => ({
    id:       `PAY-${order.id.slice(0, 8).toUpperCase()}`,
    customer: order.shipping_name || order.profiles?.full_name || 'Unknown',
    amount:   getOrderTotal(order),
    method:   getPaymentMethodLabel(order.payment_method),
    status:   order.payment_status === 'paid'
      ? 'completed'
      : order.payment_status === 'failed'
        ? 'failed'
        : 'pending',
    date: order.created_at,
  })), [data?.data])

  const total   = payments.reduce((s, p) => p.status === 'completed' ? s + p.amount : s, 0)
  const pending = payments.filter(p => p.status === 'pending').length
  const failed  = payments.filter(p => p.status === 'failed').length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="section-title">Payments</h1>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20">
          <CreditCard className="w-3.5 h-3.5" /> Paymob Card + COD
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Revenue Collected" value={isLoading ? '…' : formatCurrency(total)} icon={TrendingUp} trend={8} />
        <StatCard title="Pending"           value={isLoading ? '…' : pending}              icon={Clock} />
        <StatCard title="Failed"            value={isLoading ? '…' : failed}               icon={XCircle} />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-primary">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-muted font-semibold uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">Payment ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Method</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-secondary" />
                    Loading payment records…
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted">No payment records.</td>
                </tr>
              ) : (
                payments.map(p => {
                  const { label, cls } = STATUS[p.status]
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-muted">{p.id}</td>
                      <td className="px-6 py-4 font-medium text-ink">{p.customer}</td>
                      <td className="px-6 py-4 text-muted">{p.method}</td>
                      <td className="px-6 py-4 text-right font-semibold text-primary">{formatCurrency(p.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
                          {label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted">{formatDate(p.date)}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
