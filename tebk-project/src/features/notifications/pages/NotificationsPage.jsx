import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell, Package, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { fetchNotifications, markAllNotificationsRead } from '@/services/notificationService'
import { EmptyState } from '@/components/shared/EmptyState'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatRelativeTime } from '@/utils/format'
import { useTranslation } from '@/hooks/useTranslation'

const icons = {
  welcome: <Sparkles className="w-5 h-5 text-secondary" />,
  order:   <CheckCircle className="w-5 h-5 text-success" />,
  stock:   <AlertTriangle className="w-5 h-5 text-warning" />,
  info:    <Bell className="w-5 h-5 text-secondary" />,
}

export function NotificationsPage() {
  usePageTitle('Notifications')
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn:  () => fetchNotifications(user.id),
    enabled:  !!user?.id,
    select:   r => r.data || [],
  })

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(user.id)
    queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="section-title">{t('notifications.title')}</h1>
        <div className="card p-6 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-5 h-5 rounded-full bg-border shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-border rounded w-2/3" />
                <div className="h-3 bg-border rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="section-title">{t('notifications.title')}</h1>
        <EmptyState icon={Bell} title={t('notifications.no_notifications')} description={t('notifications.all_caught_up')} />
      </div>
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="section-title mb-0">{t('notifications.title')}</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-secondary text-white text-xs font-bold">
              {t('notifications.new_badge').replace('{n}', unreadCount)}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-secondary hover:underline"
          >
            {t('notifications.mark_all_read')}
          </button>
        )}
      </div>

      <div className="card p-0 overflow-hidden divide-y divide-border">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`flex items-start gap-4 px-5 py-4 hover:bg-clinical transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}
          >
            <div className="mt-0.5 shrink-0">{icons[n.type] || icons.info}</div>
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
