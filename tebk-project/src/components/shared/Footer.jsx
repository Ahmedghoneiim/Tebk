import { Link } from 'react-router-dom'
import { useTranslation } from '@/hooks/useTranslation'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-display font-bold text-xl">TEBK</span>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed">{t('footer.tagline')}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-primary-200">{t('footer.platform')}</h4>
            <ul className="space-y-2 text-sm text-primary-200">
              <li><Link to="/products"     className="hover:text-white transition-colors">{t('footer.products')}</Link></li>
              <li><Link to="/bundles"      className="hover:text-white transition-colors">{t('footer.bundles')}</Link></li>
              <li><Link to="/assistant"    className="hover:text-white transition-colors">{t('footer.assistant')}</Link></li>
              <li><Link to="/image-search" className="hover:text-white transition-colors">{t('footer.image_search')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-primary-200">{t('footer.account')}</h4>
            <ul className="space-y-2 text-sm text-primary-200">
              <li><Link to="/dashboard"     className="hover:text-white transition-colors">{t('footer.dashboard')}</Link></li>
              <li><Link to="/orders"        className="hover:text-white transition-colors">{t('footer.orders')}</Link></li>
              <li><Link to="/profile"       className="hover:text-white transition-colors">{t('footer.profile')}</Link></li>
              <li><Link to="/settings"      className="hover:text-white transition-colors">{t('footer.settings')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-primary-200">{t('footer.legal')}</h4>
            <ul className="space-y-2 text-sm text-primary-200">
              <li><Link to="/terms"              className="hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="/privacy"            className="hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to="/medical-disclaimer" className="hover:text-white transition-colors">{t('footer.disclaimer')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-primary-300 text-sm">© {new Date().getFullYear()} TEBK. {t('footer.rights')}</p>
          <p className="text-primary-300 text-xs">For B2B procurement only. Not for direct patient care.</p>
        </div>
      </div>
    </footer>
  )
}
