import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import { QuantitySelector } from '@/components/shared/QuantitySelector'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatCurrency } from '@/utils/format'
import { usePageTitle } from '@/hooks/usePageTitle'

export function CartPage() {
  usePageTitle('Cart')
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()
  const navigate = useNavigate()

  const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping  = subtotal > 500 ? 0 : 50
  const total     = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="page-container py-8">
        <h1 className="section-title mb-8">Shopping Cart</h1>
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Browse our catalog and add products to your cart."
          action={() => navigate('/products')}
          actionLabel="Browse Products"
        />
      </div>
    )
  }

  return (
    <div className="page-container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Shopping Cart ({items.length} items)</h1>
        <button onClick={clearCart} className="text-sm text-danger hover:underline">Clear all</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={`${item.id}-${item.variantId || ''}`} className="card flex items-center gap-4">
              <div className="w-16 h-16 bg-clinical rounded-xl flex items-center justify-center flex-shrink-0 text-secondary/40">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{item.name}{item.size ? ` — ${item.size}` : ''}</p>
                <p className="text-xs text-muted capitalize">{item.category}</p>
                <p className="text-sm font-bold text-primary mt-1">{formatCurrency(item.price)} / {item.unit}</p>
              </div>
              <QuantitySelector
                value={item.quantity}
                onChange={(qty) => updateQuantity(item.id, qty, item.variantId)}
                stock={item.stock ?? 100}
              />
              <div className="text-right">
                <p className="text-sm font-bold text-primary">{formatCurrency(item.price * item.quantity)}</p>
                <button onClick={() => removeItem(item.id, item.variantId)} className="text-danger hover:opacity-70 mt-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card h-fit">
          <h2 className="font-semibold text-primary mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-success">Free</span> : formatCurrency(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-muted">Add {formatCurrency(500 - subtotal)} more for free shipping</p>
            )}
          </div>
          <div className="border-t border-border mt-4 pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-primary text-lg">{formatCurrency(total)}</span>
          </div>
          <Button className="w-full mt-6" onClick={() => navigate('/checkout')}>
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="w-full mt-2" asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
