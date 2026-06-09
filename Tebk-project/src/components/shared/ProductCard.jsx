import { Heart, ShoppingCart, BarChart2, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCompareStore } from '@/store/compareStore'
import { toast } from '@/store/notificationStore'
import { formatCurrency } from '@/utils/format'
import { cn } from '@/lib/utils'
import { cl } from '@/utils/cloudinary'

export function ProductCard({ product, onAddToCart }) {
  const addToCart      = useCartStore((s) => s.addItem)
  const { toggle, isWishlisted } = useWishlistStore()
  const { addItem: addCompare, isCompared } = useCompareStore()
  const wishlisted = isWishlisted(product.id)
  const compared   = isCompared(product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (onAddToCart) {
      onAddToCart(product)
    } else {
      addToCart(product)
      toast.success(`${product.name} added to cart`)
    }
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggle(product)
    toast.info(wishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const handleCompare = (e) => {
    e.preventDefault()
    addCompare(product)
    toast.info('Added to compare')
  }

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="card p-0 overflow-hidden hover:shadow-card transition-shadow duration-300">
        <div className="relative bg-clinical dark:bg-slate-700 h-44 flex items-center justify-center">
          {product.image_url ? (
            <img src={cl.combined(product.image_url, 400, 400)} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <Package className="w-16 h-16 text-secondary/40" />
          )}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleWishlist}
              className={cn('w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-soft flex items-center justify-center hover:bg-clinical dark:hover:bg-slate-700 transition-colors', wishlisted && 'text-danger')}
            >
              <Heart className={cn('w-4 h-4', wishlisted ? 'fill-danger text-danger' : 'text-muted')} />
            </button>
            <button
              onClick={handleCompare}
              className={cn('w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-soft flex items-center justify-center hover:bg-clinical dark:hover:bg-slate-700 transition-colors', compared && 'text-secondary')}
            >
              <BarChart2 className="w-4 h-4 text-muted" />
            </button>
          </div>
          {product.stock < 20 && product.stock > 0 && (
            <Badge variant="warning" className="absolute bottom-2 left-2">Low Stock</Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="danger" className="absolute bottom-2 left-2">Out of Stock</Badge>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs text-muted capitalize mb-1">{product.category}</p>
          <h3 className="text-sm font-semibold text-ink line-clamp-2 leading-snug mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-base font-bold text-primary">{formatCurrency(product.price)}</span>
              <span className="text-xs text-muted ml-1">/{product.unit}</span>
            </div>
            <Button size="icon" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
