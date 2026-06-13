import { useState } from 'react'
import { Plus, Search, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/EmptyState'
import { MOCK_PRODUCTS } from '@/utils/mockData'
import { formatCurrency } from '@/utils/format'

export function AdminProducts() {
  const [search, setSearch] = useState('')
  const products = MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Products</h1>
          <p className="text-muted text-sm mt-1">{products.length} products in catalog</p>
        </div>
        <Button><Plus className="w-4 h-4" /> Add Product</Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" className="pl-10" />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                {['Product', 'Category', 'Price', 'Stock', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon={Package} title="No products found" /></td></tr>
              ) : products.map(p => (
                <tr key={p.id} className="hover:bg-clinical transition-colors">
                  <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                  <td className="px-4 py-3 text-muted capitalize">{p.category}</td>
                  <td className="px-4 py-3 font-semibold text-primary">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-3 text-muted">{p.stock}</td>
                  <td className="px-4 py-3">
                    {p.stock === 0
                      ? <Badge variant="danger">Out of Stock</Badge>
                      : p.stock < 20
                        ? <Badge variant="warning">Low Stock</Badge>
                        : <Badge variant="success">In Stock</Badge>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-secondary text-xs hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
