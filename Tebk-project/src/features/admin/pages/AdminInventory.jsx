import { Warehouse, Package, AlertTriangle, TrendingDown } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { StatCard } from '@/components/shared/StatCard'

const MOCK_INVENTORY = [
  { id: 1, name: 'Surgical Gloves (L)', sku: 'SG-L-001', stock: 1240, reorder: 200, status: 'in_stock' },
  { id: 2, name: 'N95 Respirator Masks', sku: 'NR-N95-010', stock: 85, reorder: 100, status: 'low_stock' },
  { id: 3, name: 'IV Cannula 20G', sku: 'IVC-20G-050', stock: 0, reorder: 50, status: 'out_of_stock' },
  { id: 4, name: 'Disposable Syringes 5ml', sku: 'DS-5ML-200', stock: 3400, reorder: 500, status: 'in_stock' },
  { id: 5, name: 'Bandage Roll 5cm', sku: 'BR-5CM-100', stock: 60, reorder: 150, status: 'low_stock' },
  { id: 6, name: 'Alcohol Swabs (box/200)', sku: 'AS-BOX-200', stock: 420, reorder: 100, status: 'in_stock' },
]

const STATUS = {
  in_stock:    { label: 'In Stock',    cls: 'bg-emerald-50 text-emerald-700' },
  low_stock:   { label: 'Low Stock',   cls: 'bg-amber-50 text-amber-700' },
  out_of_stock:{ label: 'Out of Stock',cls: 'bg-red-50 text-red-700' },
}

export function AdminInventory() {
  usePageTitle('Inventory — Admin')

  const lowCount  = MOCK_INVENTORY.filter(i => i.status === 'low_stock').length
  const outCount  = MOCK_INVENTORY.filter(i => i.status === 'out_of_stock').length
  const totalSkus = MOCK_INVENTORY.length

  return (
    <div className="space-y-6">
      <h1 className="section-title">Inventory</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total SKUs"     value={totalSkus}  icon={Package} />
        <StatCard title="Low Stock"      value={lowCount}   icon={TrendingDown} trend={-lowCount} />
        <StatCard title="Out of Stock"   value={outCount}   icon={AlertTriangle} />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Warehouse className="w-4 h-4 text-secondary" />
          <h2 className="font-semibold text-primary">Stock Levels</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-muted font-semibold uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">SKU</th>
                <th className="px-6 py-3 text-right">Stock</th>
                <th className="px-6 py-3 text-right">Reorder At</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_INVENTORY.map(item => {
                const { label, cls } = STATUS[item.status]
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-ink">{item.name}</td>
                    <td className="px-6 py-4 text-muted font-mono text-xs">{item.sku}</td>
                    <td className="px-6 py-4 text-right font-semibold text-primary">{item.stock.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-muted">{item.reorder}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
                        {label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
