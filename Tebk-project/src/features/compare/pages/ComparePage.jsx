import { BarChart2, X } from 'lucide-react'
import { useCompareStore } from '@/store/compareStore'
import { useCartStore } from '@/store/cartStore'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { toast } from '@/store/notificationStore'
import { formatCurrency } from '@/utils/format'

const COMPARE_FIELDS = [
  { label: 'Price',     key: p => formatCurrency(p.price) },
  { label: 'Category',  key: p => p.category },
  { label: 'Unit',      key: p => p.unit },
  { label: 'In Stock',  key: p => p.stock > 0 ? '✓ Yes' : '✗ No' },
]

export function ComparePage() {
  const { items, removeItem, clear } = useCompareStore()
  const addToCart = useCartStore(s => s.addItem)

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="section-title">Compare Products</h1>
        <EmptyState icon={BarChart2} title="No products to compare" description="Add up to 4 products to compare side-by-side." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="section-title">Comparing {items.length} Products</h1>
        <Button variant="outline" size="sm" onClick={clear}>Clear all</Button>
      </div>

      <div className="card p-0 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase w-32">Feature</th>
              {items.map(p => (
                <th key={p.id} className="px-4 py-3 text-center min-w-[160px]">
                  <div className="relative">
                    <button onClick={() => removeItem(p.id)} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-border text-muted hover:bg-danger hover:text-white flex items-center justify-center transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                    <p className="text-xs font-semibold text-primary pr-4 text-left">{p.name}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {COMPARE_FIELDS.map(({ label, key }) => (
              <tr key={label} className="hover:bg-clinical transition-colors">
                <td className="px-4 py-3 text-xs font-semibold text-muted">{label}</td>
                {items.map(p => (
                  <td key={p.id} className="px-4 py-3 text-center text-sm font-medium text-ink">{key(p)}</td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="px-4 py-3 text-xs font-semibold text-muted">Action</td>
              {items.map(p => (
                <td key={p.id} className="px-4 py-3 text-center">
                  <Button size="sm" onClick={() => { addToCart(p); toast.success('Added to cart') }}>Add to Cart</Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
