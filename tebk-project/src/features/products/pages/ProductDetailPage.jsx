import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ShoppingCart, Heart, Package, ArrowLeft } from 'lucide-react'
import { fetchProductById, fetchProductVariants } from '@/services/productService'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { toast } from '@/store/notificationStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/utils/format'
import { cn } from '@/lib/utils'
import { cl } from '@/utils/cloudinary'
import { QuantitySelector } from '@/components/shared/QuantitySelector'

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [sizeWarning, setSizeWarning] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn:  () => fetchProductById(id),
  })

  const { data: variantsData } = useQuery({
    queryKey: ['product-variants', id],
    queryFn:  () => fetchProductVariants(id),
    enabled:  !!id,
    retry: 0,
  })
  const variants = variantsData?.data || []

  const addToCart  = useCartStore((s) => s.addItem)
  const { toggle, isWishlisted } = useWishlistStore()
  const product    = data?.data
  const wishlisted = product ? isWishlisted(product.id) : false
  const effectiveStock = selectedVariant?.stock ?? product?.stock ?? 0

  const displayedPrice = selectedVariant?.price ?? product?.price
  const displayedImage = selectedVariant?.image || product?.image_url

  if (isLoading) {
    return (
      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="page-container py-16 text-center">
        <p className="text-muted">Product not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (variants.length > 0 && !selectedVariant) {
      setSizeWarning(true)
      return
    }
    setSizeWarning(false)
    addToCart({ ...product, variantId: selectedVariant?.id, size: selectedVariant?.size }, qty)
    toast.success(`${qty}× ${product.name}${selectedVariant ? ` (${selectedVariant.size})` : ''} added to cart`)
  }

  return (
    <div className="page-container py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted hover:text-ink mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="bg-clinical rounded-2xl flex items-center justify-center aspect-square">
          {displayedImage ? (
            <img src={cl.combined(displayedImage, 800, 800)} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <Package className="w-32 h-32 text-secondary/30" />
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs text-muted uppercase tracking-wider mb-2">{product.category}</p>
          <h1 className="text-2xl font-display font-bold text-primary mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-primary">{formatCurrency(displayedPrice)}</span>
            <span className="text-sm text-muted">per {product.unit}</span>
            {product.stock < 20 && product.stock > 0 && <Badge variant="warning">Low Stock</Badge>}
            {product.stock === 0 && <Badge variant="danger">Out of Stock</Badge>}
          </div>

          <p className="text-sm text-muted leading-relaxed mb-6">{product.description}</p>

          {/* Variant size selector */}
          {variants.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-ink dark:text-slate-200 mb-3">
                Size {selectedVariant && <span className="text-secondary ml-1">— {selectedVariant.size}</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => {
                      const next = selectedVariant?.id === v.id ? null : v
                      setSelectedVariant(next)
                      setQty(q => Math.min(q, next?.stock ?? product.stock))
                      setSizeWarning(false)
                    }}
                    className={cn(
                      'min-w-[3rem] px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-150',
                      selectedVariant?.id === v.id
                        ? 'bg-secondary text-white border-secondary shadow-md ring-2 ring-secondary/30'
                        : 'bg-white border-border text-ink hover:border-secondary hover:text-secondary dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200'
                    )}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
              {sizeWarning && (
                <p className="text-xs text-danger mt-2">Please select a size before adding to cart.</p>
              )}
            </div>
          )}

          {/* Qty selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-ink">Quantity:</span>
            <QuantitySelector value={qty} onChange={setQty} stock={effectiveStock} />
            <span className="text-sm text-muted">= {formatCurrency(displayedPrice * qty)}</span>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" onClick={handleAddToCart} disabled={effectiveStock === 0}>
              <ShoppingCart className="w-4 h-4" />
              {effectiveStock === 0 ? 'نفذت الكمية' : 'Add to Cart'}
            </Button>
            <Button
              variant="outline"
              onClick={() => { toggle(product); toast.info(wishlisted ? 'Removed from wishlist' : 'Added to wishlist') }}
              className={cn(wishlisted && 'border-danger text-danger hover:bg-red-50')}
            >
              <Heart className={cn('w-4 h-4', wishlisted && 'fill-danger')} />
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted">
              <span className="font-medium text-ink">Stock:</span> {effectiveStock > 0 ? `${effectiveStock} units available` : 'Out of stock'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
