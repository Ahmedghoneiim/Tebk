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
import { useTranslation } from '@/hooks/useTranslation'

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
  const { t } = useTranslation()
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
          <h1 className="section-title">{t('inventory.title')}</h1>
          <p className="text-muted text-sm mt-1">
            {isLoading ? t('common.loading') : t('inventory.subtitle').replace('{count}', items.length).replace('{low}', lowStockCount)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportInventoryCSV(items)}
            disabled={isLoading || items.length === 0}
          >
            <Download className="w-4 h-4" /> {t('inventory.export_csv')}
          </Button>
          <Button size="sm"><Plus className="w-4 h-4" /> {t('inventory.add_item')}</Button>
        </div>
      </div>

      {!isLoading && lowStockCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-yellow-800">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {t('inventory.low_stock_banner').replace('{n}', lowStockCount)}
        </div>
      )}

      <div className="relative max-w-xs">
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('inventory.search_placeholder')} className="pl-9" />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                {[t('inventory.col_product'), t('inventory.col_category'), t('inventory.col_current'), t('inventory.col_min'), t('inventory.col_monthly'), t('inventory.col_status'), t('inventory.col_action')].map(h => (
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
                        ? <Badge variant="warning"><AlertTriangle className="w-3 h-3 mr-1" />{t('inventory.status_low')}</Badge>
                        : <Badge variant="success">{t('inventory.status_ok')}</Badge>
                      }
                    </td>
                    <td className="px-4 py-3">
                      {isLow && (
                        <Link
                          to={`/products?search=${encodeURIComponent(item.name)}`}
                          className="text-secondary text-xs hover:underline"
                        >
                          {t('inventory.reorder')}
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
