import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Warehouse, AlertTriangle, Plus, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { fetchInventory, exportInventoryCSV } from '@/services/inventoryService'
import { useAuthStore } from '@/store/authStore'
import { usePageTitle } from '@/hooks/usePageTitle'

const TABLE_HEADERS = ['Product', 'Category', 'Current Stock', 'Min Threshold', 'Monthly Usage', 'Status', 'Action']

function TableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map(i => (
        <tr key={i} className="animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7].map(j => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-clinical rounded" style={{ width: j === 1 ? '80%' : j === 7 ? '60%' : '50%' }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export function InventoryPage() {
  usePageTitle('Inventory')
  const user = useAuthStore(s => s.user)
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['inventory', user?.id],
    queryFn:  () => fetchInventory(user?.id),
    enabled:  !!user?.id,
  })

  const allItems = data?.data || []
  const items = allItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
  const lowStockCount = items.filter(i => i.current_stock <= i.min_threshold).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="section-title">Inventory</h1>
          <p className="text-muted text-sm mt-1">
            {isLoading ? 'Loading…' : `${items.length} tracked items · ${lowStockCount} low stock alerts`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportInventoryCSV(items)}
            disabled={isLoading || items.length === 0}
          >
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button size="sm"><Plus className="w-4 h-4" /> Add Item</Button>
        </div>
      </div>

      {!isLoading && lowStockCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-yellow-800">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {lowStockCount} item{lowStockCount > 1 ? 's are' : ' is'} running low. Consider reordering.
        </div>
      )}

      <div className="relative max-w-xs">
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search inventory…" className="pl-9" />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                {TABLE_HEADERS.map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <TableSkeleton />
              ) : items.map(item => {
                const isLow = item.current_stock <= item.min_threshold
                return (
                  <tr key={item.id} className="hover:bg-clinical transition-colors">
                    <td className="px-4 py-3 font-medium text-ink">{item.name}</td>
                    <td className="px-4 py-3 text-muted capitalize">{item.category}</td>
                    <td className={`px-4 py-3 font-semibold ${isLow ? 'text-warning' : 'text-primary'}`}>{item.current_stock}</td>
                    <td className="px-4 py-3 text-muted">{item.min_threshold}</td>
                    <td className="px-4 py-3 text-muted">{item.monthly_usage}/mo</td>
                    <td className="px-4 py-3">
                      {isLow
                        ? <Badge variant="warning"><AlertTriangle className="w-3 h-3 mr-1" />Low Stock</Badge>
                        : <Badge variant="success">OK</Badge>
                      }
                    </td>
                    <td className="px-4 py-3">
                      {isLow && (
                        <Link
                          to={`/products?search=${encodeURIComponent(item.name)}`}
                          className="text-secondary text-xs hover:underline"
                        >
                          Reorder
                        </Link>
                      )}
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
