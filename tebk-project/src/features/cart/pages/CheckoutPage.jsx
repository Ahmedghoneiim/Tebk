import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { createOrder, createPaymobCardPayment } from '@/services/orderService'
import { checkoutSchema } from '@/utils/validators'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/store/notificationStore'
import { formatCurrency } from '@/utils/format'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useTranslation } from '@/hooks/useTranslation'

export function CheckoutPage() {
  const { t }                = useTranslation()
  const { items, clearCart } = useCartStore()
  const { user }             = useAuthStore()
  const navigate             = useNavigate()
  const [loading, setLoading] = useState(false)

  usePageTitle('Checkout')
  useEffect(() => {
    if (items.length === 0) navigate('/cart', { replace: true })
  }, [items.length, navigate])

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal > 500 ? 0 : 50
  const total    = subtotal + shipping

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName:      user?.full_name    || '',
      email:         user?.email        || '',
      phone:         user?.phone        || '',
      address:       user?.address      || '',
      city:          user?.city         || '',
      paymentMethod: 'cash',
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    const { data: order, error } = await createOrder(user.id, { ...data, total }, items)
    if (error) {
      setLoading(false)
      toast.error(error.message || 'Failed to place order.')
      return
    }

    if (data.paymentMethod === 'card') {
      const { data: paymob, error: paymobError } = await createPaymobCardPayment(order.id)
      setLoading(false)
      if (paymobError) {
        console.error('Paymob error details:', paymobError.details)
        toast.error(paymobError.message || 'Could not start Paymob payment.')
        return
      }
      clearCart()
      window.location.assign(paymob.checkoutUrl) // Redirects user directly to Paymob Checkout
      return
    }

    setLoading(false)
    clearCart()
    navigate(`/order-success/${order?.id}`)
  }

  if (items.length === 0) return null

  return (
    <div className="page-container py-8">
      <h1 className="section-title mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
          {/* Shipping */}
          <div className="card">
            <h2 className="font-semibold text-primary mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-ink mb-1.5">Full Name</label>
                <Input placeholder="Dr. Ahmed Mohamed" {...register('fullName')} />
                {errors.fullName && <p className="text-xs text-danger mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
                <Input type="email" {...register('email')} />
                {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Phone <span className="text-xs font-normal text-muted">(+2)</span>
                </label>
                <Input placeholder="Enter your number" {...register('phone')} />
                {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-ink mb-1.5">Address</label>
                <Input placeholder="123 Medical District, Building 4" {...register('address')} />
                {errors.address && <p className="text-xs text-danger mt-1">{errors.address.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">City</label>
                <Input placeholder="Cairo" {...register('city')} />
                {errors.city && <p className="text-xs text-danger mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Notes <span className="text-muted">(optional)</span></label>
                <Input placeholder="Delivery instructions…" {...register('notes')} />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card">
            <h2 className="font-semibold text-primary mb-4">{t('checkout.payment_method')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { value: 'cash', label: t('checkout.cash_on_delivery'), desc: t('checkout.cash_desc') },
                { value: 'card', label: t('checkout.card_payment'),     desc: t('checkout.card_desc') },
              ].map(({ value, label, desc }) => (
                <label
                  key={value}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border cursor-pointer hover:bg-clinical transition-colors has-[:checked]:border-secondary has-[:checked]:bg-clinical"
                >
                  <input type="radio" value={value} className="mt-0.5" {...register('paymentMethod')} />
                  <div>
                    <p className="text-sm font-medium text-ink">{label}</p>
                    <p className="text-xs text-muted">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('checkout.placing')}</> : `${t('checkout.place_order')} — ${formatCurrency(total)}`}
          </Button>
        </form>

        {/* Summary */}
        <div className="card h-fit">
          <h2 className="font-semibold text-primary mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted truncate mr-2">{item.name} ×{item.quantity}</span>
                <span className="font-medium whitespace-nowrap">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-success">Free</span> : formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between font-semibold pt-1">
              <span>Total</span><span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
