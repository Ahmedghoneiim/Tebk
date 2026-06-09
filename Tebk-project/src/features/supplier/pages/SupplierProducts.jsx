import { useState } from 'react'
import { Plus, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { MOCK_PRODUCTS } from '@/utils/mockData'
import { formatCurrency } from '@/utils/format'
import { usePageTitle } from '@/hooks/usePageTitle'
import { toast } from '@/store/notificationStore'

function stockVariant(stock) {
  if (stock === 0)  return 'danger'
  if (stock < 20)   return 'warning'
  return 'success'
}

function stockLabel(stock) {
  if (stock === 0) return 'Out of Stock'
  if (stock < 20)  return 'Low Stock'
  return 'In Stock'
}

export function SupplierProducts() {
  usePageTitle('My Products')

  const [products, setProducts] = useState(MOCK_PRODUCTS.slice(0, 6))
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})

  const startEdit = (p) => {
    setEditingId(p.id)
    setEditValues({ price: p.price, stock: p.stock })
  }

  const cancelEdit = () => setEditingId(null)

  const saveEdit = (id) => {
    const price = Number(editValues.price)
    const stock = Number(editValues.stock)
    if (isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) {
      toast.error('Invalid price or stock value')
      return
    }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, price, stock } : p))
    setEditingId(null)
    toast.success('Listing updated')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">My Products</h1>
          <p className="text-muted text-sm mt-1">{products.length} listings managed</p>
        </div>
        <Button><Plus className="w-4 h-4" /> Add Product</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => {
          const isEditing = editingId === p.id
          return (
            <div key={p.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-ink flex-1 mr-2">{p.name}</h3>
                <Badge variant={stockVariant(p.stock)}>{stockLabel(p.stock)}</Badge>
              </div>
              <p className="text-xs text-muted capitalize mb-3">{p.category}</p>

              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-muted mb-1 block">Price (EGP)</label>
                      <Input
                        type="number"
                        min="0"
                        value={editValues.price}
                        onChange={e => setEditValues(v => ({ ...v, price: e.target.value }))}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-muted mb-1 block">Stock</label>
                      <Input
                        type="number"
                        min="0"
                        value={editValues.stock}
                        onChange={e => setEditValues(v => ({ ...v, stock: e.target.value }))}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => saveEdit(p.id)}>
                      <Check className="w-3.5 h-3.5" /> Save
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={cancelEdit}>
                      <X className="w-3.5 h-3.5" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold">{formatCurrency(p.price)}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted">Stock: {p.stock}</span>
                    <button
                      className="text-secondary text-xs hover:underline"
                      onClick={() => startEdit(p)}
                    >
                      Edit listing
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
