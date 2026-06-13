import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatCurrency } from '@/utils/format'
import { usePageTitle } from '@/hooks/usePageTitle'

export function CartPage() {
  usePageTitle('Cart')
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping  = subtotal > 500 ? 0 : 50
  const total     = subtotal + shipping
  const totalQty  = items.reduce((s, i) => s + i.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="page-container py-8">
        <h1 className="section-title mb-8">{t('cart_page.title')}</h1>
        <EmptyState
          icon={ShoppingCart}
          title={t('cart.empty')}
          description={t('cart_page.browse_desc')}
          action={() => navigate('/products')}
          actionLabel={t('cart.browse')}
        />
      </div>
    )
  }

  return (
    <div className="page-container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">{t('cart_page.title')} ({items.length})</h1>
        <button onClick={clearCart} className="text-sm text-danger hover:underline">{t('cart_page.clear_all')}</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.id} className="card flex items-center gap-4">
              <div className="w-16 h-16 bg-clinical rounded-xl flex items-center justify-center flex-shrink-0 text-secondary/40">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{item.name}</p>
                <p className="text-xs text-muted capitalize">{item.category}</p>
                <p className="text-sm font-bold text-primary mt-1">{formatCurrency(item.price)} / {item.unit}</p>
              </div>
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1.5 hover:bg-clinical text-muted hover:text-ink transition-colors">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1.5 hover:bg-clinical text-muted hover:text-ink transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">{formatCurrency(item.price * item.quantity)}</p>
                <button onClick={() => removeItem(item.id)} className="text-danger hover:opacity-70 mt-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card h-fit">
          <h2 className="font-semibold text-primary mb-4">{t('cart_page.order_summary')}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted">
              <span>{t('cart.subtotal')} ({totalQty})</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>{t('cart.shipping')}</span>
              <span>{shipping === 0 ? <span className="text-success">{t('cart_page.free')}</span> : formatCurrency(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-muted">{t('cart_page.add_more_shipping', { amount: formatCurrency(500 - subtotal) })}</p>
            )}
          </div>
          <div className="border-t border-border mt-4 pt-4 flex justify-between font-semibold">
            <span>{t('cart.total')}</span>
            <span className="text-primary text-lg">{formatCurrency(total)}</span>
          </div>
          <Button className="w-full mt-6" onClick={() => navigate('/checkout')}>
            {t('cart_page.proceed_checkout')} <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="w-full mt-2" asChild>
            <Link to="/products">{t('cart_page.continue_shopping')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
