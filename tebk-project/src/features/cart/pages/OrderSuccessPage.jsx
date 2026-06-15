import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'

export function OrderSuccessPage() {
  const { orderId } = useParams()
  const { t } = useTranslation()

  if (!orderId) return null

  return (
    <div className="page-container py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h1 className="text-3xl font-display font-bold text-primary mb-3">{t('orders.placed_title')}</h1>
        <p className="text-muted leading-relaxed mb-2">
          {t('orders.placed_desc')}
        </p>
        <p className="text-sm text-muted mb-8">
          {t('orders.ref_label')} <span className="font-mono font-medium text-ink">#{orderId.slice(0, 8).toUpperCase()}</span>
        </p>

        <div className="card mb-6">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-clinical flex items-center justify-center">
              <Package className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">{t('orders.delivery_title')}</p>
              <p className="text-xs text-muted">{t('orders.delivery_time')}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1">
            <Link to="/orders">{t('orders.view_orders')} <ArrowRight className="w-4 h-4" /></Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link to="/products">{t('orders.continue_shopping')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
