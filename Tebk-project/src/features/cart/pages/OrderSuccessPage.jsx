import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, Package, ArrowRight, XCircle, Loader2, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { fetchOrderById, createPaymobCardPayment } from '@/services/orderService'
import { toast } from '@/store/notificationStore'

export function OrderSuccessPage() {
  const { orderId } = useParams()
  const { user } = useAuthStore()
  const [retryLoading, setRetryLoading] = useState(false)

  const { data: order, isLoading } = useQuery({
    queryKey: ['orderSuccess', orderId, user?.id],
    queryFn: async () => {
      const { data, error } = await fetchOrderById(orderId, user.id)
      if (error) throw error
      return data
    },
    enabled: !!orderId && !!user?.id,
    refetchInterval: (query) => {
      const data = query.state.data
      // Poll every 2 seconds if the payment is card and status is pending
      return data?.payment_method === 'card' && data?.payment_status === 'pending' ? 2000 : false
    },
  })

  const handleRetryPayment = async () => {
    if (!orderId) return
    setRetryLoading(true)
    const { data: paymob, error: paymobError } = await createPaymobCardPayment(orderId)
    setRetryLoading(false)
    if (paymobError) {
      console.error('Paymob error details:', paymobError.details)
      toast.error(paymobError.message || 'Could not start Paymob payment.')
      return
    }
    window.location.assign(paymob.checkoutUrl)
  }

  if (!orderId) return null

  if (isLoading) {
    return (
      <div className="page-container py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-secondary animate-spin mb-4" />
        <p className="text-muted text-sm">Loading order details…</p>
      </div>
    )
  }

  const isCard = order?.payment_method === 'card'
  const isPending = order?.payment_status === 'pending'
  const isFailed = order?.payment_status === 'failed'

  // 1. Payment Processing (Pending state for Card payments)
  if (isCard && isPending) {
    return (
      <div className="page-container py-16">
        <div className="max-w-md mx-auto text-center card p-8 space-y-6 shadow-md border-border">
          <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto animate-pulse">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-primary mb-2">Verifying Payment</h1>
            <p className="text-muted leading-relaxed text-sm">
              We are waiting for payment confirmation from Paymob. This will update automatically.
            </p>
            <p className="text-xs text-danger font-medium mt-2">
              Please do not close or refresh this page.
            </p>
          </div>
          <div className="pt-2">
            <p className="text-xs text-muted font-mono bg-clinical px-3 py-1.5 rounded-lg inline-block">
              Ref: #{orderId.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // 2. Payment Failed State
  if (isCard && isFailed) {
    return (
      <div className="page-container py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-danger" />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary mb-3">Payment Failed</h1>
          <p className="text-muted leading-relaxed mb-6">
            We couldn't process your card payment successfully. Please check your card info or try again.
          </p>
          
          <div className="pt-2 mb-8">
            <p className="text-xs text-muted font-mono bg-clinical px-3 py-1.5 rounded-lg inline-block">
              Order reference: #{orderId.slice(0, 8).toUpperCase()}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={handleRetryPayment} disabled={retryLoading} className="flex-1 w-full gap-2 justify-center">
              {retryLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              Retry Card Payment
            </Button>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" asChild className="flex-1">
                <Link to="/orders">View Orders</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 3. Normal Success / Completed State (COD or Paid Card)
  return (
    <div className="page-container py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h1 className="text-3xl font-display font-bold text-primary mb-3">Order Placed!</h1>
        <p className="text-muted leading-relaxed mb-2">
          {order?.payment_status === 'paid'
            ? 'Thank you for your order and successful payment. We\'ll process it and send a confirmation to your email.'
            : 'Thank you for your order. We\'ll process it and send a confirmation to your email.'
          }
        </p>
        <p className="text-sm text-muted mb-8">
          Order reference: <span className="font-mono font-medium text-ink">#{orderId.slice(0, 8).toUpperCase()}</span>
        </p>

        <div className="card mb-6">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-clinical flex items-center justify-center">
              <Package className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Expected delivery</p>
              <p className="text-xs text-muted">Within 24–48 hours after confirmation</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1">
            <Link to="/orders">View My Orders <ArrowRight className="w-4 h-4" /></Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
