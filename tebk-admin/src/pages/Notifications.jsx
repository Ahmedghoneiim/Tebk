import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell, AlertTriangle, Sparkles, Users, ShoppingBag } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { fetchAdminNotifications, markAdminNotificationsRead } from '@/services/adminNotificationService'
import { formatRelativeTime } from '@/lib/utils'

const ICONS = {
  order:   { el: ShoppingBag, bg: 'bg-primary/10',  color: 'text-primary' },
  stock:   { el: AlertTriangle,bg: 'bg-amber-50',    color: 'text-warning' },
  user:    { el: Users,        bg: 'bg-green-50',    color: 'text-success' },
  welcome: { el: Sparkles,     bg: 'bg-primary/10',  color: 'text-primary' },
}

function NotifSkeleton() {
  return (
    <div className="flex items-start gap-4 px-5 py-4 animate-pulse">
      <div className="w-9 h-9 rounded-xl bg-slate-100 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="h-3 bg-slate-100 rounded w-3/4" />
        <div className="h-2 bg-slate-100 rounded w-1/4" />
      </div>
    </div>
  )
}

export function Notifications() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [showOnlyUnread, setShowOnlyUnread] = useState(false)

  const { data: raw, isLoading } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn:  fetchAdminNotifications,
    refetchInterval: 60 * 1000,
  })
  const all    = raw?.data || []
  const unread = all.filter(n => !n.read).length
  const shown  = showOnlyUnread ? all.filter(n => !n.read) : all

  const handleMarkRead = async () => {
    if (!user?.id) return
    await markAdminNotificationsRead(user.id)
    queryClient.invalidateQueries({ queryKey: ['admin-notifications'] })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="section-title">Notifications</h1>
          {unread > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-primary text-white text-xs font-bold">
              {unread} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {unread > 0 && (
            <button
              onClick={handleMarkRead}
              className="text-xs text-primary hover:underline"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={() => setShowOnlyUnread(v => !v)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${showOnlyUnread ? 'bg-primary text-white border-primary' : 'border-border text-muted hover:border-primary hover:text-primary'}`}
          >
            {showOnlyUnread ? 'Showing unread' : 'Show unread only'}
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden divide-y divide-border">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <NotifSkeleton key={i} />)
        ) : shown.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-muted">
            <Bell className="w-8 h-8 opacity-40" />
            <p className="text-sm">{showOnlyUnread ? 'No unread notifications' : 'No notifications yet'}</p>
          </div>
        ) : shown.map(n => {
          const conf  = ICONS[n.type] || ICONS.welcome
          const Icon  = conf.el
          return (
            <div
              key={n.id}
              className={`flex items-start gap-4 px-5 py-4 transition-colors ${!n.read ? 'bg-primary/5' : 'hover:bg-slate-50'}`}
            >
              <div className={`w-9 h-9 rounded-xl ${conf.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon className={`w-5 h-5 ${conf.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.read ? 'text-muted' : 'font-semibold text-ink'}`}>{n.title}</p>
                {n.message && <p className="text-xs text-muted mt-0.5 truncate">{n.message}</p>}
                <p className="text-xs text-muted mt-1.5">{formatRelativeTime(n.date)}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
