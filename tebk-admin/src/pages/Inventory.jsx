import { useQuery } from '@tanstack/react-query'
import { Warehouse, AlertTriangle, TrendingDown } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { fetchAllProducts } from '@/services/adminProductService'

const STATUS_STYLES = {
  in_stock:     'badge-success',
  low_stock:    'badge-warning',
  out_of_stock: 'badge-danger',
}

function stockStatus(stock) {
  if (stock === 0)  return 'out_of_stock'
  if (stock < 20)   return 'low_stock'
  return 'in_stock'
}

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4].map(i => (
        <td key={i} className="px-5 py-3.5">
          <div className="h-4 bg-slate-100 rounded" style={{ width: i === 1 ? '70%' : '40%' }} />
        </td>
      ))}
    </tr>
  )
}

export function Inventory() {
  const { data: raw, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn:  fetchAllProducts,
  })

  const products = raw?.data || []
  const inventory = products.map(p => ({
    id:       p.id,
    name:     p.name,
    category: p.categories?.name || p.category || '—',
    stock:    p.stock,
    reorder:  20,
    status:   stockStatus(p.stock),
  }))

  const low = inventory.filter(i => i.status === 'low_stock').length
  const out = inventory.filter(i => i.status === 'out_of_stock').length

  return (
    <div className="space-y-5">
      <h1 className="section-title">Inventory</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total SKUs"   value={isLoading ? '…' : inventory.length.toString()} icon={Warehouse} />
        <StatCard title="Low Stock"    value={isLoading ? '…' : low.toString()}              icon={TrendingDown} />
        <StatCard title="Out of Stock" value={isLoading ? '…' : out.toString()}              icon={AlertTriangle} />
      </div>

      {!isLoading && out > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-danger text-sm rounded-2xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {out} product{out > 1 ? 's are' : ' is'} out of stock and need restocking.
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <Warehouse className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-ink">Stock Levels</h2>
          {!isLoading && <span className="text-xs text-muted ml-auto">{inventory.length} products tracked</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-muted font-semibold uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left">Product</th>
                <th className="px-5 py-3 text-left">Category</th>
                <th className="px-5 py-3 text-right">In Stock</th>
                <th className="px-5 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading
                ? Array.from({ length: 7 }).map((_, i) => <TableRowSkeleton key={i} />)
                : inventory.length === 0
                  ? <tr><td colSpan={4} className="px-5 py-10 text-center text-muted">No products found.</td></tr>
                  : inventory.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-ink">{item.name}</td>
                      <td className="px-5 py-3.5 text-muted capitalize">{item.category}</td>
                      <td className={`px-5 py-3.5 text-right font-semibold ${item.status === 'out_of_stock' ? 'text-danger' : item.status === 'low_stock' ? 'text-warning' : 'text-ink'}`}>
                        {item.stock.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={STATUS_STYLES[item.status]}>{item.status.replace('_', ' ')}</span>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
