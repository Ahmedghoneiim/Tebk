import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWishlistStore } from '@/store/wishlistStore'
import { ProductCard } from '@/components/shared/ProductCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { toast } from '@/store/notificationStore'
import { useTranslation } from '@/hooks/useTranslation'

export function WishlistPage() {
  const { t } = useTranslation()
  const { items, clear } = useWishlistStore()
  const navigate = useNavigate()

  const handleAddToCart = (product) => {
    toast.warning(t('wishlist.toast_size'))
    navigate(`/products/${product.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">{t('wishlist.title')}</h1>
          <p className="text-muted text-sm mt-1">{t('wishlist.saved').replace('{count}', items.length)}</p>
        </div>
        {items.length > 0 && (
          <Button variant="outline" size="sm" onClick={clear}>{t('wishlist.clear_all')}</Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Heart} title={t('wishlist.empty')} description={t('wishlist.empty_desc')} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </div>
  )
}
