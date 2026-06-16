import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Package, ShoppingCart, ArrowRight, Sparkles, CheckCircle } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { toast } from '@/store/notificationStore'
import { Button } from '@/components/ui/button'
import { fetchBundles } from '@/services/bundleService'
import { formatCurrency } from '@/utils/format'
import { usePageTitle } from '@/hooks/usePageTitle'
import { cl } from '@/utils/cloudinary'

function BundleSkeleton() {
  return (
    <div
      className="rounded-3xl overflow-hidden animate-pulse"
      style={{ background: 'rgba(255,255,255,0.62)', border: '1px solid rgba(255,255,255,0.85)' }}
    >
      <div className="w-full h-52 bg-slate-100" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-slate-100 rounded-lg w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="h-7 w-28 bg-slate-100 rounded-lg" />
          <div className="flex gap-2">
            <div className="h-9 w-20 bg-slate-100 rounded-xl" />
            <div className="h-9 w-28 bg-slate-100 rounded-xl" />
          </div>
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
    if (bundle.items && bundle.items.length > 0) {
      bundle.items.forEach(item => {
        addToCart({ id: item.product_id, name: item.name, price: item.price, category: 'bundle', unit: 'item' }, item.quantity)
      })
    } else {
      addToCart({ id: `bundle-${bundle.id}`, name: bundle.name, price: bundle.bundle_price, category: 'bundle', unit: 'bundle' }, 1)
    }
    toast.success(`${bundle.name} added to cart!`)
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(140deg, #CBEDFC 0%, #daeffe 55%, #C1E3C4 100%)' }}
    >
      <div className="page-container py-10">

        {/* Header */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-sm font-medium mb-5"
            style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 2px 14px rgba(33,51,96,0.07)', color: '#555' }}
          >
            <Sparkles className="w-4 h-4" style={{ color: '#4ea055' }} />
            Pre-built supply kits — save up to 22% vs buying individually
          </div>
          <h1 className="text-3xl font-display font-bold" style={{ color: '#1a3363' }}>Smart Bundles</h1>
          <p className="text-gray-400 text-sm mt-1">Choose a ready-made bundle and add everything to cart in one click</p>
        </div>

        {/* Bundle grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <BundleSkeleton key={i} />)
            : bundles.map(bundle => (
              <div
                key={bundle.id}
                className="rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative group flex flex-col"
                style={{
                  background: 'rgba(255,255,255,0.62)',
                  backdropFilter: 'blur(14px)',
                  border: '1px solid rgba(255,255,255,0.85)',
                  boxShadow: '0 4px 28px rgba(33,51,96,0.09)',
                }}
              >
                {/* Sparkle corner decoration */}
                <div className="absolute bottom-20 right-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                  <Sparkles className="w-6 h-6" style={{ color: '#4ea055' }} />
                </div>

                {/* TOP — image full width */}
                <div className="w-full h-52 relative overflow-hidden shrink-0">
                  {bundle.image_url ? (
                    <img
                      src={cl.combined(bundle.image_url, 900, 420)}
                      alt={bundle.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #c8edf5, #b5e8e0)' }}
                    >
                      <Package className="w-16 h-16" style={{ color: '#4ea055', opacity: 0.4 }} />
                    </div>
                  )}

                  {/* Save badge */}
                  {bundle.savings_pct && (
                    <div
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow"
                      style={{ background: '#C1E3C4', color: '#1a3363' }}>
                      Save {bundle.savings_pct}%
                    </div>
                  )}
                </div>

                {/* BOTTOM — content */}
                <div className="flex flex-col flex-1 p-6">
                  {/* Title + category */}
                  <div className="mb-2">
                    <h3 className="text-lg font-bold leading-snug" style={{ color: '#1a3363' }}>
                      {bundle.name}
                    </h3>
                    {bundle.category && (
                      <span className="text-xs font-medium capitalize" style={{ color: '#4ea055' }}>
                        {bundle.category} clinic
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{bundle.description}</p>

                  {/* Items list */}
                  {bundle.items && bundle.items.length > 0 ? (
                    <ul className="space-y-1 mb-2">
                      {bundle.items.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
                          <CheckCircle className="w-3 h-3 shrink-0" style={{ color: '#4ea055' }} />
                          <span>{item.name}</span>
                          <span className="ml-auto font-medium text-gray-500">×{item.quantity}</span>
                        </li>
                      ))}
                      {bundle.items.length > 3 && (
                        <li className="text-xs text-gray-400 pl-4">+{bundle.items.length - 3} more products</li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-400 italic mb-2">Details available on request</p>
                  )}

                  {/* Price + Actions */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                      {bundle.original_price && (
                        <span className="text-xs text-gray-400 line-through">{formatCurrency(bundle.original_price)}</span>
                      )}
                      <span className="text-xl font-bold" style={{ color: '#1a3363' }}>
                        {formatCurrency(bundle.bundle_price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/bundles/${bundle.id}`}
                        className="text-sm font-semibold transition-colors hover:underline"
                        style={{ color: '#17C3CE' }}
                      >
                        Details →
                      </Link>
                      <button
                        onClick={() => handleAddBundle(bundle)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-105"
                        style={{ background: '#17C3CE' }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
