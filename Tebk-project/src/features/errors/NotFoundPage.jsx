import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-[60vh] flex items-center justify-center page-container py-16">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-clinical flex items-center justify-center mx-auto mb-6">
          <Search className="w-10 h-10 text-muted" />
        </div>
        <p className="text-6xl font-display font-bold text-primary/20 mb-4">404</p>
        <h1 className="text-2xl font-semibold text-primary mb-3">{t('errors.not_found')}</h1>
        <p className="text-muted mb-8">{t('errors.not_found_desc')}</p>
        <Button asChild>
          <Link to="/">{t('errors.go_home')}</Link>
        </Button>
      </div>
    </div>
  )
}
