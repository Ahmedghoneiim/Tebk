import { Heart, ShoppingCart, BarChart2, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCompareStore } from '@/store/compareStore'
import { toast } from '@/store/notificationStore'
import { formatCurrency } from '@/utils/format'
import { cn } from '@/lib/utils'
import { cl } from '@/utils/cloudinary'

export function ProductCard({ product, onAddToCart }) {
  const addToCart = useCartStore((s) => s.addItem)
  const { toggle, isWishlisted } = useWishlistStore()
  const { addItem: addCompare, isCompared } = useCompareStore()
  const wishlisted = isWishlisted(product.id)
  const compared   = isCompared(product.id)

  const isNew = product.created_at
    ? (Date.now() - new Date(product.created_at).getTime()) < 30 * 24 * 60 * 60 * 1000
    : false

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
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">

        {/* Image Section */}
        <div className="relative h-52 flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #f5a623 0%, #f8c84a 100%)' }}>
          {product.image_url ? (
            <img
              src={cl.combined(product.image_url, 400, 400)}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Package className="w-16 h-16 text-white/60" />
          )}

          {/* New badge */}
          {isNew && (
            <span className="absolute top-3 left-3 bg-teal-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              New
            </span>
          )}

          {/* Heart button — always visible */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/85 dark:bg-slate-800/85 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Heart className={cn('w-4 h-4', wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400')} />
          </button>

          {/* Compare button — appears on hover */}
          <button
            onClick={handleCompare}
            className={cn(
              'absolute top-14 right-3 w-9 h-9 rounded-full bg-white/85 dark:bg-slate-800/85 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm',
              'opacity-0 group-hover:opacity-100'
            )}
          >
            <BarChart2 className={cn('w-4 h-4', compared ? 'text-secondary' : 'text-gray-400')} />
          </button>

          {/* Stock badges */}
          {product.stock === 0 && (
            <span className="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              Out of Stock
            </span>
          )}
          {product.stock > 0 && product.stock < 20 && (
            <span className="absolute bottom-3 left-3 bg-orange-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              Low Stock
            </span>
          )}
        </div>

        {/* Info Section */}
        <div className="p-4">
          <p className="text-xs text-gray-400 dark:text-slate-500 capitalize mb-0.5">{product.category}</p>
          <h3 className="text-sm font-bold text-gray-800 dark:text-white line-clamp-2 leading-snug mb-3 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mb-0.5">Price</p>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(product.price)}
              </span>
              {product.unit && (
                <span className="text-xs text-gray-400 dark:text-slate-500 ml-1">/{product.unit}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-10 h-10 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-sm"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
