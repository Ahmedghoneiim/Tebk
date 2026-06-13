import { CreditCard, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { StatCard } from '@/components/shared/StatCard'
import { formatCurrency, formatDate } from '@/utils/format'

const MOCK_PAYMENTS = [
  { id: 'PAY-001', order: 'ORD-8A2C', customer: 'Dr. Ahmed Hassan', amount: 3200, method: 'Paymob Card', status: 'completed', date: '2025-05-18T10:30:00Z' },
  { id: 'PAY-002', order: 'ORD-4F7B', customer: 'Al Nour Clinic', amount: 7800, method: 'Paymob Wallet', status: 'completed', date: '2025-05-17T14:15:00Z' },
  { id: 'PAY-003', order: 'ORD-2E9D', customer: 'Dr. Sara Khaled', amount: 1550, method: 'Paymob Card', status: 'pending', date: '2025-05-17T09:00:00Z' },
  { id: 'PAY-004', order: 'ORD-6C1A', customer: 'Shifa Medical', amount: 4100, method: 'Paymob Card', status: 'failed', date: '2025-05-16T16:45:00Z' },
  { id: 'PAY-005', order: 'ORD-3B5E', customer: 'City Hospital', amount: 12600, method: 'Bank Transfer', status: 'completed', date: '2025-05-15T11:20:00Z' },
]

const STATUS = {
  completed: { label: 'Completed', cls: 'bg-emerald-50 text-emerald-700', icon: CheckCircle },
  pending:   { label: 'Pending',   cls: 'bg-amber-50 text-amber-700',   icon: Clock },
  failed:    { label: 'Failed',    cls: 'bg-red-50 text-red-700',       icon: XCircle },
}

export function AdminPayments() {
  usePageTitle('Payments — Admin')

  const total    = MOCK_PAYMENTS.reduce((s, p) => p.status === 'completed' ? s + p.amount : s, 0)
  const pending  = MOCK_PAYMENTS.filter(p => p.status === 'pending').length
  const failed   = MOCK_PAYMENTS.filter(p => p.status === 'failed').length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="section-title">Payments</h1>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20">
          <CreditCard className="w-3.5 h-3.5" /> Paymob Integration
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Revenue Collected" value={formatCurrency(total)} icon={TrendingUp} trend={8} />
        <StatCard title="Pending"            value={pending}              icon={Clock} />
        <StatCard title="Failed"             value={failed}               icon={XCircle} />
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
              {MOCK_PAYMENTS.map(p => {
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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
