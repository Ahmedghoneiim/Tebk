import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ShoppingBag, DollarSign, FileText, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { fetchAllOrders } from '@/services/adminOrderService'
import { fetchAllProducts } from '@/services/adminProductService'
import { fetchAllUsers, approveUser } from '@/services/adminUserService'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const STATUS_STYLES = {
  pending:    'badge-warning',
  processing: 'badge-info',
  shipped:    'badge-default',
  delivered:  'badge-success',
  cancelled:  'badge-danger',
}

function TableRowSkeleton({ cols = 6 }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-100 rounded" style={{ width: i === 1 ? '70%' : '50%' }} />
        </td>
      ))}
    </tr>
  )
}

export function Dashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate: approve, variables: approvingId } = useMutation({
    mutationFn: (userId) => approveUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const { data: ordersData,   isLoading: loadingOrders   } = useQuery({ queryKey: ['admin-orders'],   queryFn: fetchAllOrders   })
  const { data: productsData, isLoading: loadingProducts } = useQuery({ queryKey: ['admin-products'], queryFn: fetchAllProducts })
  const { data: usersData,    isLoading: loadingUsers    } = useQuery({ queryKey: ['admin-users'],    queryFn: fetchAllUsers    })

  const orders   = ordersData?.data   || []
  const products = productsData?.data || []
  const users    = usersData?.data    || []

  /* ── Stat calculations ── */
  const stats = useMemo(() => {
    const totalRevenue   = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total), 0)
    const pendingB2BDocs = users.filter(u => (u.role === 'client' || u.role === 'supplier') && !u.verified).length
    const criticalStock  = products.filter(p => typeof p.stock === 'number' && p.stock > 0 && p.stock < 20).length
    return { totalRevenue, pendingB2BDocs, criticalStock }
  }, [orders, products, users])

  /* ── B2B vs B2C monthly chart ── */
  const monthlyChart = useMemo(() => {
    const map = {}
    orders.forEach(o => {
      if (o.status === 'cancelled') return
      const d      = new Date(o.created_at)
      const key    = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label  = d.toLocaleString('en', { month: 'short' })
      const isB2B  = o.profiles?.role === 'client' || o.profiles?.role === 'supplier'
      if (!map[key]) map[key] = { label, b2b: 0, b2c: 0 }
      if (isB2B) map[key].b2b += Number(o.total)
      else       map[key].b2c += Number(o.total)
    })
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([, v]) => v)
  }, [orders])

  const maxRev = Math.max(...monthlyChart.map(m => m.b2b + m.b2c), 1)

  /* ── Pending verification queue ── */
  const pendingVerif = useMemo(() =>
    users
      .filter(u => (u.role === 'client' || u.role === 'supplier') && !u.verified)
      .slice(0, 5)
      .map(u => ({
        id:   u.id,
        name: u.clinic_name || u.full_name || '—',
        doc:  u.role === 'supplier' ? 'tax_card.pdf' : 'license_v2.pdf',
        role: u.role,
      }))
  , [users])

  /* ── Master orders ledger (recent 10) ── */
  const recentOrders = orders.slice(0, 10)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="section-title">Welcome back, Director!</h1>
          <p className="text-sm text-muted mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />
            System Status: All Supabase Services Real-time Active
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={loadingOrders ? '…' : formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
        />
        <StatCard
          title="Total Orders"
          value={loadingOrders ? '…' : orders.length.toLocaleString()}
          icon={ShoppingBag}
        />
        <StatCard
          title="Pending B2B Docs"
          value={loadingUsers ? '…' : stats.pendingB2BDocs.toString()}
          icon={FileText}
        />
        <StatCard
          title="Critical Low Stock"
          value={loadingProducts ? '…' : stats.criticalStock.toString()}
          icon={AlertTriangle}
        />
      </div>

      {/* Chart + Verification Queue */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Sales & Revenue Splitting */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-ink">Sales &amp; Revenue Splitting</h2>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#6366f1' }} /> B2B Flow</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#2EC4B6' }} /> B2C Flow</span>
            </div>
          </div>
          {monthlyChart.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">No revenue data yet</p>
          ) : (
            <div className="flex items-end gap-2 h-36">
              {monthlyChart.map(({ label, b2b, b2c }) => {
                const total = b2b + b2c
                return (
                  <div key={label} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end gap-0.5" style={{ height: '96px' }}>
                      <div
                        className="flex-1 rounded-t-md transition-all"
                        style={{ height: `${(b2b / maxRev) * 96}px`, background: '#6366f1', minHeight: b2b > 0 ? 2 : 0 }}
                      />
                      <div
                        className="flex-1 rounded-t-md transition-all"
                        style={{ height: `${(b2c / maxRev) * 96}px`, background: '#2EC4B6', minHeight: b2c > 0 ? 2 : 0 }}
                      />
                    </div>
                    <p className="text-[10px] text-muted">{label}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Pending Verification Queue */}
        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-ink">Pending Verification Queue</h2>
            <p className="text-xs text-muted mt-0.5">Review and Elevate Client to Supplier</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-muted font-semibold uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Entity Name</th>
                  <th className="px-4 py-3 text-left">Uploaded Doc</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loadingUsers
                  ? Array.from({ length: 3 }).map((_, i) => <TableRowSkeleton key={i} cols={3} />)
                  : pendingVerif.length === 0
                    ? <tr><td colSpan={3} className="px-4 py-8 text-center text-muted text-sm">No pending verifications.</td></tr>
                    : pendingVerif.map(v => (
                      <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-ink">{v.name}</td>
                        <td className="px-4 py-3 text-muted font-mono text-xs">{v.doc}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => approve(v.id)}
                            disabled={approvingId === v.id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors disabled:opacity-60"
                            style={{ background: '#6366f1' }}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            {approvingId === v.id ? 'Approving…' : 'Approve'}
                          </button>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Master Orders Ledger */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold text-ink">Master Orders Ledger</h2>
            <p className="text-xs text-muted mt-0.5">Real-time Live Sync with Supabase</p>
          </div>
          <button onClick={() => navigate('/orders')} className="text-xs text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-muted font-semibold uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Client / Institution</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-left">MOQ Validation</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loadingOrders
                ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
                : recentOrders.length === 0
                  ? <tr><td colSpan={6} className="px-4 py-10 text-center text-muted">No orders yet.</td></tr>
                  : recentOrders.map(o => {
                    const isB2B   = o.profiles?.role === 'client' || o.profiles?.role === 'supplier'
                    const type    = isB2B ? 'B2B' : 'B2C'
                    const total   = Number(o.total)
                    let moqLabel  = 'N/A'
                    let moqClass  = 'text-muted'
                    if (isB2B) {
                      if (total >= 5000) { moqLabel = '🟢 Passed';       moqClass = 'text-success font-medium' }
                      else               { moqLabel = '🔴 Failed (Min)'; moqClass = 'text-danger font-medium' }
                    }
                    return (
                      <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-muted">
                          #{isB2B ? 'B2B' : 'B2C'}-{o.id.toString().slice(-3).padStart(3, '0')}
                        </td>
                        <td className="px-4 py-3 font-medium text-ink">
                          {o.profiles?.clinic_name || o.profiles?.full_name || o.shipping_name || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-semibold',
                            isB2B ? 'bg-indigo-50 text-primary' : 'bg-teal-50 text-teal-700'
                          )}>
                            {type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-ink">{formatCurrency(total)}</td>
                        <td className={cn('px-4 py-3 text-xs', moqClass)}>{moqLabel}</td>
                        <td className="px-4 py-3">
                          <span className={STATUS_STYLES[o.status] || 'badge-default'}>{o.status}</span>
                        </td>
                      </tr>
                    )
                  })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
