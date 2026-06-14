import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWishlistStore } from '@/store/wishlistStore'
import { ProductCard } from '@/components/shared/ProductCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { toast } from '@/store/notificationStore'

export function WishlistPage() {
  const { items, clear } = useWishlistStore()
  const navigate = useNavigate()

  const handleAddToCart = (product) => {
    toast.warning('Please select a size and quantity on the product page first.')
    navigate(`/products/${product.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Wishlist</h1>
          <p className="text-muted text-sm mt-1">{items.length} saved products</p>
        </div>
        {items.length > 0 && (
          <Button variant="outline" size="sm" onClick={clear}>Clear all</Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Heart} title="Your wishlist is empty" description="Save products you like by clicking the heart icon on any product." />
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
