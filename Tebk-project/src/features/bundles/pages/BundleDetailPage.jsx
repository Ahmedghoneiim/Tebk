import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Package, ShoppingCart, ArrowLeft, CheckCircle } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { toast } from '@/store/notificationStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { fetchBundleById } from '@/services/bundleService'
import { MOCK_PRODUCTS } from '@/utils/mockData'
import { formatCurrency } from '@/utils/format'
import { usePageTitle } from '@/hooks/usePageTitle'

function BundleDetailSkeleton() {
  return (
    <div className="page-container py-8 animate-pulse">
      <div className="h-5 w-32 bg-clinical rounded mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-clinical flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-clinical rounded w-2/3" />
                <div className="h-4 bg-clinical rounded w-1/3" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-clinical rounded" />
              <div className="h-3 bg-clinical rounded w-5/6" />
            </div>
          </div>
          <div className="card space-y-3">
            <div className="h-5 bg-clinical rounded w-1/4 mb-4" />
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-clinical">
                <div className="w-5 h-5 rounded-full bg-white/60 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-white/60 rounded w-3/4" />
                  <div className="h-2 bg-white/60 rounded w-1/2" />
                </div>
                <div className="space-y-1 text-right">
                  <div className="h-3 bg-white/60 rounded w-8" />
                  <div className="h-2 bg-white/60 rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="card space-y-3">
            <div className="h-5 bg-clinical rounded w-1/3 mb-4" />
            <div className="h-4 bg-clinical rounded" />
            <div className="h-4 bg-clinical rounded" />
            <div className="h-4 bg-clinical rounded" />
            <div className="h-10 bg-clinical rounded-lg mt-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function BundleDetailPage() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const addToCart = useCartStore(s => s.addItem)

  const { data, isLoading } = useQuery({
    queryKey: ['bundle', id],
    queryFn:  () => fetchBundleById(id),
  })
  const bundle = data?.data

  usePageTitle(bundle?.name || 'Bundle')

  if (isLoading) return <BundleDetailSkeleton />

  if (!bundle) {
    return (
      <div className="page-container py-16 text-center">
        <p className="text-muted mb-4">Bundle not found.</p>
        <Button variant="outline" onClick={() => navigate('/bundles')}>Back to Bundles</Button>
      </div>
    )
  }

  const handleAddBundle = () => {
    bundle.items.forEach(item => {
      addToCart({ id: item.product_id, name: item.name, price: item.price, category: 'bundle', unit: 'item' }, item.quantity)
    })
    toast.success(`${bundle.name} added to cart!`)
  }

  const savings = bundle.original_price - bundle.bundle_price

  return (
    <div className="page-container py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted hover:text-ink text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Bundles
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-clinical flex items-center justify-center flex-shrink-0">
                <Package className="w-7 h-7 text-secondary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl font-display font-bold text-primary">{bundle.name}</h1>
                  <Badge variant="success">Save {bundle.savings_pct}%</Badge>
                </div>
                <p className="text-sm text-muted capitalize">{bundle.category} clinic bundle</p>
              </div>
            </div>
            <p className="text-muted leading-relaxed">{bundle.description}</p>
          </div>

          <div className="card">
            <h2 className="font-semibold text-primary mb-4">What's Included</h2>
            <div className="space-y-3">
              {bundle.items.map((item, i) => {
                const product = MOCK_PRODUCTS.find(p => p.id === item.product_id)
                return (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-clinical">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                      {product?.description && (
                        <p className="text-xs text-muted truncate">{product.description}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-primary">×{item.quantity}</p>
                      <p className="text-xs text-muted">{formatCurrency(item.price)} / unit</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h2 className="font-semibold text-primary mb-4">Pricing</h2>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-muted">
                <span>Individual price</span>
                <span className="line-through">{formatCurrency(bundle.original_price)}</span>
              </div>
              <div className="flex justify-between text-success font-medium">
                <span>Bundle discount</span>
                <span>−{formatCurrency(savings)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold text-primary text-lg">
                <span>Bundle price</span>
                <span>{formatCurrency(bundle.bundle_price)}</span>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={handleAddBundle}>
              <ShoppingCart className="w-4 h-4" /> Add Bundle to Cart
            </Button>
          </div>

          <div className="card">
            <p className="text-xs text-muted leading-relaxed">
              Bundle prices are locked in for 30 days. Individual item availability may vary. Contact your account manager for custom bundles above 10 units.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
