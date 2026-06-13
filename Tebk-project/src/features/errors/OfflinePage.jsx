import { WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'

export function OfflinePage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background page-container py-16">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-clinical flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-muted" />
        </div>
        <h1 className="text-2xl font-semibold text-primary mb-3">{t('errors.offline')}</h1>
        <p className="text-muted mb-8">{t('errors.offline_desc')}</p>
        <Button onClick={() => window.location.reload()}>
          {t('errors.retry')}
        </Button>
      </div>
    </div>
  )
}
