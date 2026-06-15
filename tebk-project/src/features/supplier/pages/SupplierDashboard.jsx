import { Package, ShoppingBag, TrendingUp, Clock, CheckCircle, Truck } from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/format'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useTranslation } from '@/hooks/useTranslation'

const MOCK_FULFILLMENT_ORDERS = [
  { id: 'ORD-1041', clinic: 'Cairo Medical Center',    product: 'Nitrile Gloves Box 100',     qty: 20, status: 'pending',    total: 2400 },
  { id: 'ORD-1038', clinic: 'Al Salam Hospital',       product: 'Disposable Syringes 5ml',    qty: 10, status: 'processing', total: 950  },
  { id: 'ORD-1035', clinic: 'Nile Clinic',             product: 'N95 Respirators Box 20',     qty: 8,  status: 'shipped',    total: 1680 },
  { id: 'ORD-1031', clinic: 'Delta Health Center',     product: 'Blood Collection Tubes EDTA',qty: 15, status: 'shipped',    total: 2175 },
  { id: 'ORD-1028', clinic: 'Alexandria Dental Clinic',product: 'Dental Examination Kit',     qty: 5,  status: 'pending',    total: 1400 },
]

const STATUS_VARIANT = { pending: 'warning', processing: 'default', shipped: 'success' }
const STATUS_ICON    = { pending: Clock, processing: Package, shipped: Truck }

export function SupplierDashboard() {
  usePageTitle('Supplier Dashboard')
  const { t } = useTranslation()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">{t('supplier.dashboard_title')}</h1>
        <p className="text-muted text-sm mt-1">{t('supplier.dashboard_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('supplier.stat_active')}    value="12"                    icon={Package}     trend={5}  />
        <StatCard title={t('supplier.stat_pending')}   value="3"                     icon={Clock}                  />
        <StatCard title={t('supplier.stat_revenue')}   value={formatCurrency(28400)} icon={TrendingUp}  trend={22} />
        <StatCard title={t('supplier.stat_fulfilled')} value="45"                    icon={CheckCircle} trend={18} />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-primary">{t('supplier.recent_title')}</h2>
          <p className="text-xs text-muted mt-0.5">{t('supplier.recent_subtitle')}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                {[t('supplier.col_order_id'), t('supplier.col_clinic'), t('supplier.col_product'), t('supplier.col_qty'), t('supplier.col_total'), t('supplier.col_status'), t('supplier.col_action')].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_FULFILLMENT_ORDERS.map(order => {
                const Icon = STATUS_ICON[order.status]
                return (
                  <tr key={order.id} className="hover:bg-clinical transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-secondary">{order.id}</td>
                    <td className="px-4 py-3 font-medium text-ink">{order.clinic}</td>
                    <td className="px-4 py-3 text-muted max-w-[200px] truncate">{order.product}</td>
                    <td className="px-4 py-3 text-muted">×{order.qty}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANT[order.status]} className="capitalize flex items-center gap-1 w-fit">
                        <Icon className="w-3 h-3" />
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {order.status === 'pending' && (
                        <Button size="sm" variant="outline">{t('supplier.mark_processing')}</Button>
                      )}
                      {order.status === 'processing' && (
                        <Button size="sm">{t('supplier.mark_shipped')}</Button>
                      )}
                      {order.status === 'shipped' && (
                        <span className="text-xs text-muted">{t('supplier.delivered')}</span>
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
