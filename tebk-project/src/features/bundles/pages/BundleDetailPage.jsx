import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Package, ShoppingCart, ArrowLeft, CheckCircle, Tag, Layers } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { toast } from '@/store/notificationStore'
import { Button } from '@/components/ui/button'
import { fetchBundleById } from '@/services/bundleService'
import { formatCurrency } from '@/utils/format'
import { usePageTitle } from '@/hooks/usePageTitle'
import { cl } from '@/utils/cloudinary'

function BundleDetailSkeleton() {
  return (
    <div className="page-container py-8 animate-pulse">
      <div className="h-5 w-32 bg-clinical rounded mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="rounded-3xl bg-clinical" style={{ height: '460px' }} />
        <div className="space-y-4 pt-2">
          <div className="h-7 bg-clinical rounded-lg w-3/4" />
          <div className="h-4 bg-clinical rounded w-1/3" />
          <div className="h-3 bg-clinical rounded mt-4" />
          <div className="h-3 bg-clinical rounded w-5/6" />
          <div className="h-3 bg-clinical rounded w-4/6" />
          <div className="h-24 bg-clinical rounded-2xl mt-6" />
          <div className="h-12 bg-clinical rounded-xl mt-4" />
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
    if (bundle.items && bundle.items.length > 0) {
      bundle.items.forEach(item => {
        addToCart({ id: item.product_id, name: item.name, price: item.price, category: 'bundle', unit: 'item' }, item.quantity)
      })
    } else {
      addToCart({ id: `bundle-${bundle.id}`, name: bundle.name, price: bundle.bundle_price, category: 'bundle', unit: 'bundle' }, 1)
    }
    toast.success(`${bundle.name} added to cart!`)
  }

  const savings = bundle.original_price ? bundle.original_price - bundle.bundle_price : null

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(140deg, #CBEDFC 0%, #daeffe 55%, #C1E3C4 100%)' }}>
      <div className="page-container py-8">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium mb-8 transition-colors hover:text-secondary"
          style={{ color: '#1a3363' }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Bundles
        </button>

        {/* ── Main: image LEFT + info RIGHT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">

          {/* Image */}
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{ height: '460px', boxShadow: '0 8px 40px rgba(33,51,96,0.13)' }}
          >
            {bundle.image_url ? (
              <img
                src={cl.combined(bundle.image_url, 900, 920)}
                alt={bundle.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #c8edf5, #b5e8e0)' }}
              >
                <Package className="w-24 h-24" style={{ color: '#4ea055', opacity: 0.35 }} />
              </div>
            )}

            {/* Save badge */}
            {bundle.savings_pct && (
              <div
                className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg"
                style={{ background: '#C1E3C4', color: '#1a3363' }}
              >
                <Tag className="w-3.5 h-3.5" />
                Save {bundle.savings_pct}%
              </div>
            )}
          </div>

          {/* Info panel */}
          <div className="flex flex-col justify-between py-2">
            <div>
              {/* Category pill */}
              {bundle.category && (
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4"
                  style={{ background: 'rgba(193,227,196,0.12)', color: '#4ea055' }}
                >
                  <Layers className="w-3 h-3" />
                  {bundle.category} clinic bundle
                </span>
              )}

              <h1 className="text-3xl font-display font-bold leading-tight mb-3" style={{ color: '#1a3363' }}>
                {bundle.name}
              </h1>

              <p className="text-gray-500 leading-relaxed mb-6">{bundle.description}</p>

              {/* Items preview */}
              {bundle.items && bundle.items.length > 0 && (
                <div
                  className="rounded-2xl p-4 mb-6"
                  style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.9)' }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#1a3363' }}>
                    Included Products
                  </p>
                  <ul className="space-y-2">
                    {bundle.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#4ea055' }} />
                        <span className="text-gray-600 flex-1">{item.name}</span>
                        <span className="font-semibold text-gray-500">×{item.quantity}</span>
                        <span className="text-gray-400 text-xs">{formatCurrency(item.price)}/unit</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Pricing + CTA */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.9)' }}
            >
              <div className="space-y-1.5 mb-4 text-sm">
                {bundle.original_price && (
                  <div className="flex justify-between text-gray-400">
                    <span>Individual price</span>
                    <span className="line-through">{formatCurrency(bundle.original_price)}</span>
                  </div>
                )}
                {savings && (
                  <div className="flex justify-between font-medium" style={{ color: '#4ea055' }}>
                    <span>Bundle discount</span>
                    <span>−{formatCurrency(savings)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xl pt-2 border-t border-gray-100" style={{ color: '#1a3363' }}>
                  <span>Bundle price</span>
                  <span>{formatCurrency(bundle.bundle_price)}</span>
                </div>
              </div>

              <button
                onClick={handleAddBundle}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
                style={{ background: '#1a3363' }}
              >
                <ShoppingCart className="w-5 h-5" />
                Add Bundle to Cart
              </button>

              <p className="text-center text-xs text-gray-400 mt-3">
                Prices locked for 30 days · Contact your account manager for bulk orders
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
