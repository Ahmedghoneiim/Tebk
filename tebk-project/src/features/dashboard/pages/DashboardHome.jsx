import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ShoppingBag, Package, TrendingUp, Clock, ArrowRight, Bot, Bell, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { fetchOrders } from '@/services/orderService'
import { fetchNotifications } from '@/services/notificationService'
import { toast } from '@/store/notificationStore'
import { StatCard } from '@/components/shared/StatCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePageTitle } from '@/hooks/usePageTitle'
import { PageSkeleton } from '@/components/shared/LoadingSkeleton'
import { formatCurrency, formatDate } from '@/utils/format'
import { MOCK_ORDERS } from '@/utils/mockData'

const STATUS_BADGE = {
  pending:    'warning',
  processing: 'default',
  shipped:    'secondary',
  delivered:  'success',
  cancelled:  'danger',
}

export function DashboardHome() {
  usePageTitle('Dashboard')
  const { user, isNewUser, clearNewUser } = useAuthStore()

  // Show welcome toast once after registration
  useEffect(() => {
    if (isNewUser) {
      toast.success(`Welcome to TEBK, ${user?.full_name?.split(' ')[0] || 'Doctor'}! Your account is ready.`)
      clearNewUser()
    }
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn:  () => fetchOrders(user.id),
    enabled:  !!user?.id,
  })

  const { data: unreadNotifications = [] } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn:  () => fetchNotifications(user.id),
    enabled:  !!user?.id,
    select:   r => (r.data || []).filter(n => !n.read).slice(0, 3),
  })

  const isMockMode = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')
  const orders = data?.data ?? (isMockMode ? MOCK_ORDERS : [])
  const recentOrders = orders.slice(0, 5)
  const totalSpent = orders.reduce((s, o) => s + o.total, 0)

  if (isLoading) return <PageSkeleton />

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">Welcome back, {user?.full_name?.split(' ')[0] || 'Doctor'}</h1>
        <p className="text-muted text-sm mt-1">{user?.clinic_name || 'Your clinic dashboard'}</p>
      </div>

      {/* Notifications widget — shown only when there are unread notifications */}
      {unreadNotifications.length > 0 && (
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-secondary" />
              <span className="text-sm font-semibold text-primary">Notifications</span>
              <span className="w-5 h-5 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center">
                {unreadNotifications.length}
              </span>
            </div>
            <Link to="/notifications" className="text-xs text-secondary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {unreadNotifications.map(n => (
              <div key={n.id} className="flex items-start gap-3 px-5 py-3 bg-blue-50/20">
                <Sparkles className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{n.title}</p>
                  {n.message && <p className="text-xs text-muted mt-0.5 line-clamp-2">{n.message}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Orders"    value={orders.length}              icon={ShoppingBag} trend={8}  />
        <StatCard title="Total Spent"     value={formatCurrency(totalSpent)} icon={TrendingUp}  trend={12} />
        <StatCard title="Pending Orders"  value={orders.filter(o => o.status === 'pending').length}    icon={Clock}     />
        <StatCard title="Delivered"       value={orders.filter(o => o.status === 'delivered').length}  icon={Package}   />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/products',  icon: Package, label: 'Browse Products', desc: 'Shop medical supplies' },
          { to: '/assistant', icon: Bot,     label: 'AI Assistant',    desc: 'Get procurement advice' },
          { to: '/bundles',   icon: Package, label: 'Smart Bundles',   desc: 'Pre-built supply kits' },
        ].map(({ to, icon: Icon, label, desc }) => (
          <Link key={to} to={to} className="card hover:shadow-card transition-shadow flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-clinical flex items-center justify-center">
              <Icon className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{label}</p>
              <p className="text-xs text-muted">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-primary">Recent Orders</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/orders">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
          </Button>
        </div>
        {recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center text-muted text-sm">No orders yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map(order => (
              <Link key={order.id} to={`/orders/${order.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-clinical transition-colors">
                <div>
                  <p className="text-sm font-medium text-ink">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-muted mt-0.5">{formatDate(order.created_at)} · {order.order_items?.length || 0} items</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={STATUS_BADGE[order.status] || 'default'} className="capitalize">{order.status}</Badge>
                  <span className="text-sm font-semibold text-primary">{formatCurrency(order.total)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
