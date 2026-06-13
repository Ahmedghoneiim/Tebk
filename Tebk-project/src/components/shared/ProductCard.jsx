import { Heart, ShoppingCart, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useTranslation } from '@/hooks/useTranslation'
import { toast } from '@/store/notificationStore'
import { formatCurrency } from '@/utils/format'
import { cn } from '@/lib/utils'

// Warm stage backgrounds — vary by product name for consistent variety
const STAGE_COLORS = [
  '#FFD8BE', // peach-stage  (warm apricot — primary default)
  '#E8F5E9', // soft mint
  '#E0F2FE', // skySoft-capsule sky blue
  '#F5F0FF', // soft lavender
  '#FFEFE6', // peach-light blush
  '#E0F7FA', // teal mist
]

function getStageColor(name = '') {
  const code = [...name].reduce((a, c) => a + c.charCodeAt(0), 0)
  return STAGE_COLORS[code % STAGE_COLORS.length]
}

export function ProductCard({ product, onAddToCart }) {
  const addToCart              = useCartStore((s) => s.addItem)
  const { toggle, isWishlisted } = useWishlistStore()
  const { t }                  = useTranslation()
  const wishlisted             = isWishlisted(product.id)

  const isOutOfStock = product.stock === 0
  const isLowStock   = product.stock > 0 && product.stock < 20
  const isNew        = product.featured

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (onAddToCart) { onAddToCart(product) }
    else { addToCart(product); toast.success(`${product.name} — ${t('product.added_cart')}`) }
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggle(product)
    toast.info(wishlisted ? t('product.removed_wishlist') : t('product.added_wishlist'))
  }

  const bg = getStageColor(product.name)

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-card border border-border/40 dark:border-slate-700 overflow-hidden hover:shadow-modal transition-shadow duration-300">

        {/* ── Image Stage ── */}
        <div
          className="relative h-44"
          style={{ backgroundColor: bg }}
        >
          {/* Top-left badge */}
          {isOutOfStock ? (
            <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-danger/15 text-danger text-[11px] font-semibold">
              {t('common.out_of_stock')}
            </span>
          ) : isLowStock ? (
            <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[11px] font-semibold">
              {t('common.low_stock')}
            </span>
          ) : isNew ? (
            <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-secondary/20 text-secondary dark:bg-secondary/10 text-[11px] font-semibold">
              {t('product.new')}
            </span>
          ) : null}

          {/* Top-right: Heart — always visible */}
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? t('product.removed_wishlist') : t('product.added_wishlist')}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/75 dark:bg-slate-700/80 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <Heart className={cn('w-4 h-4 transition-colors', wishlisted ? 'fill-danger text-danger' : 'text-muted')} />
          </button>

          {/* Product image — floats down into info area */}
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-36 object-contain drop-shadow-xl translate-y-8 group-hover:translate-y-6 transition-transform duration-300 z-10"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-20 h-20 text-secondary/40" />
            </div>
          )}
        </div>

        {/* ── Info area ── */}
        <div className="px-4 pt-14 pb-4">
          <p className="text-[11px] text-muted capitalize mb-1 truncate">{product.category}</p>

          <h3 className="text-sm font-bold text-ink dark:text-slate-100 line-clamp-2 leading-snug mb-3 group-hover:text-primary dark:group-hover:text-secondary transition-colors">
            {product.name}
          </h3>

          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-[11px] text-muted leading-none mb-0.5">{t('product.price_label')}</p>
              <p className="text-base font-bold text-ink dark:text-white leading-none">
                {formatCurrency(product.price)}
                <span className="text-xs text-muted font-normal ml-1">/{product.unit}</span>
              </p>
            </div>

            {/* Solid cart button — always visible */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-label={t('common.add_to_cart')}
              className="w-10 h-10 rounded-xl bg-primary dark:bg-secondary text-white dark:text-slate-900 flex items-center justify-center shadow-soft hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
