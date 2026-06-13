import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Package, Check, X } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { fetchAllProducts, updateProduct } from '@/services/adminProductService'
import { formatCurrency } from '@/lib/utils'

const STATUS_STYLES = {
  active:        'badge-success',
  low_stock:     'badge-warning',
  out_of_stock:  'badge-danger',
}

function stockStatus(stock) {
  if (stock === 0)  return 'out_of_stock'
  if (stock < 20)   return 'low_stock'
  return 'active'
}

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <td key={i} className="px-5 py-3.5">
          <div className="h-4 bg-slate-100 rounded" style={{ width: i === 1 ? '75%' : '50%' }} />
        </td>
      ))}
    </tr>
  )
}

export function Products() {
  const queryClient = useQueryClient()
  const [search,     setSearch]   = useState('')
  const [editingId,  setEditing]  = useState(null)
  const [editValues, setEditVals] = useState({})

  const { data: raw, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn:  fetchAllProducts,
  })
  const products = raw?.data || []

  const { mutate: saveProduct, isPending: saving } = useMutation({
    mutationFn: ({ id, updates }) => updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      setEditing(null)
    },
  })

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.categories?.name || '').toLowerCase().includes(search.toLowerCase())
  )

  const activeCount   = products.filter(p => stockStatus(p.stock) === 'active').length
  const outCount      = products.filter(p => p.stock === 0).length

  const startEdit = (p) => {
    setEditing(p.id)
    setEditVals({ price: p.price, stock: p.stock })
  }
  const cancelEdit = () => setEditing(null)
  const confirmEdit = (id) => {
    const price = Number(editValues.price)
    const stock = Number(editValues.stock)
    if (isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) return
    saveProduct({ id, updates: { price, stock } })
  }

  return (
    <div className="space-y-5">
      <h1 className="section-title">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Products"  value={isLoading ? '…' : products.length.toString()} icon={Package} />
        <StatCard title="Active"          value={isLoading ? '…' : activeCount.toString()}      icon={Package} />
        <StatCard title="Out of Stock"    value={isLoading ? '…' : outCount.toString()}         icon={Package} />
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products or category…"
          className="input-base pl-10 text-sm"
        />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-muted font-semibold uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left">Product</th>
                <th className="px-5 py-3 text-left">Category</th>
                <th className="px-5 py-3 text-right">Price (EGP)</th>
                <th className="px-5 py-3 text-right">Stock</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} />)
                : filtered.length === 0
                  ? <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">No products found.</td></tr>
                  : filtered.map(p => {
                    const status = stockStatus(p.stock)
                    const isEditing = editingId === p.id
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-ink max-w-[200px] truncate">{p.name}</td>
                        <td className="px-5 py-3.5 text-muted capitalize">{p.categories?.name || p.category || '—'}</td>
                        <td className="px-5 py-3.5 text-right">
                          {isEditing ? (
                            <input
                              type="number"
                              min="1"
                              value={editValues.price}
                              onChange={e => setEditVals(v => ({ ...v, price: e.target.value }))}
                              className="input-base text-right text-sm w-24 py-1"
                            />
                          ) : formatCurrency(p.price)}
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold text-ink">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              value={editValues.stock}
                              onChange={e => setEditVals(v => ({ ...v, stock: e.target.value }))}
                              className="input-base text-right text-sm w-20 py-1"
                            />
                          ) : p.stock.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={STATUS_STYLES[status]}>{status.replace('_', ' ')}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          {isEditing ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => confirmEdit(p.id)}
                                disabled={saving}
                                className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEdit(p)}
                              className="text-xs text-primary hover:underline"
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
