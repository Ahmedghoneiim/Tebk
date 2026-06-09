import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { RefreshCw, Pause, Play, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/EmptyState'
import { fetchSubscriptions, updateSubscriptionStatus, cancelSubscription } from '@/services/subscriptionService'
import { useAuthStore } from '@/store/authStore'
import { toast } from '@/store/notificationStore'
import { formatCurrency } from '@/utils/format'
import { usePageTitle } from '@/hooks/usePageTitle'

const STATUS_VARIANT = { active: 'success', paused: 'warning', cancelled: 'danger' }

function SubSkeleton() {
  return (
    <div className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-clinical flex-shrink-0" />
        <div className="space-y-2">
          <div className="h-4 bg-clinical rounded w-40" />
          <div className="h-3 bg-clinical rounded w-28" />
          <div className="h-3 bg-clinical rounded w-36" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-5 w-16 bg-clinical rounded-full" />
        <div className="h-5 w-24 bg-clinical rounded" />
        <div className="h-8 w-8 bg-clinical rounded-lg" />
        <div className="h-8 w-8 bg-clinical rounded-lg" />
      </div>
    </div>
  )
}

export function SubscriptionsPage() {
  usePageTitle('Subscriptions')
  const user = useAuthStore(s => s.user)

  const { data, isLoading } = useQuery({
    queryKey: ['subscriptions', user?.id],
    queryFn:  () => fetchSubscriptions(user?.id),
    enabled:  !!user?.id,
  })

  const [localStatus, setLocalStatus] = useState({})
  const [loadingId, setLoadingId]     = useState(null)

  const subs = (data?.data || []).map(s => ({
    ...s,
    status: localStatus[s.id] ?? s.status,
  }))

  const handleToggle = async (sub) => {
    if (loadingId) return
    const newStatus = sub.status === 'active' ? 'paused' : 'active'
    setLoadingId(sub.id)
    setLocalStatus(prev => ({ ...prev, [sub.id]: newStatus }))
    try {
      const { error } = await updateSubscriptionStatus(sub.id, newStatus)
      if (error) {
        setLocalStatus(prev => ({ ...prev, [sub.id]: sub.status }))
        toast.error('Failed to update subscription')
      } else {
        toast.success(`Subscription ${newStatus === 'active' ? 'resumed' : 'paused'}`)
      }
    } finally {
      setLoadingId(null)
    }
  }

  const handleCancel = async (sub) => {
    if (loadingId) return
    setLoadingId(sub.id)
    setLocalStatus(prev => ({ ...prev, [sub.id]: 'cancelled' }))
    try {
      const { error } = await cancelSubscription(sub.id)
      if (error) {
        setLocalStatus(prev => ({ ...prev, [sub.id]: sub.status }))
        toast.error('Failed to cancel subscription')
      } else {
        toast.success('Subscription cancelled')
      }
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Subscriptions</h1>
        <p className="text-muted text-sm mt-1">Auto-refill for your regular consumables</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <SubSkeleton key={i} />)}
        </div>
      ) : subs.length === 0 ? (
        <EmptyState icon={RefreshCw} title="No subscriptions yet" description="Subscribe to consumables to get automatic refills and save 10%." />
      ) : (
        <div className="space-y-4">
          {subs.map(sub => (
            <div key={sub.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-clinical flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{sub.product}</p>
                  <p className="text-xs text-muted capitalize">{sub.qty} units · {sub.frequency}</p>
                  {sub.next_delivery && sub.status !== 'cancelled' && (
                    <p className="text-xs text-muted mt-0.5">Next delivery: {sub.next_delivery}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={STATUS_VARIANT[sub.status]} className="capitalize">{sub.status}</Badge>
                <span className="text-sm font-bold text-primary">{formatCurrency(sub.price * sub.qty)}/delivery</span>
                {sub.status !== 'cancelled' && (
                  <>
                    <Button
                      size="icon"
                      variant="outline"
                      title={sub.status === 'active' ? 'Pause' : 'Resume'}
                      disabled={loadingId === sub.id}
                      onClick={() => handleToggle(sub)}
                    >
                      {sub.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      title="Cancel"
                      disabled={loadingId === sub.id}
                      onClick={() => handleCancel(sub)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
