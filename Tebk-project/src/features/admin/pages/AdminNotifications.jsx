import { Bell, CheckCircle, AlertTriangle, Sparkles, Package, Users } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatRelativeTime } from '@/utils/format'

const MOCK = [
  { id: 1, type: 'order',   title: 'New order received',          message: 'Dr. Ahmed Hassan placed order #ORD-8A2C for EGP 3,200.', read: false, created_at: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 2, type: 'user',    title: 'New supplier registered',     message: 'MedTech Supplies joined as a new supplier.', read: false, created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 3, type: 'stock',   title: 'Low stock alert',             message: 'N95 Respirator Masks: only 85 units remaining (reorder at 100).', read: false, created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: 4, type: 'order',   title: 'Order shipped',               message: 'Order #ORD-4F7B has been dispatched to Al Nour Clinic.', read: true, created_at: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: 5, type: 'welcome', title: 'New client registered',       message: 'City Hospital created an account.', read: true, created_at: new Date(Date.now() - 48 * 3600000).toISOString() },
]

const ICONS = {
  order:   <CheckCircle className="w-5 h-5 text-emerald-500" />,
  stock:   <AlertTriangle className="w-5 h-5 text-amber-500" />,
  user:    <Users className="w-5 h-5 text-secondary" />,
  welcome: <Sparkles className="w-5 h-5 text-secondary" />,
  info:    <Bell className="w-5 h-5 text-muted" />,
}

export function AdminNotifications() {
  usePageTitle('Notifications — Admin')

  const unread = MOCK.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="section-title mb-0">Notifications</h1>
        {unread > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-secondary text-white text-xs font-bold">
            {unread} new
          </span>
        )}
      </div>

      <div className="card p-0 overflow-hidden divide-y divide-border">
        {MOCK.map(n => (
          <div
            key={n.id}
            className={`flex items-start gap-4 px-5 py-4 transition-colors ${!n.read ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
          >
            <div className="mt-0.5 shrink-0">{ICONS[n.type] || ICONS.info}</div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${n.read ? 'text-muted' : 'font-semibold text-ink'}`}>{n.title}</p>
              {n.message && <p className="text-xs text-muted mt-0.5">{n.message}</p>}
              <p className="text-xs text-muted mt-1">{formatRelativeTime(n.created_at)}</p>
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  )
}
