import { Link } from 'react-router-dom'
import { useTranslation } from '@/hooks/useTranslation'
import { ArrowUp } from 'lucide-react'

const SOCIALS = ['IG', 'FB', 'TW']

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="mt-auto text-white">

      {/* ── Wave divider (light mode) ── */}
      <div className="dark:hidden bg-white">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="w-full block"
          style={{ height: '72px' }}
        >
          <path d="M0,0 Q720,80 1440,0 L1440,80 L0,80 Z" fill="#213360" />
        </svg>
      </div>

      {/* ── Wave divider (dark mode) ── */}
      <div className="hidden dark:block bg-slate-950">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="w-full block"
          style={{ height: '72px' }}
        >
          <path d="M0,0 Q720,80 1440,0 L1440,80 L0,80 Z" fill="#0f172a" />
        </svg>
      </div>

      {/* ── Main content ── */}
      <div className="bg-primary dark:bg-slate-950">
        <div className="page-container pt-4 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="font-display font-bold text-xl">TEBK</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                {t('footer.tagline')}
              </p>
              {/* Social icons */}
              <div className="flex gap-3">
                {SOCIALS.map(s => (
                  <button
                    key={s}
                    className="w-10 h-10 rounded-full border border-white/25 text-white/60 text-xs font-semibold hover:border-white hover:text-white transition-all duration-200 hover:scale-110"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-semibold mb-5 text-sm uppercase tracking-wider text-white">
                {t('footer.platform')}
              </h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link to="/products"     className="hover:text-white transition-colors">{t('footer.products')}</Link></li>
                <li><Link to="/bundles"      className="hover:text-white transition-colors">{t('footer.bundles')}</Link></li>
                <li><Link to="/assistant"    className="hover:text-white transition-colors">{t('footer.assistant')}</Link></li>
                <li><Link to="/image-search" className="hover:text-white transition-colors">{t('footer.image_search')}</Link></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-semibold mb-5 text-sm uppercase tracking-wider text-white">
                {t('footer.account')}
              </h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">{t('footer.dashboard')}</Link></li>
                <li><Link to="/orders"    className="hover:text-white transition-colors">{t('footer.orders')}</Link></li>
                <li><Link to="/profile"   className="hover:text-white transition-colors">{t('footer.profile')}</Link></li>
                <li><Link to="/settings"  className="hover:text-white transition-colors">{t('footer.settings')}</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-5 text-sm uppercase tracking-wider text-white">
                {t('footer.legal')}
              </h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link to="/terms"              className="hover:text-white transition-colors">{t('footer.terms')}</Link></li>
                <li><Link to="/privacy"            className="hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
                <li><Link to="/medical-disclaimer" className="hover:text-white transition-colors">{t('footer.disclaimer')}</Link></li>
              </ul>
            </div>
          </div>

          {/* ── Bottom: scroll-to-top + copyright ── */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5 text-white" />
            </button>

            <div className="w-full border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-white/40 text-sm">
                © {new Date().getFullYear()} TEBK. {t('footer.rights')}
              </p>
              <p className="text-white/30 text-xs">
                For B2B procurement only. Not for direct patient care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
