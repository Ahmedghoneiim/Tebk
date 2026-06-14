import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Package, ShoppingCart, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { toast } from '@/store/notificationStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { fetchBundles } from '@/services/bundleService'
import { formatCurrency } from '@/utils/format'
import { usePageTitle } from '@/hooks/usePageTitle'

function BundleSkeleton() {
  return (
    <div className="card flex flex-col animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-clinical flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-clinical rounded w-3/4" />
          <div className="h-3 bg-clinical rounded w-1/3" />
        </div>
        <div className="h-5 w-16 bg-clinical rounded-full" />
      </div>
      <div className="space-y-1.5 mb-4">
        <div className="h-3 bg-clinical rounded" />
        <div className="h-3 bg-clinical rounded w-5/6" />
      </div>
      <div className="bg-clinical rounded-xl p-3 mb-4 space-y-2">
        {[1, 2, 3].map(i => <div key={i} className="h-3 bg-white/60 rounded" />)}
      </div>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
        <div className="h-6 w-24 bg-clinical rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-clinical rounded-lg" />
          <div className="h-8 w-16 bg-clinical rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function BundlesPage() {
  usePageTitle('Smart Bundles')
  const addToCart = useCartStore(s => s.addItem)

  const { data, isLoading } = useQuery({
    queryKey: ['bundles'],
    queryFn:  fetchBundles,
  })
  const bundles = data?.data || []

  const handleAddBundle = (bundle) => {
    bundle.items.forEach(item => {
      addToCart({ id: item.product_id, name: item.name, price: item.price, category: 'bundle', unit: 'item' }, item.quantity)
    })
    toast.success(`${bundle.name} added to cart!`)
  }

  return (
    <div className="page-container py-8">
      <div className="mb-8">
        <h1 className="section-title">Smart Bundles</h1>
        <p className="text-muted text-sm mt-1">Pre-built supply kits — save up to 22% vs buying individually</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <BundleSkeleton key={i} />)
          : bundles.map(bundle => (
            <div key={bundle.id} className="card flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-clinical flex items-center justify-center mr-3 flex-shrink-0">
                  <Package className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary">{bundle.name}</h3>
                  <p className="text-xs text-muted mt-0.5 capitalize">{bundle.category} clinic</p>
                </div>
                <Badge variant="success">Save {bundle.savings_pct}%</Badge>
              </div>

              <p className="text-sm text-muted mb-4">{bundle.description}</p>

              <div className="bg-clinical rounded-xl p-3 mb-4">
                <p className="text-xs font-semibold text-muted uppercase mb-2">Included Products</p>
                <ul className="space-y-1">
                  {bundle.items.slice(0, 4).map((item, i) => (
                    <li key={i} className="flex justify-between text-xs">
                      <span className="text-ink">{item.name}</span>
                      <span className="text-muted">×{item.quantity}</span>
                    </li>
                  ))}
                  {bundle.items.length > 4 && (
                    <li className="text-xs text-muted">+{bundle.items.length - 4} more items</li>
                  )}
                </ul>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                <div>
                  <span className="text-xs text-muted line-through mr-2">{formatCurrency(bundle.original_price)}</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(bundle.bundle_price)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/bundles/${bundle.id}`}>Details <ArrowRight className="w-3.5 h-3.5" /></Link>
                  </Button>
                  <Button size="sm" onClick={() => handleAddBundle(bundle)}>
                    <ShoppingCart className="w-4 h-4" /> Add
                  </Button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
