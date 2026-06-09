import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CreditCard, TrendingUp, Clock, XCircle } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { fetchAllOrders } from '@/services/adminOrderService'
import { formatCurrency, formatDate } from '@/lib/utils'

const STATUS_MAP = {
  delivered: 'completed',
  shipped:   'completed',
  processing:'pending',
  pending:   'pending',
  cancelled: 'failed',
}

const STATUS_STYLES = {
  completed: 'badge-success',
  pending:   'badge-warning',
  failed:    'badge-danger',
}

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <td key={i} className="px-5 py-3.5">
          <div className="h-4 bg-slate-100 rounded" style={{ width: i === 2 ? '65%' : '50%' }} />
        </td>
      ))}
    </tr>
  )
}

export function Payments() {
  const { data: raw, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn:  fetchAllOrders,
  })
  const orders = raw?.data || []

  const payments = useMemo(() => orders.map(o => ({
    id:         `PAY-${o.id.toString().slice(0, 6).toUpperCase()}`,
    orderId:    o.id,
    customer:   o.profiles?.clinic_name || o.profiles?.full_name || o.shipping_name || '—',
    email:      o.profiles?.email || '',
    amount:     Number(o.total),
    method:     o.payment_method?.replace('_', ' ') || 'Unknown',
    status:     STATUS_MAP[o.status] || 'pending',
    date:       o.created_at,
  })), [orders])

  const revenue = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0)
  const pending = payments.filter(p => p.status === 'pending').length
  const failed  = payments.filter(p => p.status === 'failed').length

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <h1 className="section-title">Payments</h1>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <CreditCard className="w-3.5 h-3.5" /> Paymob Integration
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Revenue Collected" value={isLoading ? '…' : formatCurrency(revenue)} icon={TrendingUp} />
        <StatCard title="Pending"           value={isLoading ? '…' : pending.toString()}       icon={Clock} />
        <StatCard title="Failed"            value={isLoading ? '…' : failed.toString()}        icon={XCircle} />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-muted font-semibold uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left">Payment ID</th>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Method</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} />)
                : payments.length === 0
                  ? <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">No payment records.</td></tr>
                  : payments.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs text-muted">{p.id}</td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-ink">{p.customer}</p>
                        {p.email && <p className="text-xs text-muted">{p.email}</p>}
                      </td>
                      <td className="px-5 py-3.5 text-muted capitalize">{p.method}</td>
                      <td className="px-5 py-3.5 text-right font-semibold text-ink">{formatCurrency(p.amount)}</td>
                      <td className="px-5 py-3.5"><span className={STATUS_STYLES[p.status]}>{p.status}</span></td>
                      <td className="px-5 py-3.5 text-muted">{formatDate(p.date)}</td>
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
